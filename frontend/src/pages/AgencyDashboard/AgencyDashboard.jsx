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
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading dashboard...</p>
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
      <div className="relative overflow-hidden rounded-3xl mb-8">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative bg-gradient-to-r from-teal-700/90 to-emerald-600/90 p-8 flex justify-between items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 font-medium mb-3 border border-white/20">
              <TrendingUp size={12} />
              Agency Overview
            </div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Welcome back to your agency dashboard</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-sm font-medium transition-all"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest customer bookings</p>
            </div>
            <a href="/agency-booking" className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1">
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {recentBookings && recentBookings.length > 0 ? (
              recentBookings.map((booking, index) => (
                <div key={booking.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${booking.status === 'confirmed' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                      <Calendar size={15} className={booking.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{booking.package || "Unknown Package"}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <User size={10} />
                        {booking.travelers || 0} travelers · {booking.date || "No date"}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Unknown"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10">
                <BookOpen className="mx-auto text-gray-200 mb-3" size={36} />
                <p className="font-medium text-sm">No recent bookings</p>
                <p className="text-xs mt-1 text-gray-400">New bookings will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Reviews */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Reviews</h2>
              <p className="text-xs text-gray-500 mt-0.5">{stats.totalReviews || 0} total reviews</p>
            </div>
            <a href="/agency-review" className="text-xs text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1">
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {recentReviews && recentReviews.length > 0 ? (
              recentReviews.map((review, index) => (
                <div key={review.id || index} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <div className="font-semibold text-gray-800 text-sm">{review.customer || "Anonymous"}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < (review.rating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                      ))}
                      <span className="ml-1 text-xs font-bold text-gray-600">{review.rating || 0}.0</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">{review.comment || "No comment"}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {review.date || "No date"}
                    </span>
                    <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{review.package || "Package"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10">
                <MessageSquare className="mx-auto text-gray-200 mb-3" size={36} />
                <p className="font-medium text-sm">No reviews yet</p>
                <p className="text-xs mt-1 text-gray-400">Customer reviews will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-8 relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?w=800')`, backgroundSize: 'cover' }}
        />
        <div className="relative bg-gradient-to-r from-teal-600/90 to-emerald-600/90 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl border border-white/20">
              <TrendingUp size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg mb-1">
                {!stats.avgRating ? "Welcome to Your Dashboard!" :
                  stats.avgRating >= 4.5 ? "🏆 Excellent Performance!" :
                    stats.avgRating >= 4.0 ? "👍 Good Performance!" :
                      stats.avgRating >= 3.0 ? "📊 Performance Summary" :
                        "📈 Room for Improvement"}
              </div>
              <div className="text-white/70 text-sm">
                {!stats.avgRating
                  ? "Start by creating packages and getting your first bookings."
                  : `Your agency rating is ${stats.avgRating}/5. ${stats.avgRating >= 4.5 ? 'Keep delivering exceptional travel experiences!' : 'Focus on customer satisfaction to improve.'}`
                }
              </div>
            </div>
            {stats.avgRating >= 4.5 && (
              <div className="px-4 py-2 bg-white/20 border border-white/30 text-white text-sm font-bold rounded-xl">
                ★ Top Rated
              </div>
            )}
          </div>
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