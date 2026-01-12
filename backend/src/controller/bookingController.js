// controllers/bookingController.js
const Booking = require("../models/Booking");
const Package = require("../models/Package");
const mongoose = require("mongoose");

// Helper: Generate booking stats
const getBookingStats = async (agencyId) => {
  const stats = await Booking.aggregate([
    { $match: { agencyId: new mongoose.Types.ObjectId(agencyId) } },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
        },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
        },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$paymentStatus", "paid"] },
              "$totalAmount",
              0
            ]
          }
        },
        totalTravelers: { $sum: "$travelers" }
      }
    }
  ]);

  return stats[0] || {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalTravelers: 0
  };
};

//     Get all bookings for agency
exports.getAgencyBookings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query for agency's bookings
    let query = { agencyId: req.user.id };

    // Filter by status
    if (status && ["pending", "confirmed", "cancelled"].includes(status)) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: "i" } },
        { "travelerInfo.name": { $regex: search, $options: "i" } },
        { "travelerInfo.email": { $regex: search, $options: "i" } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get bookings with package details
    const bookings = await Booking.find(query)
      .populate("packageId", "title destination duration") // Get package info
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-__v");

    // Format response to match frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      bookingId: booking.bookingId,
      package: booking.packageId?.title || "Package not found",
      customer: booking.travelerInfo.name,
      email: booking.travelerInfo.email,
      phone: booking.travelerInfo.phone,
      travelers: booking.travelers,
      totalAmount: `NPR ${booking.totalAmount.toLocaleString()}`,
      bookingDate: booking.bookingDate.toISOString().split("T")[0],
      startDate: booking.startDate.toISOString().split("T")[0],
      status: booking.status,
      paymentStatus: booking.paymentStatus
    }));

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    // Get stats for the agency
    const stats = await getBookingStats(req.user.id);

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      stats: {
        totalBookings: stats.totalBookings,
        confirmedBookings: stats.confirmedBookings,
        pendingBookings: stats.pendingBookings,
        totalRevenue: stats.totalRevenue
      },
      data: formattedBookings
    });

  } catch (error) {
    console.error("Get Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//     Get single booking details
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agencyId: req.user.id
    })
      .populate("packageId", "title description price duration difficulty destination images")
      .populate("travelerId", "name email phone")
      .select("-__v");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error("Get Booking Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be: pending, confirmed, or cancelled"
      });
    }

    // Find and update booking
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        agencyId: req.user.id
      },
      { status },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // If cancelled and paid, update payment status to refunded
    if (status === "cancelled" && booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
      await booking.save();
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: {
        bookingId: booking.bookingId,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//     Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    // Validate payment status
    if (!["pending", "paid", "failed", "refunded"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        agencyId: req.user.id
      },
      {
        paymentStatus,
        ...(paymentStatus === "paid" && {
          "paymentDetails.paidAt": new Date()
        })
      },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: {
        bookingId: booking.bookingId,
        paymentStatus: booking.paymentStatus
      }
    });

  } catch (error) {
    console.error("Update Payment Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//  Get booking statistics for dashboard
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await getBookingStats(req.user.id);

    // Get recent bookings (last 5)
    const recentBookings = await Booking.find({ agencyId: req.user.id })
      .populate("packageId", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("bookingId packageId travelerInfo.name status totalAmount createdAt");

    // Format recent bookings
    const formattedRecent = recentBookings.map(booking => ({
      bookingId: booking.bookingId,
      package: booking.packageId?.title || "Unknown Package",
      customer: booking.travelerInfo.name,
      amount: booking.totalAmount,
      status: booking.status,
      date: booking.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        recentBookings: formattedRecent
      }
    });

  } catch (error) {
    console.error("Get Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//     Export bookings as CSV
exports.exportBookings = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    // Build query
    let query = { agencyId: req.user.id };

    // Date filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Status filter
    if (status && ["pending", "confirmed", "cancelled"].includes(status)) {
      query.status = status;
    }

    // Get bookings for export
    const bookings = await Booking.find(query)
      .populate("packageId", "title")
      .sort({ createdAt: -1 })
      .select("bookingId travelerInfo.name travelerInfo.email travelers totalAmount status paymentStatus createdAt");

    // Create CSV content
    let csvContent = "Booking ID,Customer Name,Email,Travelers,Amount,Status,Payment Status,Booking Date\n";

    bookings.forEach(booking => {
      const row = [
        booking.bookingId,
        booking.travelerInfo.name,
        booking.travelerInfo.email,
        booking.travelers,
        booking.totalAmount,
        booking.status,
        booking.paymentStatus,
        booking.createdAt.toISOString().split("T")[0]
      ].map(field => `"${field}"`).join(",");

      csvContent += row + "\n";
    });

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=bookings_${Date.now()}.csv`);

    return res.send(csvContent);

  } catch (error) {
    console.error("Export Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export bookings",
      error: error.message
    });
  }
};