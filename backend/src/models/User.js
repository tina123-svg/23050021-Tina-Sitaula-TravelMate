const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["traveler", "agency", "admin"],
      default: "traveler",
    },

    // Agency fields only for agencies
    agencyName: { type: String },
    agencyAddress: { type: String },
    agencyPhone: { type: String },
    licenseNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
