import React from "react";
import { Star, MapPin, Clock } from "lucide-react";
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
    if (!url) return "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80"; // Premium fallback image
    if (url.startsWith('http')) return url;
    return `https://travelmatess.onrender.com${url}`;
  };

  const displayImage = getImageUrl(
    image ||
    (images?.find(img => img.isCover)?.url) ||
    (images?.[0]?.url)
  );

  // Safe rating extraction
  const ratingValue = typeof rating === 'object' ? rating.average || 0 : rating || 0;
  const reviewCount = typeof rating === 'object' ? rating.count || 0 : reviews || 0;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-300 border border-gray-100 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full"
      onClick={() => navigate(`/package/${id}`)}
    >
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80";
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          <span className="text-blue-600 mr-1">NPR</span>
          {typeof price === 'number' ? price.toLocaleString() : price}
        </div>

        {/* Floating Rating */}
        <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-1.5 border border-white/20">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-medium text-sm">{ratingValue.toFixed(1)}</span>
          <span className="text-gray-300 text-xs">({reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">

        {/* Meta info row */}
        <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration} days</span>
          </div>
          <span className={`px-2.5 py-1 rounded-md ${difficulty === 'Hard' ? 'bg-red-50 text-red-600' : difficulty === 'Easy' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
            {difficulty || 'Moderate'}
          </span>
        </div>

        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* View Details Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="w-full bg-gray-50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white text-gray-700 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
            <span>View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}