const express = require("express");
const router = express.Router();
const {
  getFeaturedPackages,
  getAllPackages,
  getPackageDetails,
  searchPackages
} = require("../controller/travellerPackageController");

// Public routes (no auth required)
router.get("/packages/featured", getFeaturedPackages);
router.get("/packages", getAllPackages);
router.get("/packages/:id", getPackageDetails);
router.get("/packages/search", searchPackages);

module.exports = router;