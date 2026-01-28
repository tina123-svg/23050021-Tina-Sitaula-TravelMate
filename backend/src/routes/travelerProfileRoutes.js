const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getTravelerProfile,
  updateTravelerProfile,
  changeTravelerPassword
} = require("../controller/travelerProfileController");

router.use(protect);
router.use(restrictTo("traveler"));

router.get("/profile", getTravelerProfile);
router.put("/profile", updateTravelerProfile);
router.put("/profile/password", changeTravelerPassword);

module.exports = router;