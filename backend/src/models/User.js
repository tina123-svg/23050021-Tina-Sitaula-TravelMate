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
    avatar: {
      type: String,
      default: ""
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: []
    }],

    //traveler fields
    // In models/User.js, add these to the schema:
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String },
    nationality: { type: String, default: "Nepali" },
    emergencyContact: { type: String },
    dateOfBirth: { type: Date },
    passportNumber: { type: String },
    dietaryPreferences: { type: String },
    medicalConditions: { type: String },

    // Agency fields
    agencyName: { type: String },
    agencyAddress: { type: String },
    agencyPhone: { type: String },
    licenseNumber: { type: String },
    agencyDescription: { type: String },

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