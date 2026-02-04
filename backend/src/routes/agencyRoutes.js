// agencyRoutes.js
const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createPackage,
  getAgencyPackages,
  getPackage,
  updatePackage,
  deletePackage,
  toggleFeatured,
  updateStatus
} = require("../controller/packageController");
const { uploadMultiple } = require("../utils/upload");  

// Apply auth middleware
router.use(protect);
router.use(restrictTo("agency"));

// Package Routes - use uploadMultiple
router.post('/packages', uploadMultiple, createPackage);
router.put('/packages/:id', uploadMultiple, updatePackage);
router.get("/packages", getAgencyPackages);
router.get("/packages/:id", getPackage);
router.delete("/packages/:id", deletePackage);
router.patch("/packages/:id/featured", toggleFeatured);
router.patch("/packages/:id/status", updateStatus);

module.exports = router;