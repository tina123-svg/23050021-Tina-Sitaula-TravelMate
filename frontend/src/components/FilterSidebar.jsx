 import React from "react";
import { X, Filter, IndianRupee, Clock, Star, MapPin, Tag } from "lucide-react";

const FilterSidebar = ({ filters, setFilters, categories = [], destinations = [], clearFilters }) => {
 
  const priceMarks = {
    0: '₹0',
    50000: '₹50k',
    100000: '₹1L',
    150000: '₹1.5L',
    200000: '₹2L+'
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: [0, value]
    }));
  };

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDestination = (destination) => {
    setFilters(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter(d => d !== destination)
        : [...prev.destinations, destination]
    }));
  };

  const toggleDuration = (durationType) => {
    setFilters(prev => ({
      ...prev,
      duration: prev.duration.includes(durationType)
        ? prev.duration.filter(d => d !== durationType)
        : [...prev.duration, durationType]
    }));
  };

  const setRating = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const hasActiveFilters =
    filters.priceRange[1] < 200000 ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.destinations && filters.destinations.length > 0) ||
    filters.rating > 0 ||
    (filters.duration && filters.duration.length > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center">
          <Filter className="text-blue-600 mr-2" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Price Range */}
        <div>
          <div className="flex items-center mb-4">
            <IndianRupee className="text-gray-500 mr-2" size={18} />
            <h3 className="font-medium text-gray-700">Price Range</h3>
          </div>

          <div className="px-2">
            {/* Slider */}
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={filters.priceRange?.[1] || 200000}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
            />

            {/* Price marks */}
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {Object.entries(priceMarks).map(([value, label]) => (
                <span key={value}>{label}</span>
              ))}
            </div>

            {/* Selected price display */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Up to: </span>
              <span className="font-bold text-blue-700">
                ₹{(filters.priceRange?.[1] || 200000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center mb-4">
            <Tag className="text-gray-500 mr-2" size={18} />
            <h3 className="font-medium text-gray-700">Category</h3>
          </div>

          <div className="space-y-2">
            {categories && categories.length > 0 ? (
              categories.map(category => (
                <label key={category} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.categories || []).includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">{category}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading categories...</p>
            )}
          </div>
        </div>

        {/* Destinations */}
        <div>
          <div className="flex items-center mb-4">
            <MapPin className="text-gray-500 mr-2" size={18} />
            <h3 className="font-medium text-gray-700">Destinations</h3>
          </div>

          <div className="space-y-2">
            {destinations && destinations.length > 0 ? (
              destinations.map(destination => (
                <label key={destination} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.destinations || []).includes(destination)}
                    onChange={() => toggleDestination(destination)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">{destination}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading destinations...</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center mb-4">
            <Clock className="text-gray-500 mr-2" size={18} />
            <h3 className="font-medium text-gray-700">Duration</h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "short", label: "1-7 Days" },
              { value: "medium", label: "8-14 Days" },
              { value: "long", label: "15+ Days" }
            ].map(item => (
              <button
                key={item.value}
                onClick={() => toggleDuration(item.value)}
                className={`px-3 py-2 rounded-lg border text-sm ${(filters.duration || []).includes(item.value)
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <div className="flex items-center mb-4">
            <Star className="text-gray-500 mr-2" size={18} />
            <h3 className="font-medium text-gray-700">Minimum Rating</h3>
          </div>

          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map(rating => (
              <button
                key={rating}
                onClick={() => setRating(rating)}
                className={`flex items-center w-full p-2 rounded-lg ${filters.rating === rating
                  ? "bg-yellow-50 border border-yellow-200"
                  : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        } ${i === Math.floor(rating) && rating % 1 !== 0
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                        }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-700">{rating}+</span>
                {filters.rating === rating && (
                  <X size={14} className="ml-auto text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Agency Verification */}
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700">Verified Agencies Only</span>
          </label>
        </div>

        {/* Special Features */}
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Special Features</h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700">Free Cancellation</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700">Instant Confirmation</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700">Best Seller</span>
            </label>
          </div>
        </div>
      </div>

      {/* Apply Button for Mobile */}
      <button className="lg:hidden w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;