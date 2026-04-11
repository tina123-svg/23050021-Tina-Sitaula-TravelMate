import React from "react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-24 md:py-32 bg-gray-900 overflow-hidden">
      {/* Dynamic Gradient Background map */}
      <div className="absolute inset-0 z-0 opacity-80"
        style={{
          background: "radial-gradient(circle at top right, #2563eb, transparent 50%), radial-gradient(circle at bottom left, #0ea5e9, transparent 50%)"
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-heading font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          Ready for Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-200">Adventure?</span>
        </h2>
        <p className="text-xl md:text-2xl text-blue-100/90 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
          Join thousands of travelers discovering the world's most incredible destinations through TravelMate. Your journey starts here.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <a
            href="/signup"
            className="group flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/package"
            className="group flex items-center justify-center gap-2 bg-transparent border-2 border-white/70 text-white hover:bg-white/10 hover:border-white font-medium text-lg px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
          >
            View Packages
          </a>
        </div>
      </div>
    </section>
  );
}