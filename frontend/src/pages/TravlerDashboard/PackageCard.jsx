import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Calendar, Check, Scale, Heart } from "lucide-react";
import { wishlistService } from "../../services/wishlistService";

const PackageCardEnhanced = ({ pkg, isComparing, onCompareToggle, onViewDetails }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if package is in wishlist on component mount
  useEffect(() => {
    checkWishlistStatus();
  }, [pkg.id || pkg._id]);

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // User not logged in

      const response = await wishlistService.checkWishlistStatus(pkg.id || pkg._id);
      if (response.success) {
        setIsFavorite(response.isInWishlist);
      }
    } catch (error) {
      // User might not be logged in or API error
      console.log("Couldn't check wishlist status:", error.message);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "/assets/images/default-package.jpg";
    if (url.startsWith('http')) return url;
    return `https://travelmatess.onrender.com${url}`;
  };

  const displayImage = getImageUrl(
    pkg.images?.find(img => img.isCover)?.url ||
    pkg.images?.[0]?.url ||
    pkg.image
  ) || "/assets/images/default-package.jpg";

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      // Save current URL for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(pkg.id || pkg._id);
        setIsFavorite(false);
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(pkg.id || pkg._id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onCompareToggle();
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/package/${pkg.id || pkg._id}`);
    }
  };

  const ratingValue = typeof pkg.rating === 'object' ? pkg.rating?.average || 0 : pkg.rating || 0;
  const reviewCount = typeof pkg.rating === 'object' ? pkg.rating?.count || 0 : pkg.reviews || 0;

  const formatPrice = (price) => {
    if (typeof price === 'number') return `NPR ${price.toLocaleString()}`;
    return `NPR ${price}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border cursor-pointer group
        ${isComparing ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"}`}
    >
      {/* Compare & Favorite Buttons */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button
          onClick={handleCompareClick}
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition
            ${isComparing ? "bg-blue-600 text-white" : "bg-white/90 hover:bg-white text-gray-700"}`}
          title={isComparing ? "Remove from compare" : "Add to compare"}
        >
          {isComparing ? <Check size={20} /> : <Scale size={18} />}
        </button>

        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition
            ${isFavorite ? "bg-red-50 border border-red-200" : "bg-white/90 hover:bg-white"}
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-700 group-hover:text-red-500"
            }
          />
        </button>
      </div>

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/assets/images/default-package.jpg";
          }}
        />

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          {formatPrice(pkg.price)}
        </div>

        {/* Category Badge */}
        {pkg.category && (
          <div className="absolute bottom-4 left-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
            {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {pkg.title}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={16} className="mr-1.5 flex-shrink-0" />
          <span className="line-clamp-1">{pkg.destination || "Nepal"}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description || "Experience an unforgettable adventure in Nepal."}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.floor(ratingValue)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="font-medium text-gray-800">
            {ratingValue.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({reviewCount})
          </span>
        </div>

        {/* Duration & Difficulty */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-5">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5" />
            <span>{pkg.duration || 1} day{pkg.duration !== 1 ? 's' : ''}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${pkg.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            pkg.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              pkg.difficulty === 'challenging' ? 'bg-orange-100 text-orange-800' :
                pkg.difficulty === 'strenuous' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
            }`}>
            {pkg.difficulty || "Moderate"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/package/${pkg._id || pkg.id}`);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            View Details
          </button>

          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`px-4 py-2.5 rounded-lg border font-medium transition flex items-center justify-center min-w-[50px]
              ${isFavorite
                ? "border-red-500 text-red-500 bg-red-50 hover:bg-red-100"
                : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-red-500" : ""}
            />
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default PackageCardEnhanced;