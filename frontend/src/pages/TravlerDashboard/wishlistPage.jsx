import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { wishlistService } from '../../services/wishlistService';
import {
  Heart,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Package as PackageIcon,
  Filter,
  Search,
  ShoppingBag
} from 'lucide-react';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();

      if (response.success) {
        setWishlist(response.wishlist || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wishlist');
      console.error('Wishlist fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (packageId) => {
    try {
      await wishlistService.removeFromWishlist(packageId);

      setWishlist(prev => prev.filter(item => item.id !== packageId));

    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove from wishlist');
    }
  };

  const handleBookNow = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  const filteredWishlist = wishlist.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort wishlist
  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'duration':
        return b.duration - a.duration;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0; // Keep original order for 'recent'
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-pink-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500">Loading your wishlist...</p>
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
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 pt-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-16">
          <div className="flex items-center gap-3 mb-3">
            <Heart size={28} className="text-white fill-white" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">My Wishlist</h1>
          </div>
          <p className="text-pink-100 text-lg">
            {wishlist.length} dream {wishlist.length === 1 ? 'destination' : 'destinations'} saved — ready to become reality
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search saved packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/30 shadow-sm text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button
              onClick={fetchWishlist}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 shadow-sm transition-all"
            >
              <Filter size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
          </div>
        )}

        {/* Wishlist Grid */}
        {sortedWishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWishlist.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={`https://travelmatess.onrender.com${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all"
                    title="Remove from wishlist"
                  >
                    <Heart size={18} className="text-rose-500 fill-rose-500" />
                  </button>
                  {item.featured && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-semibold rounded-full shadow">
                      ✦ Featured
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <MapPin size={11} />
                      {item.destination}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight pr-2">{item.title}</h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-extrabold text-blue-600">
                        NPR {item.price?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">/ person</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-700">{item.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-400 text-sm">({item.reviewCount || 0} reviews)</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-blue-400" />
                      {item.duration}d
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-blue-400" />
                      <span className="capitalize">{item.difficulty}</span>
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBookNow(item.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <ShoppingBag size={17} />
                      Book Now
                    </button>
                    <button
                      onClick={() => navigate(`/package/${item.id}`)}
                      className="px-4 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl flex items-center justify-center transition-all"
                      title="View details"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?q=80&w=2664&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 to-purple-900/70" />
            </div>
            <div className="relative z-10 py-20 text-center">
              <Heart size={56} className="text-white/60 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
              <p className="text-pink-200 mb-8 max-w-md mx-auto">
                Save your dream destinations and never lose track of where you want to go next.
              </p>
              <Link
                to="/package"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-pink-700 font-semibold rounded-full hover:bg-pink-50 transition-all shadow-lg"
              >
                <PackageIcon size={18} />
                Discover Packages
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;