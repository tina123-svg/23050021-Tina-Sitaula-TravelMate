const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["traveler", "agency", "admin"],
      default: "traveler",
    },

    // Agency fields
    agencyName: { type: String },
    agencyAddress: { type: String },
    agencyPhone: { type: String },
    licenseNumber: { type: String },

    // Approval status for agencies
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // OTP for forgot password
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);