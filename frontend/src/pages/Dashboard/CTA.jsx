import React from "react";

export default function CTA() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-r from-blue-900 to-blue-1000 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/4" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8">
          Ready for Your Next Adventure?
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join thousands of travelers discovering Nepal's most incredible destinations through Travel Mate
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-5 rounded-full shadow-2xl transition transform hover:scale-105"
          >
            Sign Up Free
          </a>

          <a
            href="/packages"
            className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-10 py-5 rounded-full transition backdrop-blur-sm"
          >
            Explore Packages
          </a>
        </div>
      </div>
    </section>
  );
}