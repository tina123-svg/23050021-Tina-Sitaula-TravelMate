const User = require("../models/User");

const getPendingAgencies = async (req, res) => {
  try {
    const agencies = await User.find({ role: "agency", status: "pending" }).select("-password");
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const approveAgency = async (req, res) => {
  try {
    const agency = await User.findById(req.params.id);
    if (!agency || agency.role !== "agency") {
      return res.status(404).json({ message: "Agency not found" });
    }
    agency.status = "approved";
    await agency.save();
    res.json({ message: "Agency approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const rejectAgency = async (req, res) => {
  try {
    const agency = await User.findById(req.params.id);
    if (!agency || agency.role !== "agency") {
      return res.status(404).json({ message: "Agency not found" });
    }
    agency.status = "rejected";
    await agency.save();
    res.json({ message: "Agency rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPendingAgencies, approveAgency, rejectAgency };