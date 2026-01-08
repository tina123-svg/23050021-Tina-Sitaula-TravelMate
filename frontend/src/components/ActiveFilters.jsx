// components/ActiveFilters.jsx - UPDATED
import React from "react";
import { X } from "lucide-react";

const ActiveFilters = ({ filters, setFilters, searchQuery, setSearchQuery }) => {
  const activeFilters = [];

  // Search filter
  if (searchQuery) {
    activeFilters.push({
      key: "search",
      label: `Search: "${searchQuery}"`,
      remove: () => setSearchQuery("")
    });
  }

  // Price filter
  if (filters.priceRange[1] < 200000) {
    activeFilters.push({
      key: "price",
      label: `Up to ₹${filters.priceRange[1].toLocaleString()}`,
      remove: () => setFilters(prev => ({ ...prev, priceRange: [0, 200000] }))
    });
  }

  // Category filters
  filters.categories.forEach(category => {
    activeFilters.push({
      key: `category-${category}`,
      label: category,
      remove: () => setFilters(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== category)
      }))
    });
  });

  // Destination filters
  filters.destinations.forEach(destination => {
    activeFilters.push({
      key: `destination-${destination}`,
      label: destination,
      remove: () => setFilters(prev => ({
        ...prev,
        destinations: prev.destinations.filter(d => d !== destination)
      }))
    });
  });

  // Rating filter
  if (filters.rating > 0) {
    activeFilters.push({
      key: "rating",
      label: `${filters.rating}+ Stars`,
      remove: () => setFilters(prev => ({ ...prev, rating: 0 }))
    });
  }

  // Duration filters
  filters.duration.forEach(duration => {
    const label = {
      short: "1-7 Days",
      medium: "8-14 Days",
      long: "15+ Days"
    }[duration];

    activeFilters.push({
      key: `duration-${duration}`,
      label,
      remove: () => setFilters(prev => ({
        ...prev,
        duration: prev.duration.filter(d => d !== duration)
      }))
    });
  });

  if (activeFilters.length === 0) return null;

  const clearAll = () => {
    setFilters({
      priceRange: [0, 200000],
      categories: [],
      destinations: [],
      rating: 0,
      duration: []
    });
    setSearchQuery("");
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(filter => (
          <div
            key={filter.key}
            className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-sm"
          >
            <span>{filter.label}</span>
            <button
              onClick={filter.remove}
              className="ml-1 hover:text-blue-900"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;