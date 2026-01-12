// controllers/dashboardController.js
const Package = require("../models/Package");
const Booking = require("../models/Booking");

 exports.getDashboardStats = async (req, res) => {
  try {
    const agencyId = req.user.id;

    // Simple counts - no complex aggregations
    const totalPackages = await Package.countDocuments({ agencyId });
    const activeBookings = await Booking.countDocuments({
      agencyId,
      status: { $in: ["pending", "confirmed"] }
    });

    // Unique customers count
    const totalCustomers = await Booking.distinct("travelerId", { agencyId });

    // Recent bookings (3 only)
    const recentBookings = await Booking.find({ agencyId })
      .populate("packageId", "title")
      .sort({ createdAt: -1 })
      .limit(3)
      .select("travelers startDate status");

    // Recent reviews - empty for now
    const recentReviews = [];

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPackages,
          activeBookings,
          totalCustomers: totalCustomers.length,
          avgRating: 4.8 
        },
        recentBookings: recentBookings.map(b => ({
          package: b.packageId?.title || "Unknown Package",
          date: b.startDate.toISOString().split("T")[0],
          travelers: b.travelers,
          status: b.status
        })),
        recentReviews 
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};