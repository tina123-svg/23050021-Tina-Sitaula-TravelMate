// pages/home/FeaturedPackages.jsx
import React, { useState, useEffect } from "react";
import PackageCard from "../../components/Card";
import { travelerService } from "../../services/travelerService";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedPackages() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      setLoading(true);
      const response = await travelerService.getFeaturedPackages();

      if (response.success) {
        setPackages(response.data);
      } else {
        setError(response.message || "Failed to load packages");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error");
      console.error("Featured packages error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4 tracking-tight">
              Curated Experiences
            </h2>
            <p className="text-lg text-gray-500">Discover our handpicked destinations...</p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-50 rounded-2xl p-8 text-center max-w-2xl mx-auto border border-red-100 shadow-sm">
            <div className="text-red-500 font-medium mb-4">{error}</div>
            <button
              onClick={fetchFeaturedPackages}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-8 rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50/50 relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 border border-blue-100">
              <Sparkles size={16} />
              <span>Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 tracking-tight">
              Featured Adventures
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              Explore our carefully curated selection of the most popular and highly-rated escapes across breathtaking landscapes.
            </p>
          </div>
          <div className="mt-6 md:mt-0 hidden md:block">
            <a
              href="/package"
              className="group inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
            >
              See all packages
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.title}
                description={pkg.description}
                price={pkg.price}
                rating={pkg.rating}
                reviews={pkg.reviews}
                duration={pkg.duration}
                difficulty={pkg.difficulty}
                image={pkg.image}
                images={pkg.images}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-gray-400" />
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">No packages right now</h3>
            <p className="text-gray-500">We are currently updating our featured adventures. Check back soon!</p>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <a
            href="/package"
            className="inline-flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 font-semibold py-4 rounded-xl hover:bg-blue-100 transition-colors"
          >
            See all packages
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}