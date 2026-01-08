 import React from "react";
import PackageCard from "../pages/TravlerDashboard/PackageCard";
import { Package } from "lucide-react";

const PackageGridEnhanced = ({ packages, compareList, toggleCompare }) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          No packages found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Compare Info */}
      {compareList.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-blue-700">
                {compareList.length} package{compareList.length > 1 ? 's' : ''} selected for comparison
              </span>
              <p className="text-sm text-blue-600 mt-1">
                Select up to 3 packages to compare features and prices
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {3 - compareList.length} more can be selected
            </div>
          </div>
        </div>
      )}

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            isComparing={compareList.includes(pkg.id)}
            onCompareToggle={() => toggleCompare(pkg.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PackageGridEnhanced;