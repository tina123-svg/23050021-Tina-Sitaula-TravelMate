const Review = require("../models/Review");
const Package = require("../models/Package");

// Get all reviews for agency's packages
exports.getAgencyReviews = async (req, res) => {
  try {
    const agencyId = req.user.id;

    // 1. Get all packages created by this agency
    const packages = await Package.find({ agencyId });
    const packageIds = packages.map(p => p._id);

    // 2. Get all reviews for these packages
    const reviews = await Review.find({
      packageId: { $in: packageIds }
    })
      .populate('userId', 'fullName email')
      .populate('packageId', 'title')
      .sort({ createdAt: -1 });

    // 3. Format response
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      customerName: review.userName,
      customerEmail: review.userId?.email,
      package: review.packageId?.title,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt,
      helpful: review.helpful || 0,
      featured: review.featured || false,
      agencyResponse: review.agencyResponse,
      verifiedPurchase: review.verifiedPurchase || false
    }));

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: formattedReviews
    });

  } catch (error) {
    console.error("Get Agency Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Agency reply to review
exports.addAgencyResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const agencyId = req.user.id;

    // Check if review exists
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if package belongs to agency
    const package = await Package.findOne({
      _id: review.packageId,
      agencyId: agencyId
    });

    if (!package) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to respond to this review"
      });
    }

    // Add agency response
    review.agencyResponse = {
      text: response,
      date: new Date(),
      agencyId: agencyId
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: "Response added successfully",
      data: {
        text: review.agencyResponse.text,
        date: review.agencyResponse.date
      }
    });

  } catch (error) {
    console.error("Add Agency Response Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.user.id;

    // Check if review exists
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if package belongs to agency
    const package = await Package.findOne({
      _id: review.packageId,
      agencyId: agencyId
    });

    if (!package) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this review"
      });
    }

    // Toggle featured status
    review.featured = !review.featured;
    await review.save();

    res.status(200).json({
      success: true,
      message: review.featured ? "Review marked as featured" : "Review unfeatured",
      featured: review.featured
    });

  } catch (error) {
    console.error("Toggle Featured Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get agency review stats
exports.getAgencyReviewStats = async (req, res) => {
  try {
    const agencyId = req.user.id;

    // Get all packages by agency
    const packages = await Package.find({ agencyId });
    const packageIds = packages.map(p => p._id);

    // Get all reviews
    const reviews = await Review.find({ packageId: { $in: packageIds } });

    // Calculate stats
    const totalReviews = reviews.length;
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    const respondedReviews = reviews.filter(r => r.agencyResponse).length;
    const featuredReviews = reviews.filter(r => r.featured).length;

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: parseFloat(avgRating),
        ratingDistribution,
        respondedReviews,
        featuredReviews,
        responseRate: totalReviews > 0 ? ((respondedReviews / totalReviews) * 100).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error("Get Agency Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};