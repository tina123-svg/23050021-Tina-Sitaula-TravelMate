// pages/home/FeaturedPackages.jsx
import React, { useState, useEffect } from "react";
import PackageCard from "../../components/Card";
import { travelerService } from "../../services/travelerService";

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
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">
              Featured Packages
            </h2>
            <p className="text-lg text-gray-600 dark:text-black-700 max-w-2xl mx-auto">
              Loading featured packages...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <button
              onClick={fetchFeaturedPackages}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">
            Featured Packages
          </h2>
          <p className="text-lg text-gray-600 dark:text-black-700 max-w-2xl mx-auto">
            Explore our carefully curated selection of the most popular and highly-rated travel packages across Nepal
          </p>
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
                price={pkg.price?.toLocaleString()}
                rating={pkg.rating}
                reviews={pkg.reviews}
                duration={pkg.duration}
                difficulty={pkg.difficulty}
                image={pkg.image || "/assets/images/default-package.jpg"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No featured packages available at the moment.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/package"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition inline-block"
          >
            View All Packages
          </a>
        </div>
      </div>
    </section>
  );
}