import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Users, Building2, Package, CalendarCheck,
  TrendingUp, UserCheck, Clock, CheckCircle,
  XCircle, Eye, MoreVertical, RefreshCw
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAgencies: 0,
    pendingAgencies: 0,
    totalTravelers: 0,
    totalPackages: 0,
    totalBookings: 0
  });
  const [pendingAgencies, setPendingAgencies] = useState([]);
  const [recentActivity, setRecentActivity] = useState({ agencies: [], bookings: [] });
  // const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingAgencies()
      ]);

      if (statsRes.success) {
        setStats(statsRes.data.stats);
        setRecentActivity(statsRes.data.recent);
      }
      setPendingAgencies(pendingRes);
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveAgency(id);
      toast.success("Agency approved!");
      fetchDashboardData();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectAgency(id);
      toast.success("Agency rejected!");
      fetchDashboardData();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your platform</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalAgencies}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Agencies</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.pendingAgencies}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Approvals</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalTravelers}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Travelers</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalPackages}</span>
            </div>
            <p className="text-gray-600 font-medium">Active Packages</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CalendarCheck className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalBookings}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Bookings</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Pending Approvals */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 bg-blue-900 text-white">
                <h2 className="text-2xl font-bold">Pending Agency Approvals</h2>
                <p className="text-blue-200 mt-1">Review and approve new agency registrations</p>
              </div>

              {pendingAgencies.length === 0 ? (
                <div className="p-10 text-center text-gray-600">
                  <CheckCircle className="mx-auto text-green-500 mb-3" size={40} />
                  <p>All caught up! No pending agencies</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pendingAgencies.map((agency) => (
                    <div key={agency._id} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{agency.agencyName}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-600 flex items-center">
                              <span className="w-20 text-sm font-medium">Email:</span>
                              <span className="text-sm">{agency.email}</span>
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <span className="w-20 text-sm font-medium">Phone:</span>
                              <span className="text-sm">{agency.agencyPhone}</span>
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <span className="w-20 text-sm font-medium">License:</span>
                              <span className="text-sm font-mono">{agency.licenseNumber}</span>
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <span className="w-20 text-sm font-medium">Address:</span>
                              <span className="text-sm">{agency.agencyAddress}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(agency._id)}
                            className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            <CheckCircle size={18} className="mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(agency._id)}
                            className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <XCircle size={18} className="mr-2" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CalendarCheck className="mr-2 text-blue-600" size={20} />
                Recent Bookings
              </h3>
              <div className="space-y-4">
                {recentActivity.bookings.map((booking, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{booking.package}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{booking.traveler}</p>
                    <p className="text-xs text-gray-500 mt-1">NPR {booking.amount?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Agencies */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Building2 className="mr-2 text-green-600" size={20} />
                New Agencies
              </h3>
              <div className="space-y-4">
                {recentActivity.agencies.map((agency, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-800">{agency.agencyName}</p>
                      <p className="text-sm text-gray-500">{agency.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${agency.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {agency.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}