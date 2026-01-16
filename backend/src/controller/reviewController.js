const Review = require("../models/Review");
const Package = require("../models/Package");
const mongoose = require("mongoose");

// @desc    Get reviews for a package
exports.getPackageReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;

    const skip = (page - 1) * limit;

    // Build sort
    let sortOption = {};
    switch (sort) {
      case "highest":
        sortOption = { rating: -1 };
        break;
      case "lowest":
        sortOption = { rating: 1 };
        break;
      case "helpful":
        sortOption = { helpful: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Get reviews
    const reviews = await Review.find({ packageId: id })
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get rating breakdown
    const ratingStats = await Review.aggregate([
      { $match: { packageId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Format rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
      const stat = ratingStats.find(s => s._id === stars);
      const total = ratingStats.reduce((sum, s) => sum + s.count, 0);
      return {
        stars,
        count: stat ? stat.count : 0,
        percent: stat ? Math.round((stat.count / total) * 100) : 0
      };
    });

    // Calculate average
    const totalRating = ratingStats.reduce((sum, s) => sum + (s._id * s.count), 0);
    const totalReviews = ratingStats.reduce((sum, s) => sum + s.count, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      name: review.userName,
      avatar: review.userAvatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      rating: review.rating,
      date: getTimeAgo(review.createdAt),
      comment: review.comment,
      helpful: review.helpful,
      verified: review.verifiedPurchase,
      tripDate: review.tripDate ? formatDate(review.tripDate) : null,
      highlights: review.highlights || [],
      agencyResponse: review.agencyResponse ? {
        text: review.agencyResponse.text,
        date: getTimeAgo(review.agencyResponse.date)
      } : null
    }));

    res.status(200).json({
      success: true,
      data: {
        reviews: formattedReviews,
        ratingBreakdown,
        averageRating: parseFloat(averageRating),
        totalReviews,
        hasMore: reviews.length === limit
      }
    });

  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // From auth middleware
    const { rating, comment, highlights, tripDate } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comment"
      });
    }

    // Check if package exists
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Check if user already reviewed (optional - remove if you want multiple reviews)
    const existingReview = await Review.findOne({ packageId: id, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this package"
      });
    }

    // Create review
    const review = await Review.create({
      packageId: id,
      userId,
      userName: req.user?.name || "Anonymous",
      userAvatar: req.user?.avatar || "",
      rating,
      comment,
      highlights: highlights || [],
      tripDate: tripDate || null,
      verifiedPurchase: true // Set to true if user has booked this package
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: {
        id: review._id,
        name: review.userName,
        avatar: review.userAvatar,
        rating: review.rating,
        date: "Just now",
        comment: review.comment,
        helpful: 0,
        verified: review.verifiedPurchase,
        tripDate: review.tripDate ? formatDate(review.tripDate) : null,
        highlights: review.highlights
      }
    });

  } catch (error) {
    console.error("Submit Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Marked as helpful",
      helpfulCount: review.helpful
    });

  } catch (error) {
    console.error("Mark Helpful Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Helper functions
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";

  return "Just now";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}