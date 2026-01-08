import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[95vh] overflow-hidden flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-gray-100 dark:to-gray-900" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">
            Discover Nepal’s Best <br className="hidden sm:block" />
            Travel Packages
          </h1>

          <p className="mt-6 text-lg md:text-2xl text-white/90 font-light drop-shadow-md max-w-2xl">
            Handpicked adventures from trusted local agencies, designed for
            unforgettable journeys across Nepal.
          </p>
        </div>
      </div>
    </section>
  );
}
