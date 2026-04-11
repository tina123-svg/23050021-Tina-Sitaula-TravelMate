import React from "react";
import { Calendar, MapPin, Users, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax-like effect */}
      <div
        className="absolute inset-0 z-0 scale-105 transform transition-transform duration-[20s] hover:scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2670&q=80')", // Stunning lake and mountain landscape
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center mt-[-10vh]">

        {/* Badges/Tags */}
        <div className="mb-6 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg animate-fade-in-down">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2"></span>
          <span className="text-white text-sm font-medium tracking-wide">
            Your Premium Travel Partner
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white text-center leading-tight tracking-tight drop-shadow-2xl">
          Discover the World's Best <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">
            Hidden Gems
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-white/90 font-light text-center max-w-2xl drop-shadow-md">
          Experience unforgettable journeys curated by trusted local experts. From breathtaking mountains to vibrant cityscapes.
        </p>

        {/* Floating Search Bar */}
        <div className="mt-12 w-full max-w-4xl glass-effect rounded-2xl p-4 md:p-6 shadow-2xl border border-white/30 transform translate-y-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Location Input */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 group-hover:text-blue-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 hover:bg-white/80 focus:bg-white border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 placeholder:text-gray-500"
              />
            </div>

            {/* Date Input */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 group-hover:text-blue-600 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Select Dates"
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 hover:bg-white/80 focus:bg-white border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 placeholder:text-gray-500 cursor-pointer"
              />
            </div>

            {/* Guests Input */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 group-hover:text-blue-600 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <select className="w-full pl-12 pr-4 py-3.5 bg-white/60 hover:bg-white/80 focus:bg-white border-0 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 appearance-none cursor-pointer">
                <option value="">Guests</option>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3+ People</option>
              </select>
            </div>

            {/* Submit Button */}
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
