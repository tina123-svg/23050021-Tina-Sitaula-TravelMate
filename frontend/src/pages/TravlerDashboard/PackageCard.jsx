// components/packages/PackageCardEnhanced.jsx
import React from "react";
import { Star, MapPin, Calendar, Check, Scale } from "lucide-react";

const PackageCardEnhanced = ({ package: pkg, isComparing, onCompareToggle }) => {
  const canCompare = true; // Always true for now, could add logic later

  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border ${isComparing
      ? "border-blue-500 ring-2 ring-blue-200"
      : "border-gray-200 hover:border-gray-300"
      }`}>

      {/* Compare Overlay */}
      <div className={`absolute top-3 right-3 z-20 ${isComparing ? "opacity-100" : "opacity-0 hover:opacity-100"
        } transition-opacity`}>
        <button
          onClick={onCompareToggle}
          disabled={!canCompare && !isComparing}
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${isComparing
            ? "bg-blue-600 text-white"
            : "bg-white/90 hover:bg-white text-gray-700"
            } ${!canCompare && !isComparing ? "opacity-50 cursor-not-allowed" : ""}`}
          title={isComparing ? "Remove from compare" : "Add to compare"}
        >
          {isComparing ? (
            <Check size={20} />
          ) : (
            <Scale size={18} />
          )}
        </button>
      </div>

      {/* Compare Badge */}
      {isComparing && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Check size={12} />
            Comparing
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
          NPR {pkg.price}
        </div>

        {/* Verified Agency Badge */}
        {pkg.verified && (
          <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified Agency
          </div>
        )}

        {/* Featured Badge */}
        {pkg.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ✨ Featured
          </div>
        )}
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
            <span className="font-bold text-sm">{pkg.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({pkg.reviews})</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={16} className="mr-2" />
          <span className="line-clamp-1">{pkg.destination}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Details Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>{pkg.duration} days</span>
          </div>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
            {pkg.difficulty}
          </span>
        </div>

        {/* Agency Info */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold text-xs">
                {pkg.agency?.charAt(0) || "A"}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">{pkg.agency}</div>
              <div className="text-xs text-gray-500">{pkg.category}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition text-center">
            View Details
          </button>

          <button className={`px-4 py-3 rounded-lg border font-medium transition ${isComparing
            ? "border-blue-600 text-blue-600 bg-blue-50"
            : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}>
            ❤️
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