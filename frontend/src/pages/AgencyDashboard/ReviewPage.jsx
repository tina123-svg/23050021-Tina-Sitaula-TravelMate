import React, { useState, useEffect } from 'react';
import AgencyLayout from '../../layout/Agencylayout';
import { Search, Filter, Star, MessageSquare, ThumbsUp, Flag, User, Package, Loader, X, Send, CheckCircle } from 'lucide-react';
import { agencyReviewService } from '../../services/agencyReviewService';

const ReviewPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    respondedReviews: 0,
    featuredReviews: 0
  });

  // Modal states
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars & Above' },
    { value: '3', label: '3 Stars & Above' },
    { value: '2', label: '2 Stars & Above' },
    { value: '1', label: '1 Star' }
  ];

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch agency reviews
  useEffect(() => {
    fetchAgencyReviews();
    fetchAgencyStats();
  }, []);

  const fetchAgencyReviews = async () => {
    try {
      setLoading(true);
      const response = await agencyReviewService.getAgencyReviews();
      if (response.success) {
        setReviews(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching agency reviews:', error);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencyStats = async () => {
    try {
      const response = await agencyReviewService.getAgencyReviewStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching agency stats:', error);
    }
  };

  // Open Reply Modal
  const openReplyModal = (review, editing = false) => {
    setSelectedReview(review);
    setIsEditing(editing);
    setReplyText(editing ? review.agencyResponse?.text : '');
    setShowReplyModal(true);
  };

  // Submit Reply
  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      showToast('Please enter a response', 'error');
      return;
    }

    try {
      const response = await agencyReviewService.addAgencyResponse(
        selectedReview.id,
        replyText
      );

      if (response.success) {
        // Update local state
        setReviews(prev => prev.map(review =>
          review.id === selectedReview.id
            ? {
              ...review,
              agencyResponse: {
                text: response.data.text,
                date: response.data.date
              }
            }
            : review
        ));

        fetchAgencyStats(); // Refresh stats
        setShowReplyModal(false);
        setReplyText('');
        setSelectedReview(null);
        showToast('Response submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      showToast('Failed to submit response. Please try again.', 'error');
    }
  };

  // Open Message Modal
  const openMessageModal = (review) => {
    setSelectedReview(review);
    setMessageText('');
    setShowMessageModal(true);
  };

  // Send Message
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      showToast('Please enter a message', 'error');
      return;
    }

    // TODO: Implement actual message sending API
    console.log(`Sending message to ${selectedReview.customerName}:`, messageText);

    // Show success toast
    showToast(`Message sent to ${selectedReview.customerName}`);

    setShowMessageModal(false);
    setMessageText('');
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.package?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || review.rating >= parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-2 font-bold text-gray-700">{rating}.0</span>
      </div>
    );
  };

  // const toggleFeatured = async (reviewId) => {
  //   try {
  //     const response = await agencyReviewService.toggleFeatured(reviewId);
  //     if (response.success) {
  //       setReviews(prev => prev.map(review =>
  //         review.id === reviewId
  //           ? { ...review, featured: response.featured }
  //           : review
  //       ));
  //       fetchAgencyStats();

  //       // Show toast
  //       showToast(
  //         response.featured
  //           ? 'Review marked as featured'
  //           : 'Review removed from featured'
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error toggling featured:', error);
  //     showToast('Failed to update featured status', 'error');
  //   }
  // };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading reviews...</p>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <>
      <AgencyLayout>
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage customer feedback for your packages</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
          {[
            { value: stats.totalReviews, label: 'Total Reviews', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { value: stats.averageRating, label: 'Average Rating', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
            { value: stats.respondedReviews, label: 'Responded Reviews', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <Star size={18} className="text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="mb-7">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by customer name, package, or review text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchAgencyReviews}
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Filter size={18} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-5">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Review Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-0.5">
                        <Package size={13} className="mr-1.5" />
                        {review.package}
                      </div>
                      {review.verifiedPurchase && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                        ✨ Featured
                      </span>
                    )}
                    <span className="text-gray-400 text-sm">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  {renderStars(review.rating)}
                  <div className="flex items-center text-gray-500">
                    <ThumbsUp size={14} className="mr-1" />
                    <span className="text-sm">Helpful ({review.helpful || 0})</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-5">{review.comment}</p>

                {/* Agency Response */}
                {review.agencyResponse ? (
                  <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-teal-800 text-sm flex items-center">
                        <MessageSquare size={14} className="mr-1.5" />
                        Your Response
                      </div>
                      <button
                        onClick={() => openReplyModal(review, true)}
                        className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-teal-700 text-sm">{review.agencyResponse.text}</p>
                    <div className="text-teal-500 text-xs mt-2">
                      {new Date(review.agencyResponse.date).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openReplyModal(review, false)}
                    className="mt-3 px-4 py-2 border border-teal-200 text-teal-600 hover:bg-teal-50 rounded-xl text-sm flex items-center gap-2 transition-all"
                  >
                    <MessageSquare size={15} />
                    Respond to Review
                  </button>
                )}
              </div>

              {/* Review Actions */}
              <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => openMessageModal(review)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Message Customer
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Report"
                >
                  <Flag size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={36} className="text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {searchTerm || ratingFilter !== 'all' ? 'No matching reviews found' : 'No reviews yet'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || ratingFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Customer reviews will appear here once they review your packages'}
            </p>
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {isEditing ? 'Edit Response' : 'Reply to Review'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyText('');
                      setSelectedReview(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 p-1 transition-all"
                  >
                    <X size={22} />
                  </button>
                </div>

                {selectedReview && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedReview.comment}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      — {selectedReview.customerName}, {selectedReview.package}
                    </div>
                  </div>
                )}

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full h-36 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  autoFocus
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyText('');
                      setSelectedReview(null);
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 flex items-center gap-2 text-sm shadow-sm transition-all"
                  >
                    <Send size={15} />
                    {isEditing ? 'Update Response' : 'Post Response'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Customer Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Message {selectedReview?.customerName}
                  </h3>
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageText('');
                      setSelectedReview(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 p-1 transition-all"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="mb-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                  This message will be sent to {selectedReview?.customerName} regarding their review of {selectedReview?.package}.
                </div>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-36 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  autoFocus
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageText('');
                      setSelectedReview(null);
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 flex items-center gap-2 text-sm shadow-sm transition-all"
                  >
                    <Send size={15} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AgencyLayout>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl border text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={18} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewPage;