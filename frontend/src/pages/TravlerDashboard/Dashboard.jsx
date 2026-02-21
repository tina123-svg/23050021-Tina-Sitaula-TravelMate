import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import PackageCard from '../../components/Card';
import { Calendar, Heart, User, ArrowRight, Loader, Package as PackageIcon } from "lucide-react";
import travelerBookingService from '../../services/travelerBookingService';
import { travelerService } from "../../services/travelerService";
import { wishlistService } from "../../services/wishlistService"; // Import wishlist service

export default function TravelerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    name: "Traveler",
    bookings: 0,
    wishlist: 0,
    upcomingTrips: 0
  });
  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get user info
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = userData.fullName || userData.name || "Traveler";

      // Fetch all data in parallel
      const [bookingsResponse, packagesResponse, wishlistResponse] = await Promise.allSettled([
        travelerBookingService.getMyBookings(),
        travelerService.getFeaturedPackages(),
        wishlistService.getWishlist() // Fetch REAL wishlist data
      ]);

      // Process bookings data
      let totalBookings = 0;
      let upcomingCount = 0;
      let recent = [];

      if (bookingsResponse.status === 'fulfilled' && bookingsResponse.value?.success) {
        const bookings = bookingsResponse.value.data || [];

        totalBookings = bookings.length;

        // Count upcoming trips (confirmed + startDate in future)
        const today = new Date();
        upcomingCount = bookings.filter(b =>
          b.status === 'confirmed' && new Date(b.startDate) > today
        ).length;

        // Get 3 most recent bookings
        recent = bookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map(b => ({
            id: b._id,
            bookingId: b.bookingId,
            packageName: b.packageId?.title || 'Package',
            date: formatDate(b.startDate || b.createdAt),
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
            travelers: b.travelers
          }));
      }

       
      let wishlistCount = 0;
      if (wishlistResponse.status === 'fulfilled' && wishlistResponse.value?.success) {
        wishlistCount = wishlistResponse.value.wishlist?.length || 0;
        console.log('Wishlist count:', wishlistCount);
      }

      // Handle packages
      if (packagesResponse.status === 'fulfilled' && packagesResponse.value?.success) {
        setRecommendedPackages(packagesResponse.value.data || []);
      }

       setStats({
        name: userName.split(' ')[0],
        bookings: totalBookings,
        wishlist: wishlistCount,  
        upcomingTrips: upcomingCount
      });

      setRecentBookings(recent);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/booking-confirmation/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {stats.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready for your next adventure in Nepal?
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => navigate('/package')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded-lg"
              >
                Browse Packages
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="bg-transparent border border-white text-white hover:bg-white/10 font-medium px-6 py-2 rounded-lg"
              >
                My Bookings
              </button>
            </div>
          </div>
        </section>

        {/* Quick Stats - ALL NUMBERS ARE REAL NOW! */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bookings Card */}
            <div
              onClick={() => navigate('/my-bookings')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm">My Bookings</div>
                  <div className="text-3xl font-bold text-blue-600">{stats.bookings}</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                View all bookings <ArrowRight size={16} className="ml-1" />
              </div>
            </div>

            {/* Wishlist Card - NOW WITH REAL COUNT! */}
            <div
              onClick={() => navigate('/wishlist')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm">Wishlist</div>
                  <div className="text-3xl font-bold text-pink-600">{stats.wishlist}</div>
                </div>
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Heart className="text-pink-600" size={24} />
                </div>
              </div>
              <div className="text-pink-600 text-sm font-medium hover:underline flex items-center">
                View wishlist <ArrowRight size={16} className="ml-1" />
              </div>
            </div>

            {/* Upcoming Trips - REAL COUNT */}
            <div
              onClick={() => navigate('/my-bookings?filter=upcoming')}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm">Upcoming Trips</div>
                  <div className="text-3xl font-bold text-green-600">{stats.upcomingTrips}</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="text-green-600" size={24} />
                </div>
              </div>
              <div className="text-green-600 text-sm font-medium hover:underline flex items-center">
                View trips <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
              <button
                onClick={() => navigate('/my-bookings')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All ({stats.bookings}) →
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => handleBookingClick(booking.id)}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{booking.packageName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500">Date: {booking.date}</p>
                        <p className="text-sm text-gray-500">• {booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</p>
                        <span className="text-xs text-gray-400">ID: {booking.bookingId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Packages */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Recommended For You</h2>
              <p className="text-gray-600 mt-1">
                Packages tailored to your interests
              </p>
            </div>
            <button
              onClick={() => navigate('/package')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full transition"
            >
              View All Packages
            </button>
          </div>

          {recommendedPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  description={pkg.description}
                  price={pkg.price?.toLocaleString?.() || pkg.price}
                  rating={typeof pkg.rating === 'object' ? (pkg.rating?.average ?? 0) : (pkg.rating ?? 0)}
                  reviews={typeof pkg.rating === 'object' ? (pkg.rating?.count ?? 0) : (pkg.reviews ?? 0)}
                  duration={pkg.duration}
                  difficulty={pkg.difficulty}
                  image={pkg.image || pkg.images?.[0]?.url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <PackageIcon className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No recommendations yet</h3>
              <p className="text-gray-500 mb-4">Start browsing packages to get personalized recommendations</p>
              <button
                onClick={() => navigate('/package')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
              >
                Browse Packages
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}