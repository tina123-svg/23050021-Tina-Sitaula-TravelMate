import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import {
  Calendar, Users, MapPin, DollarSign, Clock,
  CheckCircle, XCircle, AlertCircle, Eye,
  Download, Filter, Search, ChevronRight,
  Package as PackageIcon
} from 'lucide-react';
import travelerBookingService from '../../services/travelerBookingService';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { Info } from 'lucide-react';

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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const openCancelModal = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      const response = await travelerBookingService.cancelBooking(
        bookingToCancel,
        'Cancelled by traveler'
      );

      if (response.success) {
        showToast('Booking cancelled successfully!', 'success');
        fetchBookings();
        setShowCancelModal(false);
        setBookingToCancel(null);
      }
    } catch (error) {
      let msg = error.response?.data?.message || 'Failed to cancel booking';

      if (msg.includes('7 days')) {
        showToast('Cannot cancel within 7 days of departure', 'error');
      } else {
        showToast(msg, 'error');
      }

      setShowCancelModal(false);
    }
  };

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 pt-20">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2631&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-16">
          <div className="flex items-center gap-3 mb-3">
            <Calendar size={28} className="text-white" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Bookings</h1>
          </div>
          <p className="text-blue-100 text-lg">Track, manage, and relive all your travel adventures</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trips", value: stats.total, icon: PackageIcon, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
            { label: "Upcoming Trips", value: stats.upcoming, icon: Calendar, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "from-purple-500 to-indigo-500", bg: "bg-purple-50", text: "text-purple-600" },
            { label: "Cancelled", value: stats.cancelled, icon: Clock, color: "from-gray-400 to-gray-500", bg: "bg-gray-50", text: "text-gray-600" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${stat.bg} rounded-xl`}>
                    <Icon className={stat.text} size={22} />
                  </div>
                  <div>
                    <div className={`text-2xl font-extrabold ${stat.text}`}>{stat.value}</div>
                    <div className="text-gray-500 text-xs font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Bookings', activeClass: 'bg-blue-600 text-white' },
                { key: 'upcoming', label: 'Upcoming', activeClass: 'bg-emerald-600 text-white' },
                { key: 'completed', label: 'Completed', activeClass: 'bg-purple-600 text-white' },
                { key: 'cancelled', label: 'Cancelled', activeClass: 'bg-red-500 text-white' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f.key ? f.activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2631&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-blue-900/75" />
            </div>
            <div className="relative z-10 py-20 text-center">
              <PackageIcon className="mx-auto text-white/60 mb-4" size={52} />
              <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
              <p className="text-blue-200 mb-8 max-w-sm mx-auto">
                {searchQuery
                  ? `No bookings match "${searchQuery}"`
                  : filter !== 'all'
                    ? `You have no ${filter} bookings`
                    : "You haven't made any bookings yet. Start your adventure today!"}
              </p>
              {!searchQuery && filter === 'all' && (
                <button
                  onClick={() => navigate('/package')}
                  className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-all shadow-lg"
                >
                  Browse Packages
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status, booking.paymentStatus);

              return (
                <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow">
                          <PackageIcon className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {booking.packageId?.title || `Booking ${booking.bookingId}`}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-blue-400" />
                              {formatDate(booking.startDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={13} className="text-blue-400" />
                              {booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}
                            </span>
                            {booking.packageId?.destination && (
                              <span className="flex items-center gap-1">
                                <MapPin size={13} className="text-blue-400" />
                                {booking.packageId.destination}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-gray-900">
                          NPR {booking.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">ID: {booking.bookingId}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/package/${booking.packageId?._id || booking.packageId}`)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <PackageIcon size={15} />
                        View Package
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => {
                            if (!canCancel(booking.startDate)) {
                              showToast('Cannot cancel within 7 days of departure', 'error');
                              return;
                            }
                            openCancelModal(booking._id);
                          }} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-all"
                        >
                          <XCircle size={15} />
                          Cancel
                        </button>
                      )}
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
            <div className="relative rounded-3xl overflow-hidden max-w-2xl mx-auto">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?q=80&w=2664&auto=format&fit=crop')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-teal-800/70" />
              </div>
              <div className="relative z-10 py-16 px-8">
                <PackageIcon className="mx-auto text-white/60 mb-5" size={56} />
                <h3 className="text-2xl font-bold text-white mb-3">Start Your Adventure!</h3>
                <p className="text-blue-200 mb-8 max-w-md mx-auto">
                  Explore our amazing destinations and create unforgettable memories.
                </p>
                <button
                  onClick={() => navigate('/package')}
                  className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2"
                >
                  Browse Packages
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-7">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-5 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                  <p className="text-sm text-gray-500 mt-0.5">ID: {selectedBooking.bookingId}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">
                {/* Status & Package */}
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedBooking.package?.title || 'Package'}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">Booking ID: {selectedBooking.bookingId}</div>
                  </div>
                  {(() => {
                    const statusBadge = getStatusBadge(selectedBooking.status, selectedBooking.paymentStatus);
                    return (
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Trip & Payment Details - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Trip Details</h4>
                    {[
                      { label: "Start Date", value: formatDate(selectedBooking.startDate) },
                      { label: "Travelers", value: `${selectedBooking.travelers} person${selectedBooking.travelers > 1 ? 's' : ''}` },
                      { label: "Duration", value: `${selectedBooking.packageId?.duration || 'N/A'} days` },
                      { label: "Destination", value: selectedBooking.package?.destination || 'N/A' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-semibold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Payment Details</h4>
                    {[
                      { label: "Total Amount", value: `NPR ${selectedBooking.totalAmount?.toLocaleString()}`, bold: true },
                      { label: "Payment Method", value: selectedBooking.paymentDetails.method },
                      { label: "Payment Status", value: selectedBooking.paymentStatus },
                      { label: "Booking Date", value: formatDate(selectedBooking.bookingDate) },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className={item.bold ? "font-extrabold text-blue-700 text-base" : "font-semibold text-gray-800 capitalize"}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traveler Info */}
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Traveler Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label: "Primary Traveler", value: selectedBooking.travelerInfo.name },
                      { label: "Email", value: selectedBooking.travelerInfo.email },
                      { label: "Phone", value: selectedBooking.travelerInfo.phone },
                      { label: "Emergency Contact", value: selectedBooking.travelerInfo.emergencyContact },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="text-xs text-gray-500 mb-0.5">{item.label}</div>
                        <div className="text-sm font-semibold text-gray-800">{item.value}</div>
                      </div>
                    ))}
                    {selectedBooking.travelerInfo.specialRequirements && (
                      <div className="md:col-span-2">
                        <div className="text-xs text-gray-500 mb-0.5">Special Requirements</div>
                        <div className="text-sm font-semibold text-gray-800">{selectedBooking.travelerInfo.specialRequirements}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      navigate(`/package/${selectedBooking.packageId?._id || selectedBooking.packageId}`);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm"
                  >
                    View Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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