const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getAgencyBookings,
  getBooking,
  updateBookingStatus,
  updatePaymentStatus,
  getBookingStats,
  exportBookings
} = require("../controller/bookingController");

// Apply auth middleware to all agency routes
router.use(protect);
router.use(restrictTo("agency"));
router.get("/bookings", getAgencyBookings);
router.get("/bookings/stats", getBookingStats);
router.get("/bookings/export", exportBookings);
router.get("/bookings/:id", getBooking);
router.patch("/bookings/:id/status", updateBookingStatus);
router.patch("/bookings/:id/payment", updatePaymentStatus);


module.exports = router;