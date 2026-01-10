import React, { useState } from 'react';
import AgencyLayout from '../../layout/Agencylayout';
import { Search, Filter, Star, MessageSquare, ThumbsUp, Flag, User, Package } from 'lucide-react';

const ReviewPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Mock customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-890',
      bookings: 2,
      totalSpent: 'NPR 75,000',
      joinDate: '2024-01-15',
      lastBooking: '2024-03-01',
      package: 'Everest Base Camp Trek'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-891',
      bookings: 1,
      totalSpent: 'NPR 48,000',
      joinDate: '2024-02-20',
      lastBooking: '2024-03-02',
      package: 'Pokhara Lakeside Tour'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1 234-567-892',
      bookings: 3,
      totalSpent: 'NPR 110,000',
      joinDate: '2023-12-10',
      lastBooking: '2024-03-03',
      package: 'Chitwan Jungle Safari'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 234-567-893',
      bookings: 1,
      totalSpent: 'NPR 44,000',
      joinDate: '2024-01-25',
      lastBooking: '2024-03-04',
      package: 'Annapurna Base Camp Trek'
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert@example.com',
      phone: '+1 234-567-894',
      bookings: 1,
      totalSpent: 'NPR 25,000',
      joinDate: '2024-02-28',
      lastBooking: '2024-03-05',
      package: 'Everest Base Camp Trek'
    }
  ]);

  // Mock reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerId: 1,
      customerName: 'John Smith',
      package: 'Everest Base Camp Trek',
      rating: 5,
      comment: 'Absolutely amazing experience! The guides were knowledgeable and the scenery was breathtaking. Highly recommend!',
      date: '2024-03-10',
      helpful: 12,
      featured: true,
      response: 'Thank you John! We\'re thrilled you enjoyed the trek. Hope to see you again for Annapurna!'
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Sarah Johnson',
      package: 'Pokhara Lakeside Tour',
      rating: 4,
      comment: 'Great tour, beautiful location. The hotel could have been better, but overall good value for money.',
      date: '2024-03-12',
      helpful: 8,
      featured: false,
      response: null
    },
    {
      id: 3,
      customerId: 3,
      customerName: 'Mike Wilson',
      package: 'Chitwan Jungle Safari',
      rating: 5,
      comment: 'Best wildlife experience ever! Saw rhinos, elephants, and even a tiger. The guides were excellent.',
      date: '2024-03-08',
      helpful: 15,
      featured: true,
      response: 'We\'re so glad you enjoyed the safari Mike! The tiger sighting was special indeed.'
    },
    {
      id: 4,
      customerId: 1,
      customerName: 'John Smith',
      package: 'Annapurna Base Camp Trek',
      rating: 5,
      comment: 'Second time booking with this agency and they didn\'t disappoint. Professional service from start to finish.',
      date: '2024-02-20',
      helpful: 10,
      featured: true,
      response: 'Thank you for being a repeat customer John! We appreciate your trust in us.'
    },
    {
      id: 5,
      customerId: 5,
      customerName: 'Robert Brown',
      package: 'Everest Base Camp Trek',
      rating: 3,
      comment: 'The trek was good but the weather was bad. Maybe better communication about conditions next time.',
      date: '2024-03-15',
      helpful: 3,
      featured: false,
      response: 'We apologize for the weather issues Robert. We\'ll improve our weather updates.'
    }
  ]);

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars & Above' },
    { value: '3', label: '3 Stars & Above' },
    { value: '2', label: '2 Stars & Above' },
    { value: '1', label: '1 Star' }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

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

  const handleHelpful = (reviewId) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const toggleFeatured = (reviewId) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, featured: !review.featured }
        : review
    ));
  };

  const addResponse = (reviewId, responseText) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, response: responseText }
        : review
    ));
  };

  const deleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    }
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Calculate rating distribution
  // const ratingDistribution = {

  //   5: reviews.filter(r => r.rating === 5).length,
  //   4: reviews.filter(r => r.rating === 4).length,
  //   3: reviews.filter(r => r.rating === 3).length,
  //   2: reviews.filter(r => r.rating === 2).length,
  //   1: reviews.filter(r => r.rating === 1).length
  // };

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers & Reviews</h1>
        <p className="text-gray-600">Manage customer relationships and feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-800">{customers.length}</div>
          <div className="text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{avgRating}</div>
          <div className="text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{reviews.length}</div>
          <div className="text-gray-600">Total Reviews</div>
        </div>

      </div>



      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-green-600 text-green-600 font-medium py-3">
              Customer Reviews ({reviews.length})
            </button>

          </nav>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer name, package, or review text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Review Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{review.customerName}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Package size={14} className="mr-2" />
                      {review.package}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {review.featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                      ✨ Featured
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                {renderStars(review.rating)}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center text-gray-600 hover:text-green-600"
                  >
                    <ThumbsUp size={16} className="mr-1" />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                  <button
                    onClick={() => toggleFeatured(review.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg ${review.featured
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {review.featured ? 'Featured' : 'Mark Featured'}
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{review.comment}</p>

              {/* Agency Response */}
              {review.response ? (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-green-800 flex items-center">
                      <MessageSquare size={16} className="mr-2" />
                      Your Response
                    </div>
                    <button
                      onClick={() => addResponse(review.id, prompt('Edit your response:', review.response))}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-green-700">{review.response}</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const response = prompt('Enter your response to this review:');
                    if (response) addResponse(review.id, response);
                  }}
                  className="mt-4 px-4 py-2 border border-green-300 text-green-600 hover:bg-green-50 rounded-lg flex items-center"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Respond to Review
                </button>
              )}
            </div>

            {/* Review Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  const newResponse = prompt('Send a private message to customer:');
                  if (newResponse) {
                    alert(`Message sent to ${review.customerName}: ${newResponse}`);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Message Customer
              </button>
              <button
                onClick={() => deleteReview(review.id)}
                className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50"
              >
                Delete Review
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

      {/* Empty State for Reviews */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No reviews found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}


    </AgencyLayout>
  );
};

export default ReviewPage;