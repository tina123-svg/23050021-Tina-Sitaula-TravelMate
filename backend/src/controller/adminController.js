const User = require("../models/User");
const Booking = require("../models/Booking");
const Package = require("../models/Package");

// Existing functions...
exports.getPendingAgencies = async (req, res) => {
  try {
    const agencies = await User.find({ role: "agency", status: "pending" }).select("-password");
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveAgency = async (req, res) => {
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

exports.rejectAgency = async (req, res) => {
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

exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalAgencies = await User.countDocuments({ role: "agency", status: "approved" });
    const pendingAgencies = await User.countDocuments({ role: "agency", status: "pending" });
    const totalTravelers = await User.countDocuments({ role: "traveler" });
    const totalPackages = await Package.countDocuments({ status: "active" });
    const totalBookings = await Booking.countDocuments();

    // Recent activity (last 5)
    const recentAgencies = await User.find({ role: "agency" })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("agencyName email createdAt status");

    const recentBookings = await Booking.find()
      .populate("packageId", "title")
      .populate("travelerId", "fullName")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      data: {
        stats: {
          totalAgencies,
          pendingAgencies,
          totalTravelers,
          totalPackages,
          totalBookings
        },
        recent: {
          agencies: recentAgencies,
          bookings: recentBookings.map(b => ({
            id: b._id,
            bookingId: b.bookingId,
            package: b.packageId?.title,
            traveler: b.travelerId?.fullName,
            amount: b.totalAmount,
            status: b.status,
            date: b.createdAt
          }))
        }
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (for management)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings (platform-wide)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("packageId", "title")
      .populate("travelerId", "fullName email")
      .populate("agencyId", "agencyName")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Block/Unblock user
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle between active and blocked (you can add a 'blocked' status)
    user.status = user.status === "blocked" ? "approved" : "blocked";
    await user.save();

    res.json({
      success: true,
      message: `User ${user.status === "blocked" ? "blocked" : "unblocked"}`
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};