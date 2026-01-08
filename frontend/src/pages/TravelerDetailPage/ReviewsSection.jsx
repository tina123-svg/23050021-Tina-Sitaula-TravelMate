// components/package-detail/ReviewsSection.jsx
import React, { useState } from "react";
import { Star, ThumbsUp, CheckCircle, User } from "lucide-react";

const ReviewsSection = ({ rating, reviewCount }) => {
  const [sortBy, setSortBy] = useState("recent");

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely incredible experience! The guides were knowledgeable, the scenery breathtaking. Everest Base Camp was a dream come true.",
      helpful: 24,
      verified: true,
      tripDate: "March 2024",
      highlights: ["Knowledgeable guides", "Well-organized", "Great food"]
    },
    {
      id: 2,
      name: "Sarah Miller",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 4,
      date: "1 month ago",
      comment: "Great trek with professional guides. Accommodation was basic but clean. Would recommend bringing extra snacks.",
      helpful: 18,
      verified: true,
      tripDate: "February 2024",
      highlights: ["Professional team", "Good value"]
    },
    {
      id: 3,
      name: "Robert Chen",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      date: "2 months ago",
      comment: "Life-changing experience! The team took great care of us. The sunrise at Kala Patthar was worth every step.",
      helpful: 32,
      verified: true,
      tripDate: "January 2024",
      highlights: ["Life-changing", "Excellent support", "Memorable sunrise"]
    }
  ];

  const ratingBreakdown = [
    { stars: 5, count: 98, percent: 76 },
    { stars: 4, count: 22, percent: 17 },
    { stars: 3, count: 6, percent: 5 },
    { stars: 2, count: 1, percent: 1 },
    { stars: 1, count: 1, percent: 1 }
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Traveler Reviews</h2>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="text-4xl font-bold mr-2">{rating}</div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {reviewCount} reviews
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
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-700 mb-3">Rating Breakdown</h3>
        <div className="space-y-2">
          {ratingBreakdown.map((item) => (
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
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
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
                    <span className="mx-2">•</span>
                    <span>{review.tripDate}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center text-gray-500 hover:text-blue-600">
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

            {/* Agency Response (if any) */}
            {review.id === 1 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-1">
                      Response from Himalayan Adventures
                    </div>
                    <p className="text-gray-600 text-sm">
                      Thank you for your wonderful review, Alex! We're thrilled you enjoyed the trek.
                      Our team works hard to create memorable experiences. Hope to see you again for
                      your next Himalayan adventure!
                    </p>
                    <div className="text-gray-500 text-xs mt-2">2 days ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More / Write Review */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
          Load More Reviews
        </button>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Write a Review
        </button>
      </div>

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