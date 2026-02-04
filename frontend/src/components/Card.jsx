import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PackageCard({
  id,
  title,
  description,
  price,
  rating,
  reviews,
  duration,
  difficulty,
  image,
  images
}) {
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return "/assets/images/default-package.jpg";
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const displayImage = getImageUrl(
    image ||
    (images?.find(img => img.isCover)?.url) ||
    (images?.[0]?.url)
  ) || "/assets/images/default-package.jpg";

  // Safe rating extraction (you already have g ood logic)
  const ratingValue = typeof rating === 'object' ? rating.average || 0 : rating || 0;
  const reviewCount = typeof rating === 'object' ? rating.count || 0 : reviews || 0;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/package/${id}`)}
    >
      {/* Image Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            e.target.src = "/assets/images/default-package.jpg";
          }}
        />
        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          NPR {typeof price === 'number' ? price.toLocaleString() : price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
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
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span><strong>{duration}</strong> days</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
            {difficulty || 'Moderate'}
          </span>
        </div>

        {/* View Details Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition">
          View Details
        </button>
      </div>
    </div>
  );
}