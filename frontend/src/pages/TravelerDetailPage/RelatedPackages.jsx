// components/package-detail/RelatedPackages.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MapPin, Calendar } from "lucide-react";

// Mock related packages data
const relatedPackages = [
  {
    id: 2,
    title: "Annapurna Circuit Trek",
    description: "Classic loop around Annapurna with diverse landscapes.",
    price: "85,000",
    rating: 4.8,
    duration: 12,
    difficulty: "Moderate",
    destination: "Annapurna Region",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    category: "Trekking"
  },
  {
    id: 3,
    title: "Langtang Valley Trek",
    description: "Peaceful trek with Tamang culture and Himalayan views.",
    price: "55,000",
    rating: 4.9,
    duration: 10,
    difficulty: "Moderate",
    destination: "Langtang Region",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Trekking"
  },
  {
    id: 4,
    title: "Manaslu Circuit Trek",
    description: "Remote trek around the world's 8th highest peak.",
    price: "95,000",
    rating: 4.7,
    duration: 16,
    difficulty: "Challenging",
    destination: "Manaslu Region",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    category: "Trekking"
  },
  {
    id: 5,
    title: "Upper Mustang Jeep Tour",
    description: "Explore the forbidden kingdom in comfortable jeep.",
    price: "75,000",
    rating: 4.6,
    duration: 8,
    difficulty: "Moderate",
    destination: "Mustang Region",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    category: "Adventure"
  }
];

const RelatedPackages = ({ currentPackageId }) => {
  // Filter out current package and get related ones
  const filteredPackages = relatedPackages.filter(pkg => pkg.id !== currentPackageId);

  if (filteredPackages.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">You Might Also Like</h2>
          <p className="text-gray-600 mt-1">
            Similar adventures you might be interested in
          </p>
        </div>
        <Link
          to="/packages"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View All Packages
          <ArrowRight size={18} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPackages.map((pkg) => (
          <Link
            key={pkg.id}
            to={`/package/${pkg.id}`}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                NPR {pkg.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600">
                  {pkg.title}
                </h3>
                <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                  <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold text-sm">{pkg.rating}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="line-clamp-1">{pkg.destination}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {pkg.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar size={14} className="mr-1" />
                  <span>{pkg.duration} days</span>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {pkg.difficulty}
                </span>
              </div>

              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Comparison Note */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <Star className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Not sure which one to choose?</h3>
            <p className="text-gray-600">
              Use our comparison feature to compare up to 3 packages side-by-side and find the perfect match for your adventure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedPackages;