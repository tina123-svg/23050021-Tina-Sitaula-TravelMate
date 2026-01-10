import React, { useState } from 'react';
import AgencyLayout from "../../layout/Agencylayout";
import { Search, Filter, Eye, MessageSquare, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock bookings data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingId: 'TRV-2024-001',
      package: 'Everest Base Camp Trek',
      customer: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-890',
      travelers: 2,
      totalAmount: 'NPR 50,000',
      bookingDate: '2024-03-01',
      startDate: '2024-03-15',
      status: 'confirmed',
      paymentStatus: 'paid'
    },
    {
      id: 2,
      bookingId: 'TRV-2024-002',
      package: 'Pokhara Lakeside Tour',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-891',
      travelers: 4,
      totalAmount: 'NPR 48,000',
      bookingDate: '2024-03-02',
      startDate: '2024-03-18',
      status: 'pending',
      paymentStatus: 'pending'
    },
    {
      id: 3,
      bookingId: 'TRV-2024-003',
      package: 'Chitwan Jungle Safari',
      customer: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+1 234-567-892',
      travelers: 3,
      totalAmount: 'NPR 36,000',
      bookingDate: '2024-03-03',
      startDate: '2024-03-22',
      status: 'confirmed',
      paymentStatus: 'paid'
    },
    {
      id: 4,
      bookingId: 'TRV-2024-004',
      package: 'Annapurna Base Camp Trek',
      customer: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 234-567-893',
      travelers: 2,
      totalAmount: 'NPR 44,000',
      bookingDate: '2024-03-04',
      startDate: '2024-03-25',
      status: 'cancelled',
      paymentStatus: 'refunded'
    },
    {
      id: 5,
      bookingId: 'TRV-2024-005',
      package: 'Everest Base Camp Trek',
      customer: 'Robert Brown',
      email: 'robert@example.com',
      phone: '+1 234-567-894',
      travelers: 1,
      totalAmount: 'NPR 25,000',
      bookingDate: '2024-03-05',
      startDate: '2024-03-20',
      status: 'pending',
      paymentStatus: 'pending'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'confirmed', label: 'Confirmed', color: 'green' },
    { value: 'pending', label: 'Pending', color: 'orange' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  // const paymentOptions = [
  //   { value: 'all', label: 'All Payments', color: 'gray' },
  //   { value: 'paid', label: 'Paid', color: 'green' },
  //   { value: 'pending', label: 'Pending', color: 'orange' },
  //   { value: 'refunded', label: 'Refunded', color: 'blue' }
  // ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const getPaymentBadge = (status) => {
    switch (status) {
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
            {status}
          </span>
        );
    }
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const exportBookings = () => {
    // Simple export function
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Booking ID,Package,Customer,Travelers,Amount,Status,Booking Date\n"
      + bookings.map(b =>
        `${b.bookingId},${b.package},${b.customer},${b.travelers},${b.totalAmount},${b.status},${b.bookingDate}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          <p className="text-gray-600">Manage all customer bookings</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={exportBookings}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-gray-800">{bookings.length}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {bookings.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            NPR {bookings
              .filter(b => b.paymentStatus === 'paid')
              .reduce((sum, b) => sum + parseInt(b.totalAmount.replace(/[^0-9]/g, '')), 0)
              .toLocaleString()}
          </div>
          <div className="text-gray-600">Total Revenue</div>
        </div>
      </div>

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
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Booking ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Package</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Travelers</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
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
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getPaymentBadge(booking.paymentStatus)}
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
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
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
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Summary */}
      {/* <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-gray-800 mb-3">📊 Bookings Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {bookings.filter(b => b.paymentStatus === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Payment</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {bookings.reduce((sum, b) => sum + b.travelers, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Travelers</div>
          </div>
        </div>
      </div> */}
    </AgencyLayout>
  );
};

export default BookingsPage;