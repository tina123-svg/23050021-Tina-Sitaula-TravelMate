const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

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

    // Basic required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    // Simple email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
    };

    if (role === "agency") {
      // Agency-specific required fields
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

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

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

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

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