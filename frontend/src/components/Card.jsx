import React from "react";
import { Star } from "lucide-react";

export default function PackageCard({ title, description, price, rating, reviews, duration, difficulty, image }) {
  return (
    <div className="bg-white dark:bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-30 border border-gray-50 dark:border-gray-100">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow">
          NPR {price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-600 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-700"
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-500">
            {rating}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({reviews} reviews)
          </span>
        </div>

        {/* Duration & Difficulty */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          <strong>{duration} days</strong> • {difficulty}
        </div>

        {/* Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition">
          View Details
        </button>
      </div>
    </div>
  );
}