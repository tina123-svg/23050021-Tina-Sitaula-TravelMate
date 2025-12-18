const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");

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

    // Use generateToken 
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
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

    //  Use comparePassword
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login };