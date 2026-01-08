// pages/TravelerDashboard.jsx
import React from "react";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import PackageCard from '../../components/Card';
import { Search, Calendar, Heart, User, ArrowRight } from "lucide-react";

// Dummy data matching your PackageCard structure
const recommendedPackages = [
  {
    title: "Everest Base Camp Trek",
    description: "Journey to the base of the world's highest peak with experienced guides and stunning views.",
    price: "120,000",
    rating: 4.9,
    reviews: 128,
    duration: 14,
    difficulty: "Challenging",
    image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800",
  },
  {
    title: "Annapurna Circuit Trek",
    description: "Classic loop around Annapurna with diverse landscapes and local culture.",
    price: "85,000",
    rating: 4.8,
    reviews: 94,
    duration: 12,
    difficulty: "Moderate",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
  },
  {
    title: "Pokhara Adventure",
    description: "Paragliding, boating, and mountain views in Nepal's lake city.",
    price: "35,000",
    rating: 4.7,
    reviews: 210,
    duration: 5,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1564507004663-b6dfb3e2ede5?w=800",
  },
  {
    title: "Chitwan Jungle Safari",
    description: "Wildlife adventure spotting rhinos, tigers, and elephants.",
    price: "25,000",
    rating: 4.6,
    reviews: 156,
    duration: 3,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1526392587636-9a0e8a0e5c6a?w=800",
  },
  {
    title: "Kathmandu Cultural Tour",
    description: "Explore ancient temples and UNESCO sites in the capital valley.",
    price: "18,000",
    rating: 4.8,
    reviews: 89,
    duration: 4,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800",
  },
  {
    title: "Langtang Valley Trek",
    description: "Peaceful trek with Tamang culture and Himalayan views.",
    price: "55,000",
    rating: 4.9,
    reviews: 67,
    duration: 10,
    difficulty: "Moderate",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  },
];

// User stats
const userStats = {
  name: "Alex",
  bookings: 3,
  wishlist: 7,
  upcomingTrips: 1
};

export default function TravelerDashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {userStats.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready for your next adventure in Nepal?
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bookings Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm">My Bookings</div>
                  <div className="text-3xl font-bold text-blue-600">{userStats.bookings}</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
              </div>
              <a href="/my-bookings" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                View all bookings <ArrowRight size={16} className="ml-1" />
              </a>
            </div>

            {/* Wishlist Card */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm">Wishlist</div>
                  <div className="text-3xl font-bold text-pink-600">{userStats.wishlist}</div>
                </div>
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Heart className="text-pink-600" size={24} />
                </div>
              </div>
              <a href="/wishlist" className="text-pink-600 text-sm font-medium hover:underline flex items-center">
                View wishlist <ArrowRight size={16} className="ml-1" />
              </a>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-500 text-sm">Upcoming Trips</div>
                  <div className="text-3xl font-bold text-green-600">{userStats.upcomingTrips}</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <User className="text-green-600" size={24} />
                </div>
              </div>
              <a href="/my-bookings" className="text-green-600 text-sm font-medium hover:underline flex items-center">
                View trips <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* Recommended Packages */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Recommended For You</h2>
              <p className="text-gray-600 mt-1">
                Packages tailored to your interests
              </p>
            </div>
            <a
              href="/package"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full transition"
            >
              View All Packages
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedPackages.map((pkg, index) => (
              <PackageCard key={index} {...pkg} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}