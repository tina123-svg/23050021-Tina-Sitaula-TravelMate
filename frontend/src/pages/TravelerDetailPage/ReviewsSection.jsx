import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, CheckCircle, User, Loader } from "lucide-react";
import { packageDetailService } from "../../services/packageDetailsService";
import { useNavigate } from "react-router-dom";

const ReviewsSection = ({ rating, reviewCount, packageId }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("recent");
  const [reviews, setReviews] = useState([]);
  const [ratingBreakdown, setRatingBreakdown] = useState([]);
  const [averageRating, setAverageRating] = useState(rating || 0);
  const [totalReviews, setTotalReviews] = useState(reviewCount || 0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    travelerName: ""
  });

  // Fetch reviews
  useEffect(() => {
    if (packageId) {
      fetchReviews();
    }
  }, [packageId, sortBy]);

  useEffect(() => {
    const checkReviewPermission = async () => {
      try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUserInfo(currentUser);

        // Check if user can review this package
        const response = await packageDetailService.canUserReview(packageId);
        if (response.success && response.canReview) {
          setCanReview(true);
        }
      } catch (error) {
        console.error("Error checking review permission:", error);
      }
    };

    if (packageId) {
      checkReviewPermission();
    }
  }, [packageId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await packageDetailService.getPackageReviews(packageId, 1, sortBy);

      if (response.success) {
        setReviews(response.data.reviews || []);
        setRatingBreakdown(response.data.ratingBreakdown || []);
        setAverageRating(response.data.averageRating || rating);
        setTotalReviews(response.data.totalReviews || reviewCount);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.comment.trim()) {
      alert("Please enter your review comment");
      return;
    }

    try {
      setSubmitting(true);
      const response = await packageDetailService.submitReview(packageId, {
        ...newReview,
        packageId: packageId
      });

      if (response.success) {
        // Add new review to list
        setReviews([response.data, ...reviews]);
        setTotalReviews(totalReviews + 1);
        setNewReview({ rating: 5, comment: "", travelerName: "" });
        setShowReviewForm(false);
        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await packageDetailService.markReviewHelpful(reviewId);
      if (response.success) {
        // Update helpful count in local state
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, helpful: response.helpfulCount }
            : review
        ));
      }
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader className="animate-spin h-8 w-8 mx-auto text-blue-600" />
        <p className="text-gray-600 mt-2">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Traveler Reviews</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {totalReviews} reviews
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-sm text-gray-600 mb-1">Traveler rating</div>
              <div className="text-2xl font-bold text-green-600">Excellent</div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 md:mt-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-700 mb-3">Rating Breakdown</h3>
        <div className="space-y-2">
          {ratingBreakdown.length > 0 ? (
            ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center">
                <div className="w-16 text-sm text-gray-600">
                  {item.stars} star{item.stars !== 1 ? 's' : ''}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">
                  {item.count}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No rating data available yet.</p>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-bold text-gray-800 mr-2">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span className="ml-2">{review.date}</span>
                      {review.tripDate && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{review.tripDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className="flex items-center text-gray-500 hover:text-blue-600"
                >
                  <ThumbsUp size={18} className="mr-1" />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* Review Highlights */}
              {review.highlights && review.highlights.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Highlights mentioned:</div>
                  <div className="flex flex-wrap gap-2">
                    {review.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Agency Response */}
              {review.agencyResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 mb-1">
                        Response from Agency
                      </div>
                      <p className="text-gray-600 text-sm">
                        {review.agencyResponse.text}
                      </p>
                      <div className="text-gray-500 text-xs mt-2">
                        {review.agencyResponse.date}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-gray-200 rounded-xl">
            <div className="text-gray-500 mb-2">No reviews yet</div>
            <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {showReviewForm ? (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="font-bold text-gray-800 mb-4">Write Your Review</h3>

          {/* Warning if user can't review */}
          {!canReview && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700">
                ⚠️ You can only review packages you have booked and completed.
              </p>
              <button
                onClick={() => navigate('/my-bookings')}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Check My Bookings →
              </button>
            </div>
          )}

          {/* Show user name if logged in */}
          {userInfo && (
            <p className="text-sm text-gray-500 mb-4">
              Reviewing as: <span className="font-medium">{userInfo.fullName || userInfo.name}</span>
            </p>
          )}

          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-2xl mr-1"
                  >
                    <Star
                      className={star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg h-32"
                placeholder="Share your experience..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || !canReview}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          {reviews.length > 0 && (
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              Load More Reviews
            </button>
          )}
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            disabled={!canReview}
          >
            {canReview ? "Write a Review" : "Book to Review"}
          </button>
        </div>
      )}

      {/* Review Guidelines */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="font-bold text-gray-800 mb-3">💡 Review Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Reviews must be based on actual experience with this package</li>
          <li>• Be specific about what you liked or didn't like</li>
          <li>• Help other travelers make informed decisions</li>
          <li>• Respectful and constructive feedback only</li>
          <li>• Agencies can respond to reviews within 7 days</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewsSection;