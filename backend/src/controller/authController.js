const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const { generateToken, generateResetToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// SIGN UP
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = "traveler",
      agencyName,
      agencyAddress,
      agencyPhone,
      licenseNumber,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);

    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
      status: role === "agency" ? "pending" : "approved",
    };

    if (role === "agency") {
      if (!agencyName || !agencyAddress || !agencyPhone || !licenseNumber) {
        return res.status(400).json({ message: "All agency fields are required" });
      }
      userData.agencyName = agencyName.trim();
      userData.agencyAddress = agencyAddress.trim();
      userData.agencyPhone = agencyPhone.trim();
      userData.licenseNumber = licenseNumber.trim();
    } else {
      if (agencyName || agencyAddress || agencyPhone || licenseNumber) {
        return res.status(400).json({ message: "Agency fields are not allowed for travelers" });
      }
    }

    const user = await User.create(userData);

    const { password: _, ...userWithoutPassword } = user.toObject();

    if (role === "agency") {
      return res.status(201).json({
        success: true,
        message: "Agency registration successful! Your account is pending admin approval.",
        user: userWithoutPassword,
      });
    }

    // Only generate token for non-pending users (travelers)
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // BLOCK PENDING OR REJECTED AGENCIES
    if (user.role === "agency") {
      if (user.status === "pending") {
        return res.status(403).json({
          message: "Your agency account is pending approval. Please wait for admin review.",
        });
      }
      if (user.status === "rejected") {
        return res.status(403).json({
          message: "Your agency account was rejected. Contact support for details.",
        });
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// FORGOT PASSWORD - Generate OTP
const sendEmail = require("../utils/sendEmail"); 

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  user.resetOtp = otp;
  user.resetOtpExpiry = otpExpiry;
  await user.save();

  // Send real email
  try {
    await sendEmail({
      to: email,
      subject: "Travel Mate - Password Reset OTP",
      text: `Your one-time password (OTP) is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this reset, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0F4CB5; text-align: center;">Travel Mate Password Reset</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">You requested a password reset. Your OTP is:</p>
          <h1 style="font-size: 36px; text-align: center; letter-spacing: 10px; color: #F59E0B; margin: 20px 0;">
            ${otp}
          </h1>
          <p style="font-size: 16px;">This code will expire in <strong>10 minutes</strong>.</p>
          <p style="font-size: 14px; color: #666;">
            If you did not request this, please ignore this email or contact support immediately.
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 14px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} Travel Mate. All rights reserved.
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent to your email address",
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
    // Still save OTP even if email fails
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again or contact support.",
    });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: "Required fields missing" });

  const inputOtp = otp.toString().trim();
  const user = await User.findOne({
    email: email.toLowerCase(),
    resetOtp: inputOtp,
    resetOtpExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  res.json({ success: true, message: "OTP verified" });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = await hashPassword(password);
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id, user.role);

  res.json({ success: true, message: "Password reset successful", token });
};

module.exports = { register, login, forgotPassword, resetPassword, verifyOtp };