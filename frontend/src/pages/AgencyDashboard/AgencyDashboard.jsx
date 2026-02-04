import React, { useState, useEffect } from "react";
import AgencyLayout from "../../layout/Agencylayout";
import StatsCard from "./StatsCards";
import {
  Package,
  BookOpen,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  RefreshCw,
  Calendar,
  User
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

const AgencyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardStats();

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to load dashboard data");
        // Set default empty data
        setDashboardData({
          stats: {
            totalPackages: 0,
            activeBookings: 0,
            totalCustomers: 0,
            avgRating: 0,
            totalReviews: 0
          },
          recentBookings: [],
          recentReviews: [],
          monthlyTrend: []
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error");
      console.error("Dashboard fetch error:", err);
      // Set default empty data on error
      setDashboardData({
        stats: {
          totalPackages: 0,
          activeBookings: 0,
          totalCustomers: 0,
          avgRating: 0,
          totalReviews: 0
        },
        recentBookings: [],
        recentReviews: [],
        monthlyTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
            <div className="text-gray-600">Loading dashboard...</div>
          </div>
        </div>
      </AgencyLayout>
    );
  }

  // If dashboardData is null, show error
  if (!dashboardData) {
    return (
      <AgencyLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-red-800">Error loading dashboard</div>
              <div className="text-red-700 text-sm mt-1">No data available</div>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </AgencyLayout>
    );
  }

  // Destructure with defaults
  const {
    stats = {
      totalPackages: 0,
      activeBookings: 0,
      totalCustomers: 0,
      avgRating: 0,
      totalReviews: 0
    },
    recentBookings = [],
    recentReviews = [],
    monthlyTrend = []
  } = dashboardData;

  // Get rating color based on score
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-emerald-600 bg-emerald-100";
    if (rating >= 4.0) return "text-green-600 bg-green-100";
    if (rating >= 3.0) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Get rating label
  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Good";
    if (rating >= 3.0) return "Average";
    return "Needs Improvement";
  };

  return (
    <AgencyLayout>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your agency dashboard</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Packages"
          value={stats.totalPackages || 0}
          icon={Package}
          color="bg-blue-500"
          change={(stats.totalPackages || 0) > 0 ? `+${stats.totalPackages}` : "0"}
          description="Active packages"
        />

        <StatsCard
          title="Active Bookings"
          value={stats.activeBookings || 0}
          icon={BookOpen}
          color="bg-green-500"
          change={(stats.activeBookings || 0) > 0 ? `+${stats.activeBookings}` : "0"}
          description="Pending & confirmed"
        />

        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers || 0}
          icon={Users}
          color="bg-purple-500"
          change={(stats.totalCustomers || 0) > 0 ? `+${stats.totalCustomers}` : "0"}
          description="Unique travelers"
        />

        <StatsCard
          title="Average Rating"
          value={stats.avgRating || 0}
          icon={Star}
          color="bg-yellow-500"
          suffix="/5"
          change={getRatingLabel(stats.avgRating || 0)}
          description={`${stats.totalReviews || 0} reviews`}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
              <p className="text-sm text-gray-500">
                Latest customer bookings
              </p>
            </div>
            <a
              href="/agency/bookings"
              className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="space-y-4">
            {recentBookings && recentBookings.length > 0 ? (
              recentBookings.map((booking, index) => (
                <div
                  key={booking.id || index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${booking.status === 'confirmed' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      <Calendar size={16} className={booking.status === 'confirmed' ? 'text-green-600' : 'text-orange-600'} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{booking.package || "Unknown Package"}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <User size={12} className="mr-1" />
                        {booking.travelers || 0} travelers • {booking.date || "No date"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Unknown"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <BookOpen className="mx-auto text-gray-300 mb-3" size={32} />
                <p>No recent bookings</p>
                <p className="text-sm mt-1">New bookings will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
              <p className="text-sm text-gray-500">
                {stats.totalReviews || 0} total reviews
              </p>
            </div>
            <a
              href="/agency/reviews"
              className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="space-y-4">
            {recentReviews && recentReviews.length > 0 ? (
              recentReviews.map((review, index) => (
                <div
                  key={review.id || index}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User size={14} className="text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-800">{review.customer || "Anonymous"}</div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-2 text-sm font-bold text-gray-700">{review.rating || 0}.0</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{review.comment || "No comment"}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {review.date || "No date"}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {review.package || "Unknown Package"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="mx-auto text-gray-300 mb-3" size={32} />
                <p>No reviews yet</p>
                <p className="text-sm mt-1">Customer reviews will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg ${getRatingColor(stats.avgRating || 0).replace('text-', 'bg-').replace('bg-', 'bg-opacity-20')} mr-4`}>
            <TrendingUp size={24} className={getRatingColor(stats.avgRating || 0).split(' ')[0]} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 mb-1 text-lg">
              {!stats.avgRating ? "📊 Welcome!" :
                stats.avgRating >= 4.5 ? "🏆 Excellent Performance!" :
                  stats.avgRating >= 4.0 ? "👍 Good Performance!" :
                    stats.avgRating >= 3.0 ? "📊 Performance Summary" :
                      "📈 Room for Improvement"}
            </div>
            <div className="text-gray-600 mb-4">
              {!stats.avgRating
                ? "Start by creating packages and getting your first bookings. Reviews will appear here once customers share their experiences."
                : stats.avgRating >= 4.5
                  ? `Your agency has an excellent rating of ${stats.avgRating}/5! Keep up the amazing work and continue delivering exceptional experiences.`
                  : stats.avgRating >= 4.0
                    ? `Your agency rating is ${stats.avgRating}/5. You're doing well! Focus on consistency to reach the next level.`
                    : stats.avgRating >= 3.0
                      ? `Your agency rating is ${stats.avgRating}/5. There's room for improvement. Consider asking customers for feedback.`
                      : `Your agency rating is ${stats.avgRating}/5. Focus on customer satisfaction and service quality.`
              }
            </div>

          </div>
          {stats.avgRating >= 4.5 && (
            <div className="hidden md:block">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-lg shadow">
                ★ Top Rated Agency
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend  */}
      {monthlyTrend && monthlyTrend.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Booking Trends</h2>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {monthlyTrend.map((month, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{month.month}</div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{month.bookings || 0}</div>
                  <div className="text-xs text-gray-500">bookings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </AgencyLayout>
  );
};

export default AgencyDashboard;