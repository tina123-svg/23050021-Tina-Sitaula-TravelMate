// profileRoutes.js
const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const dashboardController = require("../controller/dashboardController");
const {
  getAgencyProfile,
  updateAgencyProfile,
  changePassword
} = require("../controller/profileController");
const { uploadSingle } = require("../utils/upload"); 

// Apply auth middleware
router.use(protect);
router.use(restrictTo("agency"));

// Profile routes - use uploadSingle
router.get("/profile", getAgencyProfile);
router.put("/profile", uploadSingle, updateAgencyProfile);
router.put("/profile/password", changePassword);
router.get("/dashboard/stats", dashboardController.getDashboardStats);

module.exports = router;