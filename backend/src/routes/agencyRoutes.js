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

// Apply auth middleware to all agency routes
router.use(protect);
router.use(restrictTo("agency"));

router.get("/profile", (req, res) => {
  res.json({
    success: true,
    message: "Agency profile data",
    data: {
      user: req.user,
      agencyInfo: {
        packagesCount: 0,
        bookingsCount: 0,
        totalRevenue: 0
      }
    }
  });
});

// Package Routes
router.post("/packages", createPackage);
router.get("/packages", getAgencyPackages);
router.get("/packages/:id", getPackage);
router.put("/packages/:id", updatePackage);
router.delete("/packages/:id", deletePackage);
router.patch("/packages/:id/featured", toggleFeatured);
router.patch("/packages/:id/status", updateStatus);

module.exports = router;