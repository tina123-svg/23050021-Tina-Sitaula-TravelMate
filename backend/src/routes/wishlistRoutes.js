const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus
} = require("../controller/wishlistController");

router.use(protect);

// Wishlist routes
router.get("/", getWishlist);
router.post("/:packageId", addToWishlist);
router.delete("/:packageId", removeFromWishlist);
router.get("/check/:packageId", checkWishlistStatus);

module.exports = router;