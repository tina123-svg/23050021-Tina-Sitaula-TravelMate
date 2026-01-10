import React from "react";
import AgencyLayout from "../../layout/Agencylayout";
import StatsCard from "./StatsCards";
import {
  Package, BookOpen, DollarSign, Star, TrendingUp, Users
} from "lucide-react";


const AgencyDashboard = () => {
  const agencyStats = {
    totalPackages: 8,
    activeBookings: 12,
    totalCustomers: 48,
    avgRating: 4.8
  };

  const recentBookings = [
    { id: 1, package: "Everest Trek", date: "Mar 15", travelers: 2, status: "confirmed" },
    { id: 2, package: "Pokhara Tour", date: "Mar 18", travelers: 4, status: "confirmed" },
    { id: 3, package: "Chitwan Safari", date: "Mar 22", travelers: 3, status: "pending" }
  ];

  const recentReviews = [
    { id: 1, customer: "John Doe", rating: 5, comment: "Amazing experience!", date: "2 days ago" },
    { id: 2, customer: "Sarah Smith", rating: 4, comment: "Great guides, would recommend", date: "1 week ago" }
  ];

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
          value={agencyStats.totalPackages}
          icon={Package}
          color="bg-blue-500"
        />

        <StatsCard
          title="Active Bookings"
          value={agencyStats.activeBookings}
          icon={BookOpen}
          color="bg-green-500"
        />

        <StatsCard
          title="Total Customers"
          value={agencyStats.totalCustomers}
          icon={Users}
          color="bg-purple-500"
        />

        <StatsCard
          title="Average Rating"
          value={agencyStats.avgRating}
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
            {recentBookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
            ))}
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
            {recentReviews.map(review => (
              <div key={review.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
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
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6">
        <div className="flex items-center">
          <TrendingUp size={24} className="text-green-600 mr-3" />
          <div>
            <div className="font-bold text-gray-800">Performance is good!</div>
            <div className="text-gray-600">Your customer satisfaction rating is 4.8/5. Keep it up!</div>
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
};

export default AgencyDashboard;