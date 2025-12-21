import React from "react";
import PackageCard from "../../components/Card"; // ← correct path if Card.jsx is in components/common or root

const featuredPackages = [
  {
    title: "Everest Base Camp Trek",
    description: "Journey to the base of the world's highest peak with experienced guides and stunning views.",
    price: "85,000",
    rating: 4.9,
    reviews: 128,
    duration: 14,
    difficulty: "Challenging",
    image: "/assets/images/everest.jpg",
  },
  {
    title: "Annapurna Circuit Trek",
    description: "Classic loop around Annapurna with diverse landscapes and local culture.",
    price: "65,000",
    rating: 4.8,
    reviews: 94,
    duration: 12,
    difficulty: "Moderate",
    image: "/assets/images/annapurna.jpg",
  },
  {
    title: "Pokhara Adventure",
    description: "Paragliding, boating, and mountain views in Nepal's lake city.",
    price: "35,000",
    rating: 4.7,
    reviews: 210,
    duration: 5,
    difficulty: "Easy",
    image: "/assets/images/pokhara.jpg",
  },
  {
    title: "Chitwan Jungle Safari",
    description: "Wildlife adventure spotting rhinos, tigers, and elephants.",
    price: "25,000",
    rating: 4.6,
    reviews: 156,
    duration: 3,
    difficulty: "Easy",
    image: "/assets/images/chitwan.jpg",
  },
  {
    title: "Kathmandu Cultural Tour",
    description: "Explore ancient temples and UNESCO sites in the capital valley.",
    price: "18,000",
    rating: 4.8,
    reviews: 89,
    duration: 4,
    difficulty: "Easy",
    image: "/assets/images/kathmandu.jpg",
  },
  {
    title: "Langtang Valley Trek",
    description: "Peaceful trek with Tamang culture and Himalayan views.",
    price: "55,000",
    rating: 4.9,
    reviews: 67,
    duration: 10,
    difficulty: "Moderate",
    image: "/assets/images/div.png",
  },
];

export default function FeaturedPackages() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition">
            View All Packages
          </button>
        </div>
      </div>
    </section>
  );
}