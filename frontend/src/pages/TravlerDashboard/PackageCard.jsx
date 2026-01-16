import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Calendar, Check, Scale, Heart } from "lucide-react";

const PackageCardEnhanced = ({ pkg, isComparing, onCompareToggle, onViewDetails }) => {
  const ratingValue = typeof pkg.rating === 'object' ? pkg.rating?.average || 0 : pkg.rating || 0;
  const reviewCount = typeof pkg.rating === 'object' ? pkg.rating?.count || 0 : pkg.reviews || 0;
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Add to wishlist API call
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onCompareToggle();
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate(`/package/${pkg.id}`);
    }
  };

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/package/${pkg.id}`);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `NPR ${price.toLocaleString()}`;
    }
    return `NPR ${price}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border cursor-pointer ${isComparing
        ? "border-blue-500 ring-2 ring-blue-200"
        : "border-gray-200 hover:border-gray-300"
        }`}
    >
      {/* Compare Overlay */}
      <div className={`absolute top-3 right-3 z-20 ${isComparing ? "opacity-100" : "opacity-0 hover:opacity-100"
        } transition-opacity`}>
        <button
          onClick={handleCompareClick}
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${isComparing
            ? "bg-blue-600 text-white"
            : "bg-white/90 hover:bg-white text-gray-700"
            }`}
          title={isComparing ? "Remove from compare" : "Add to compare"}
        >
          {isComparing ? <Check size={20} /> : <Scale size={18} />}
        </button>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={20}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}
        />
      </button>

      {/* Compare Badge */}
      {isComparing && (
        <div className="absolute top-14 left-3 z-10">
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Check size={12} />
            Comparing
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.image || "/assets/images/default-package.jpg"}
          alt={pkg.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/assets/images/default-package.jpg";
          }}
        />

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
          {formatPrice(pkg.price)}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          {pkg.category || "Package"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 flex-1 pr-2">
            {pkg.title}
          </h3>
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded-lg min-w-[60px] justify-center">
            <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-bold text-sm">{ratingValue || 5}</span>
            <span className="text-xs text-gray-500 ml-1">({reviewCount || 0})</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="line-clamp-1">{pkg.destination || "Multiple destinations"}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description || "Experience this amazing adventure package."}
        </p>

        {/* Details Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 flex-shrink-0" />
            <span>{pkg.duration || 1} day{pkg.duration !== 1 ? 's' : ''}</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium capitalize">
            {pkg.difficulty || "Easy"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetailsClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition text-center"
          >
            View Details
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`px-4 py-3 rounded-lg border font-medium transition ${isFavorite
              ? "border-red-500 text-red-500 bg-red-50"
              : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-red-500" : ""}
            />
          </button>
        </div>

        {/* Quick Compare Info */}
        {isComparing && (
          <div className="mt-4 pt-3 border-t border-blue-100">
            <div className="text-xs text-blue-600 font-medium mb-1">
              ✓ Added to compare list
            </div>
            <div className="text-xs text-gray-500">
              Compare with up to 2 more packages
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCardEnhanced;