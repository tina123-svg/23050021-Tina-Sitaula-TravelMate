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
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'package' : 'packages'} saved
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search in wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button
                onClick={fetchWishlist}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right"
            >
              ×
            </button>
          </div>
        )}

        {/* Wishlist Items */}
        {sortedWishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWishlist.map(item => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/images/default-package.jpg";
                    }}
                  />
                  {/* Remove button */}``
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white"
                  >
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </button>
                  {item.featured && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        NPR {item.price?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per person</div>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-gray-700 font-medium">
                      {item.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      ({item.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{item.destination}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>{item.duration} days</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users size={16} className="mr-2" />
                      <span className="capitalize">{item.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBookNow(item.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center"
                    >
                      <ShoppingBag size={18} className="mr-2" />
                      Book Now
                    </button>
                    <button
                      onClick={() => navigate(`/package/${item.id}`)}
                      className="px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Save your favorite packages to book them later
            </p>
            <Link
              to="/package"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              <PackageIcon size={20} className="mr-2" />
              Browse Packages
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;