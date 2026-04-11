// pages/agency/BookingsPage.jsx
import React, { useState, useEffect } from 'react';
import AgencyLayout from "../../layout/Agencylayout";
import { Search, Eye, MessageSquare, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { bookingService } from '../../services/bookingService';

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
    fetchBookingStats();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await bookingService.getBookings(params);

      if (response.success) {
        setBookings(response.data);
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load bookings'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStats = async () => {
    try {
      const response = await bookingService.getBookingStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, newStatus);
      if (response.success) {
        setMessage({ type: 'success', text: 'Booking status updated!' });
        fetchBookings(); // Refresh list
        fetchBookingStats(); // Refresh stats
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update status'
      });
    }
  };

  const handlePaymentStatusChange = async (bookingId, paymentStatus) => {
    try {
      const response = await bookingService.updatePaymentStatus(bookingId, paymentStatus);
      if (response.success) {
        setMessage({ type: 'success', text: 'Payment status updated!' });
        fetchBookings(); // Refresh list
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update payment status'
      });
    }
  };



  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
            <CheckCircle size={12} className="mr-1" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex items-center">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
            Pending
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            Refunded
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
            {paymentStatus}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading bookings...</p>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all customer bookings</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          {/* <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} className="mr-2" />
            Export
          </button> */}
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
          <button
            onClick={() => setMessage({ type: '', text: '' })}
            className="float-right text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-800">{stats.totalBookings || 0}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {stats.confirmedBookings || 0}
          </div>
          <div className="text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingBookings || 0}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            NPR {stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}
          </div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
      </div> */}

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by booking ID, customer name, package, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
              className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                fetchBookings();
              }}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchBookings}
              className="px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 shadow-sm transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-600 to-emerald-600">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Booking ID</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Package</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Customer</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Travelers</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Amount</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Status</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Payment</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-white/90 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(booking => (
                <tr key={booking.id || booking._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-mono font-medium text-gray-800">{booking.bookingId}</div>
                    <div className="text-sm text-gray-500">{booking.bookingDate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{booking.package}</div>
                    <div className="text-sm text-gray-500">Starts: {booking.startDate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{booking.customer}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <div className="font-bold text-gray-800 text-lg">{booking.travelers}</div>
                      <div className="text-xs text-gray-500">travelers</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-800">{booking.totalAmount}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(booking.status)}
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id || booking._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2">
                      {getPaymentBadge(booking.paymentStatus)}
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(booking.id || booking._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-xl"
                        title="Message Customer"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </AgencyLayout>
  );
};

export default BookingsPage;