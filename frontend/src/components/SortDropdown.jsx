 import React, { useState } from "react";
import { ChevronDown, TrendingUp, DollarSign, Star, Clock } from "lucide-react";

const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "price-low", label: "Price: Low to High", icon: DollarSign },
    { value: "price-high", label: "Price: High to Low", icon: DollarSign },
    { value: "rating", label: "Highest Rated", icon: Star },
    { value: "duration", label: "Shortest Duration", icon: Clock }
  ];

  const selectedOption = sortOptions.find(opt => opt.value === sortBy);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && <selectedOption.icon size={16} />}
          <span>{selectedOption?.label || "Sort by"}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 ${sortBy === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"
                      }`}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                    {sortBy === option.value && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;