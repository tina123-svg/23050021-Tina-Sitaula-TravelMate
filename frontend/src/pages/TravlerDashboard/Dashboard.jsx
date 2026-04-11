import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import PackageCard from '../../components/Card';
import { Calendar, Heart, User, ArrowRight, Loader, Package as PackageIcon, MapPin } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm rounded-full border border-white/30 mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></span>
              Welcome Back, Explorer
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight drop-shadow-lg">
              Ready for your next<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200">
                adventure, {stats.name}?
              </span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-8">
              Discover breathtaking destinations across Nepal and beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/package')}
                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <PackageIcon size={18} />
                Browse Packages
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex items-center gap-2 bg-transparent border-2 border-white/60 text-white hover:bg-white/10 font-medium px-7 py-3 rounded-full transition-all"
              >
                <Calendar size={18} />
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-12 pb-16 relative z-10">
        {/* Quick Stats */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                label: "My Bookings",
                value: stats.bookings,
                icon: Calendar,
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50",
                textColor: "text-blue-600",
                route: '/my-bookings',
                link: "View all bookings",
              },
              {
                label: "Wishlist",
                value: stats.wishlist,
                icon: Heart,
                color: "from-pink-500 to-rose-500",
                bg: "bg-pink-50",
                textColor: "text-pink-600",
                route: '/wishlist',
                link: "View wishlist",
              },
              {
                label: "Upcoming Trips",
                value: stats.upcomingTrips,
                icon: MapPin,
                color: "from-emerald-500 to-teal-500",
                bg: "bg-emerald-50",
                textColor: "text-emerald-600",
                route: '/my-bookings',
                link: "View trips",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  onClick={() => navigate(stat.route)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className={`text-4xl font-extrabold ${stat.textColor}`}>{stat.value}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-3">{stat.label}</div>
                  <div className={`${stat.textColor} text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    {stat.link}
                    <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <p className="text-gray-500 text-sm mt-0.5">Your latest travel adventures</p>
              </div>
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
              >
                View All ({stats.bookings})
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {recentBookings.map((booking, i) => (
                <div
                  key={booking.id}
                  onClick={() => handleBookingClick(booking.id)}
                  className={`p-5 flex justify-between items-center cursor-pointer hover:bg-blue-50/50 transition-colors ${i < recentBookings.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PackageIcon className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.packageName}</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-gray-500">{booking.date}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <ArrowRight size={16} className="text-gray-300" />
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
              <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
              <p className="text-gray-500 mt-1 text-sm">Handpicked adventures to inspire your next journey</p>
            </div>
            <button
              onClick={() => navigate('/package')}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              All Packages
              <ArrowRight size={16} />
            </button>
          </div>

          {recommendedPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
            <div className="relative rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-blue-900/70" />
              </div>
              <div className="relative z-10 py-16 text-center">
                <PackageIcon className="mx-auto text-white/60 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Start Your Adventure</h3>
                <p className="text-blue-200 mb-6 max-w-sm mx-auto">Discover amazing packages and get personalized recommendations</p>
                <button
                  onClick={() => navigate('/package')}
                  className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-all shadow-lg"
                >
                  Browse Packages
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}