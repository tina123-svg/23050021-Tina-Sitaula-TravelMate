const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getAgencyReviews,
  addAgencyResponse,
  toggleFeatured,
  getAgencyReviewStats
} = require("../controller/agencyReviewController");

router.use(protect);
router.use(restrictTo('agency'));

// Agency review routes
router.get("/reviews", getAgencyReviews);
router.get("/reviews/stats", getAgencyReviewStats);
router.post("/reviews/:id/response", addAgencyResponse);
router.patch("/reviews/:id/featured", toggleFeatured);

module.exports = router;