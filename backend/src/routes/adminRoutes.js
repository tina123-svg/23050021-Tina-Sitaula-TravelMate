const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { getPendingAgencies, approveAgency, rejectAgency } = require("../controller/adminController");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.get("/pending-agencies", getPendingAgencies);
router.post("/approve/:id", approveAgency);
router.post("/reject/:id", rejectAgency);

module.exports = router;