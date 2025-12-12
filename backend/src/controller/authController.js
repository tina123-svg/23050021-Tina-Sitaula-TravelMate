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
      role,
      agencyName,
      agencyAddress,
      agencyPhone,
      licenseNumber,
    } = req.body;

    // If user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // If traveler but agency fields sent → ignore
    const userData = {
      fullName,
      email,
      password: hashed,
      role,
    };

    if (role === "agency") {
      userData.agencyName = agencyName;
      userData.agencyAddress = agencyAddress;
      userData.agencyPhone = agencyPhone;
      userData.licenseNumber = licenseNumber;

      if (!agencyName || !agencyAddress || !agencyPhone || !licenseNumber) {
        return res.status(400).json({ message: "Agency fields required" });
      }
    }

    const user = await User.create(userData);

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login };
