const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getTravelerProfile,
  updateTravelerProfile,
  changeTravelerPassword
} = require("../controller/travelerProfileController");
const { uploadTravelerProfile } = require("../utils/upload");
// Apply auth middleware
router.use(protect);
router.use(restrictTo("traveler"));

// Profile routes
router.get("/profile", getTravelerProfile);
router.put("/profile", uploadTravelerProfile, updateTravelerProfile);
router.put("/profile/password", changeTravelerPassword);

module.exports = router;