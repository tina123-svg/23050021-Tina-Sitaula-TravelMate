import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop')",
              backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100 dark:to-gray-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Discover Nepal's Best Travel Packages
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light drop-shadow-md">
            Handpicked adventures from trusted local agencies
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Destination */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Where to? (e.g. Pokhara, Everest)"
                className="px-5 py-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                Start Date
              </label>
              <input
                type="date"
                className="px-5 py-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                End Date
              </label>
              <input
                type="date"
                className="px-5 py-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white"
              />
            </div>

            {/* Travelers */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Users size={18} className="text-blue-600 dark:text-blue-400" />
                Travelers
              </label>
              <input
                type="number"
                placeholder="1"
                min="1"
                defaultValue="1"
                className="px-5 py-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-5 rounded-lg shadow-lg transition transform hover:scale-105">
              Search Packages
            </button>
            <button className="flex-1 sm:flex-none border-2 border-white text-white hover:bg-white/10 font-bold text-lg py-5 px-10 rounded-lg backdrop-blur-sm transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}