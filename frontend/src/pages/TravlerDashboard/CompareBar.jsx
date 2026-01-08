// components/packages/CompareBar.jsx
import React from "react";
import { X, Scale, ChevronRight } from "lucide-react";

const CompareBar = ({ compareList, packages, clearCompare }) => {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Selected packages */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Scale className="text-blue-600" size={20} />
              <span className="font-medium text-gray-800">
                Compare Packages ({compareList.length}/3)
              </span>
            </div>

            <div className="flex gap-2">
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"
                >
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {pkg.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={clearCompare}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
            >
              <X size={16} />
              Clear All
            </button>

            {compareList.length >= 2 ? (
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2">
                Compare Now
                <ChevronRight size={16} />
              </button>
            ) : (
              <div className="text-sm text-gray-500">
                Select {2 - compareList.length} more to compare
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;