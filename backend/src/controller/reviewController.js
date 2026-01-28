const Review = require("../models/Review");
const Package = require("../models/Package");
const mongoose = require("mongoose");

//   Get reviews for a package
exports.getPackageReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;

    const skip = (page - 1) * limit;

    // Build sort
    let sortOption = {};
    switch (sort) {
      case "highest": sortOption = { rating: -1 }; break;
      case "lowest": sortOption = { rating: 1 }; break;
      case "helpful": sortOption = { helpful: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    // Get REAL reviews from database
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
    const totalReviews = ratingStats.reduce((sum, s) => sum + s.count, 0);
    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
      const stat = ratingStats.find(s => s._id === stars);
      return {
        stars,
        count: stat ? stat.count : 0,
        percent: stat && totalReviews > 0 ? Math.round((stat.count / totalReviews) * 100) : 0
      };
    });

    // Calculate average
    const totalRating = ratingStats.reduce((sum, s) => sum + (s._id * s.count), 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

    // Format reviews
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      name: review.userName,
      avatar: review.userAvatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      rating: review.rating,
      date: getTimeAgo(review.createdAt),
      comment: review.comment,
      helpful: review.helpful || 0,
      verified: review.verifiedPurchase || false,
      tripDate: review.tripDate ? formatDate(review.tripDate) : null,
      highlights: review.highlights || [],
      agencyResponse: review.agencyResponse ? {
        text: review.agencyResponse.text,
        date: getTimeAgo(review.agencyResponse.date)
      } : null
    }));

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//     Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { packageId, rating, comment, highlights = [], tripDate } = req.body;
    const userId = req.user?.id; // From auth middleware

    console.log("Submit review called:", { packageId, userId, rating });

    // 1. Validation
    if (!packageId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comment"
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to submit review"
      });
    }

    // 2. Check if package exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // 3. IMPORTANT: Check if user has booked this package
    const Booking = require("../models/Booking");
    const hasBooked = await Booking.findOne({
      packageId: packageId,
      travelerId: userId,
      status: "confirmed",
      paymentStatus: "paid"
    });

    if (!hasBooked) {
      return res.status(403).json({
        success: false,
        message: "You can only review packages you have booked and completed"
      });
    }

    // 4. Get user details
    const User = require("../models/User");
    const user = await User.findById(userId).select("fullName email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 5. Check if already reviewed
    const existingReview = await Review.findOne({
      packageId: packageId,
      userId: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this package"
      });
    }

    // 6. Create review
    const review = await Review.create({
      packageId: packageId,
      userId: userId,
      userName: user.fullName || "Traveler",
      userAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      rating: parseInt(rating),
      comment: comment,
      highlights: highlights,
      tripDate: tripDate || hasBooked.startDate,
      verifiedPurchase: true // Mark as verified since they booked it
    });

    // 7. Update package rating stats
    const reviewStats = await Review.aggregate([
      { $match: { packageId: new mongoose.Types.ObjectId(packageId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (reviewStats.length > 0) {
      await Package.findByIdAndUpdate(packageId, {
        "rating.average": reviewStats[0].averageRating.toFixed(1),
        "rating.count": reviewStats[0].reviewCount
      });
    }

    // 8. Return success
    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: {
        id: review._id,
        name: review.userName,
        avatar: review.userAvatar,
        rating: review.rating,
        comment: review.comment,
        date: "Just now",
        helpful: 0,
        verified: true,
        tripDate: review.tripDate ? formatDate(review.tripDate) : null,
        highlights: review.highlights || []
      }
    });

  } catch (error) {
    console.error("Submit Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//     Mark review as helpful
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


exports.canUserReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: "Please login to review"
      });
    }

    // Check if user has booked and completed this package
    const Booking = require("../models/Booking");
    const hasBooked = await Booking.findOne({
      packageId: id,
      travelerId: userId,
      status: "confirmed",
      paymentStatus: "paid",
      startDate: { $lt: new Date() } // Trip has started
    });

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({
      packageId: id,
      userId: userId
    });

    return res.status(200).json({
      success: true,
      canReview: !!hasBooked && !alreadyReviewed,
      hasBooked: !!hasBooked,
      alreadyReviewed: !!alreadyReviewed,
      booking: hasBooked ? {
        id: hasBooked._id,
        startDate: hasBooked.startDate,
        travelers: hasBooked.travelers
      } : null
    });

  } catch (error) {
    console.error("Can User Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};