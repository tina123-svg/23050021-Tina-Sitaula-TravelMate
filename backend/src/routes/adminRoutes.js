const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getPendingAgencies,
  approveAgency,
  rejectAgency,
  getDashboardStats,      
  getAllUsers,
  getAllBookings,
  toggleUserStatus
} = require("../controller/adminController");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

 router.get("/dashboard-stats", getDashboardStats);

 router.get("/pending-agencies", getPendingAgencies);
router.post("/approve/:id", approveAgency);
router.post("/reject/:id", rejectAgency);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id/toggle", toggleUserStatus);

// Bookings
router.get("/bookings", getAllBookings);

module.exports = router;