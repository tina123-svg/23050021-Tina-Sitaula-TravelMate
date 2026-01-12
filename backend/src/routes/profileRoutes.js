const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const dashboardController = require("../controller/dashboardController");

const {
  getAgencyProfile,
  updateAgencyProfile,
  changePassword
} = require("../controller/profileController");

// Apply auth middleware
router.use(protect);
router.use(restrictTo("agency"));

// Profile routes
router.get("/profile", getAgencyProfile);
router.put("/profile", updateAgencyProfile);
router.put("/profile/password", changePassword);
router.get("/dashboard/stats", dashboardController.getDashboardStats);


module.exports = router;