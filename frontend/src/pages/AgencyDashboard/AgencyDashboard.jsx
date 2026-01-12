import React, { useState, useEffect } from "react";
import AgencyLayout from "../../layout/Agencylayout";
import StatsCard from "./StatsCards";
import {
  Package, BookOpen, DollarSign, Star, TrendingUp, Users
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

const AgencyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPackages: 0,
      activeBookings: 0,
      totalCustomers: 0,
      avgRating: 4.8
    },
    recentBookings: [],
    recentReviews: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats();

      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to load dashboard data");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </AgencyLayout>
    );
  }

  if (error) {
    return (
      <AgencyLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">Error: {error}</div>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      </AgencyLayout>
    );
  }

  const { stats, recentBookings, recentReviews } = dashboardData;

  return (
    <AgencyLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your agency dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Packages"
          value={stats.totalPackages}
          icon={Package}
          color="bg-blue-500"
        />

        <StatsCard
          title="Active Bookings"
          value={stats.activeBookings}
          icon={BookOpen}
          color="bg-green-500"
        />

        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-purple-500"
        />

        <StatsCard
          title="Average Rating"
          value={stats.avgRating}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
            <a href="/agency/bookings" className="text-sm text-green-600 hover:text-green-800 font-medium">
              View All →
            </a>
          </div>

          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map(booking => (
                <div key={booking.id || booking._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{booking.package}</div>
                    <div className="text-sm text-gray-500">
                      {booking.date} • {booking.travelers} travelers
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                    }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No recent bookings
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
            <a href="/agency/customers" className="text-sm text-green-600 hover:text-green-800 font-medium">
              View All →
            </a>
          </div>

          <div className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map(review => (
                <div key={review.id || review._id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-800">{review.customer}</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No reviews yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6">
        <div className="flex items-center">
          <TrendingUp size={24} className="text-green-600 mr-3" />
          <div>
            <div className="font-bold text-gray-800">Performance is good!</div>
            <div className="text-gray-600">Your customer satisfaction rating is {stats.avgRating}/5. Keep it up!</div>
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
};

export default AgencyDashboard;