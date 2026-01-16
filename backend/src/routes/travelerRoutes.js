const express = require("express");
const router = express.Router();
const {
  getFeaturedPackages,
  getAllPackages,
  getPackageDetails,
  searchPackages
} = require("../controller/travellerPackageController");

const {
  getPackageReviews,
  submitReview,
  markHelpful
} = require("../controller/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/packages/featured", getFeaturedPackages);
router.get("/packages", getAllPackages);
router.get("/packages/:id", getPackageDetails);
router.get("/packages/search", searchPackages);
router.get("/packages/:id/reviews", getPackageReviews);

// Protected routes (need login)
router.post("/packages/:id/reviews", protect, submitReview);
router.post("/reviews/:reviewId/helpful", protect, markHelpful);

module.exports = router;  