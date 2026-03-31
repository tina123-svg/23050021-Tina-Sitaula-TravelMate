// RelatedPackages.jsx - Fixed Version (using props)
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MapPin, Calendar } from "lucide-react";

const RelatedPackages = ({ currentPackageId, relatedPackages = [] }) => {

  // Helper to safely get rating value
  const getRatingValue = (rating) => {
    if (!rating) return 0;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'object' && rating !== null) {
      return rating.average || rating.value || 0;
    }
    return 0;
  };

  // Filter out current package
  const filteredPackages = relatedPackages.filter(pkg =>
    pkg.id && pkg.id !== currentPackageId
  );

  if (!filteredPackages || filteredPackages.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
        <p className="text-gray-600 text-center py-8">
          No related packages found.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
          <p className="text-gray-600 mt-2">Similar adventures you might enjoy</p>
        </div>
        <Link
          to="/packages"
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          View all packages <ArrowRight size={18} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPackages.slice(0, 4).map((pkg) => {
          // Safely extract rating
          const ratingValue = getRatingValue(pkg.rating);

          // Get image URL safely
          const imageUrl = pkg.images?.[0]?.url
            ? `https://travelmatess.onrender.com${pkg.images[0].url}`
            : pkg.image || "/assets/images/default-package.jpg";

          // Get price safely
          const price = typeof pkg.price === 'number'
            ? pkg.price
            : parseFloat(pkg.price) || 0;

          return (
            <Link
              key={pkg.id}
              to={`/package/${pkg.id}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {pkg.featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category & Rating */}
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {pkg.category || "Adventure"}
                  </span>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {ratingValue.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                  {pkg.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pkg.description || pkg.tagline || "Adventure package"}
                </p>

                {/* Location & Duration */}
                <div className="flex items-center text-gray-500 text-sm mb-4 space-x-4">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{pkg.destination || "Nepal"}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{pkg.duration || 0} days</span>
                  </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-blue-700">
                      ${price.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-sm">per person</div>
                  </div>

                  <div className="text-blue-600 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    View details
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedPackages;