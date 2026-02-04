const User = require("../models/User");
const Package = require("../models/Package");

// Add package to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.user.id;

    // Check if package exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Add to wishlist if not already added
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: packageId } }, // $addToSet prevents duplicates
      { new: true }
    ).populate({
      path: 'wishlist',
      select: 'title price duration difficulty destination images rating'
    });

    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: packageId } },
      { new: true }
    ).populate({
      path: 'wishlist',
      select: 'title price duration difficulty destination images rating'
    });

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: 'wishlist',
        select: 'title description price duration difficulty destination category images rating featured status agencyId',
        match: { status: 'active' } // Only show active packages
      });

    // Format the wishlist packages
    const wishlistItems = (user.wishlist || []).map(pkg => ({
      id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      difficulty: pkg.difficulty,
      destination: pkg.destination,
      category: pkg.category,
      rating: pkg.rating?.average || 0,
      reviewCount: pkg.rating?.count || 0,
      featured: pkg.featured || false,
      image: pkg.images?.[0]?.url || '/uploads/default-package.jpg',
      agencyName: pkg.agencyId?.agencyName || pkg.agencyId?.name
    }));

    return res.status(200).json({
      success: true,
      count: wishlistItems.length,
      wishlist: wishlistItems
    });

  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Check if package is in wishlist
exports.checkWishlistStatus = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isInWishlist = user.wishlist.includes(packageId);

    return res.status(200).json({
      success: true,
      isInWishlist: isInWishlist
    });

  } catch (error) {
    console.error("Check wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};