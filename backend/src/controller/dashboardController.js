const Package = require("../models/Package");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

exports.getDashboardStats = async (req, res) => {
  try {
    const agencyId = req.user.id;

    // 1. Get all packages by this agency
    const packages = await Package.find({ agencyId });

    // 2. Calculate stats from packages
    let totalPackages = 0;
    let totalReviews = 0;
    let totalRatingSum = 0;
    let ratedPackagesCount = 0;

    packages.forEach(pkg => {
      totalPackages++;
      totalReviews += pkg.rating.count || 0;

      if (pkg.rating.average > 0) {
        totalRatingSum += pkg.rating.average;
        ratedPackagesCount++;
      }
    });

    // 3. Calculate average rating (only from rated packages)
    const avgRating = ratedPackagesCount > 0
      ? (totalRatingSum / ratedPackagesCount).toFixed(1)
      : 0;

    // 4. Active bookings count
    const activeBookings = await Booking.countDocuments({
      agencyId,
      status: { $in: ["pending", "confirmed"] }
    });

    // 5. Unique customers count
    const totalCustomers = await Booking.distinct("travelerId", { agencyId });

    // 6. Recent bookings
    const recentBookings = await Booking.find({ agencyId })
      .populate("packageId", "title")
      .sort({ createdAt: -1 })
      .limit(3)
      .select("travelers startDate status createdAt")
      .lean();

    // 7. Recent reviews (from all packages)
    const packageIds = packages.map(p => p._id);
    const recentReviews = await Review.find({
      packageId: { $in: packageIds }
    })
      .populate('userId', 'fullName')
      .populate('packageId', 'title')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // 8. Format recent reviews
    const formattedReviews = recentReviews.map(review => ({
      id: review._id,
      customer: review.userId?.fullName || "Anonymous",
      rating: review.rating,
      comment: review.comment,
      date: formatDate(review.createdAt),
      package: review.packageId?.title || "Unknown Package"
    }));

    // 9. Format recent bookings
    const formattedBookings = recentBookings.map(booking => ({
      id: booking._id,
      package: booking.packageId?.title || "Unknown Package",
      date: formatDate(booking.startDate || booking.createdAt),
      travelers: booking.travelers,
      status: booking.status
    }));

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPackages,
          activeBookings,
          totalCustomers: totalCustomers.length,
          avgRating: parseFloat(avgRating),
          totalReviews
        },
        recentBookings: formattedBookings,
        recentReviews: formattedReviews
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Helper function
function formatDate(date) {
  if (!date) return "N/A";

  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Helper function
function formatDate(date) {
  if (!date) return "N/A";

  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}