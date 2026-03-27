import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { Info } from 'lucide-react';
import {
  Calendar, Users, MapPin, DollarSign, Clock,
  CheckCircle, XCircle, AlertCircle, Eye,
  Download, Filter, Search, ChevronRight,
  Package as PackageIcon
} from 'lucide-react';
import travelerBookingService from '../../services/travelerBookingService';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await travelerBookingService.getMyBookings();

      if (response.success) {

        console.log('Bookings data from API:', response.data);

        const formattedBookings = response.data.map(booking => ({
          ...booking,
          package: booking.packageId // T he populated package data
        }));

        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle cancel confirmation
  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await travelerBookingService.cancelBooking(bookingToCancel, 'Cancelled by traveler');

      if (response.success) {
        showToast('Booking cancelled successfully!', 'success');
        fetchBookings(); // Refresh list
        setShowCancelModal(false);
        setBookingToCancel(null);
      }
    } catch (error) {
      let errorMessage = 'Failed to cancel booking';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      if (errorMessage.includes('7 days')) {
        showToast('Cannot cancel within 7 days of departure', 'error');
      } else {
        showToast(errorMessage, 'error');
      }
      setShowCancelModal(false);
    }
  };

  // Open cancel modal
  const openCancelModal = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  // Filter bookings based on status and search
  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (filter === 'upcoming' && booking.status !== 'confirmed') return false;
    if (filter === 'completed' && booking.status !== 'confirmed') return false;
    if (filter === 'cancelled' && booking.status !== 'cancelled') return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.bookingId.toLowerCase().includes(query) ||
        (booking.package?.title?.toLowerCase().includes(query)) ||
        booking.travelerInfo.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status, paymentStatus) => {
    if (status === 'cancelled') {
      return { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={16} />, label: 'Cancelled' };
    }

    if (status === 'confirmed' && paymentStatus === 'paid') {
      return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={16} />, label: 'Confirmed' };
    }

    if (status === 'pending' && paymentStatus === 'pending') {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertCircle size={16} />, label: 'Pending Payment' };
    }

    if (paymentStatus === 'paid' && status === 'pending') {
      return { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={16} />, label: 'Awaiting Confirmation' };
    }

    return { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Clock size={16} />, label: status };
  };

  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Cancel booking
  // const cancelBooking = async (bookingId) => {
  //   try {
  //     const response = await travelerBookingService.cancelBooking(bookingId, 'Cancelled by traveler');

  //     if (response.success) {
  //       alert('✅ Booking Cancelled\n\nYour booking has been cancelled successfully.');
  //       fetchBookings(); // Refresh list
  //     }
  //   } catch (error) {
  //     // Get the actual error message from backend
  //     let errorMessage = 'Failed to cancel booking';

  //     // Check different places where error message might be
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.response?.data?.error) {
  //       errorMessage = error.response.data.error;
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }

  //     console.log('Cancel error:', errorMessage); // Debug

  //     // Show user-friendly message based on error content
  //     if (errorMessage.includes('7 days') || errorMessage.includes('within 7 days')) {
  //       alert(
  //         '⚠️ Cannot Cancel\n\n' +
  //         'This booking cannot be cancelled as it is within 7 days of departure.\n\n' +
  //         'If you need assistance, please contact our support team.'
  //       );
  //     } else if (errorMessage.includes('already cancelled')) {
  //       alert(
  //         '⚠️ Already Cancelled\n\n' +
  //         'This booking has already been cancelled.'
  //       );
  //     } else if (error.response?.status === 401) {
  //       alert(
  //         '🔒 Session Expired\n\n' +
  //         'Please login again to cancel this booking.'
  //       );
  //     } else {
  //       alert(
  //         '❌ Cancellation Failed\n\n' +
  //         errorMessage
  //       );
  //     }
  //   }
  // };

  const canCancel = (startDate) => {
    const today = new Date();
    const tripDate = new Date(startDate);
    const daysDiff = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));
    return daysDiff > 7;
  };


  // Stats
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'confirmed' && new Date(b.startDate) > new Date()).length,
    completed: bookings.filter(b => b.status === 'confirmed' && new Date(b.startDate) < new Date()).length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading your bookings...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your travel bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <PackageIcon className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.upcoming}</div>
                <div className="text-gray-600">Upcoming Trips</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
                <div className="text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg mr-4">
                <Clock className="text-gray-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.cancelled}</div>
                <div className="text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancelled
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <PackageIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `No bookings match "${searchQuery}"`
                : filter !== 'all'
                  ? `You have no ${filter} bookings`
                  : "You haven't made any bookings yet"}
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => navigate('/package')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
              >
                Browse Packages
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status, booking.paymentStatus);

              return (
                <div key={booking._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-800 mr-3">
                            {booking.packageId?.title || `Booking ${booking.bookingId}`}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.icon}
                            <span className="ml-1">{statusBadge.label}</span>
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm space-x-4">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(booking.startDate)}
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}
                          </span>
                          {booking.packageId?.destination && (
                            <span className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {booking.packageId.destination}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          NPR {booking.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-gray-500 text-sm">Booking ID: {booking.bookingId}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>

                      <button
                        onClick={() => navigate(`/package/${booking.packageId?._id || booking.packageId}`)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <PackageIcon size={16} className="mr-2" />
                        View Package
                      </button>

                      {booking.status === 'pending' && (
                        <div className="relative group">
                          {!canCancel(booking.startDate) && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              Cannot cancel within 7 days of departure
                            </div>
                          )}
                          <button
                            onClick={() => {
                              if (!canCancel(booking.startDate)) {
                                showToast('Cannot cancel within 7 days of departure', 'error');
                                return;
                              }
                              openCancelModal(booking._id);
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${canCancel(booking.startDate)
                              ? 'border border-red-300 text-red-600 hover:bg-red-50'
                              : 'border border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                              }`}
                            disabled={!canCancel(booking.startDate)}
                          >
                            <XCircle size={16} className="mr-2" />
                            Cancel Booking
                            {!canCancel(booking.startDate) && (
                              <Info size={14} className="ml-2 text-gray-400" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ml-auto">
                        <Download size={16} className="mr-2" />
                        Download Invoice
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state - Create first booking */}
        {bookings.length === 0 && !loading && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-12 max-w-2xl mx-auto">
              <PackageIcon className="mx-auto text-blue-500 mb-6" size={64} />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Adventure!</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't booked any packages yet. Explore our amazing destinations and create unforgettable memories.
              </p>
              <button
                onClick={() => navigate('/package')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg flex items-center mx-auto"
              >
                Browse Packages
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Booking Info */}
              <div className="space-y-6">
                {/* Status & ID */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-gray-800">
                      {selectedBooking.package?.title || 'Package'}
                    </div>
                    <div className="text-gray-500">Booking ID: {selectedBooking.bookingId}</div>
                  </div>
                  {(() => {
                    const statusBadge = getStatusBadge(selectedBooking.status, selectedBooking.paymentStatus);
                    return (
                      <span className={`px-4 py-2 rounded-full font-medium flex items-center ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.icon}
                        <span className="ml-2">{statusBadge.label}</span>
                      </span>
                    );
                  })()}
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-gray-700 mb-3">Trip Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{formatDate(selectedBooking.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travelers:</span>
                        <span className="font-medium">{selectedBooking.travelers} person{selectedBooking.travelers > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedBooking.packageId?.duration || 'N/A'} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="font-medium">{selectedBooking.package?.destination || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-gray-700 mb-3">Payment Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg">NPR {selectedBooking.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize">{selectedBooking.paymentDetails.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className="font-medium capitalize">{selectedBooking.paymentStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Date:</span>
                        <span className="font-medium">{formatDate(selectedBooking.bookingDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traveler Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-gray-700 mb-3">Traveler Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Primary Traveler</div>
                      <div className="font-medium">{selectedBooking.travelerInfo.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{selectedBooking.travelerInfo.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{selectedBooking.travelerInfo.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Emergency Contact</div>
                      <div className="font-medium">{selectedBooking.travelerInfo.emergencyContact}</div>
                    </div>
                    {selectedBooking.travelerInfo.specialRequirements && (
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-600">Special Requirements</div>
                        <div className="font-medium">{selectedBooking.travelerInfo.specialRequirements}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      navigate(`/package/${selectedBooking.packageId?._id || selectedBooking.packageId}`);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        confirmVariant="danger"
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
      <Footer />
    </div>
  );
};

export default MyBookingsPage;