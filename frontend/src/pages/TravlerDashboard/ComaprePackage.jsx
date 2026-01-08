// pages/ComparePage.jsx
import React from "react";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { X, Check, Star, MapPin, Calendar, Users, DollarSign } from "lucide-react";

const ComparePage = () => {
  // In real app, get packages from localStorage or context
  const packagesToCompare = [
    {
      id: 1,
      title: "Everest Base Camp Trek",
      price: "120,000",
      rating: 4.9,
      reviews: 128,
      duration: 14,
      difficulty: "Challenging",
      destination: "Everest Region",
      category: "Trekking",
      inclusions: ["Accommodation", "Meals", "Guide", "Permits", "Airport Transfer"],
      exclusions: ["Airfare", "Travel Insurance", "Personal Expenses"],
      agency: "Himalayan Adventures",
      verified: true,
      image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400"
    },
    {
      id: 2,
      title: "Annapurna Circuit Trek",
      price: "85,000",
      rating: 4.8,
      reviews: 94,
      duration: 12,
      difficulty: "Moderate",
      destination: "Annapurna Region",
      category: "Trekking",
      inclusions: ["Accommodation", "Meals", "Guide", "Permits"],
      exclusions: ["Airfare", "Travel Insurance", "Personal Expenses", "Airport Transfer"],
      agency: "Nepal Trekking Experts",
      verified: true,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400"
    }
  ];

  const comparisonFields = [
    { key: "price", label: "Price", icon: DollarSign },
    { key: "duration", label: "Duration", icon: Calendar },
    { key: "rating", label: "Rating", icon: Star },
    { key: "reviews", label: "Reviews", icon: Users },
    { key: "difficulty", label: "Difficulty" },
    { key: "destination", label: "Destination", icon: MapPin },
    { key: "category", label: "Category" },
    { key: "agency", label: "Agency" },
    { key: "verified", label: "Verified Agency" },
    { key: "inclusions", label: "What's Included" },
    { key: "exclusions", label: "Not Included" }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Compare Packages
              </h1>
              <p className="text-gray-600">
                Side-by-side comparison to help you choose the best package
              </p>
            </div>
            <a
              href="/package"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Packages
            </a>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
          {/* Package Headers */}
          <div className="grid grid-cols-3 border-b">
            <div className="p-6 border-r bg-gray-50">
              <h3 className="font-bold text-gray-700 mb-4">Features</h3>
            </div>
            {packagesToCompare.map((pkg, index) => (
              <div key={pkg.id} className="p-6 relative border-r">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg text-gray-800 mb-2">{pkg.title}</h3>
                <div className="flex items-center mb-4">
                  <Star className="fill-yellow-400 text-yellow-400 mr-1" size={16} />
                  <span className="font-bold">{pkg.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({pkg.reviews} reviews)</span>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium">
                  Book Now
                </button>
              </div>
            ))}
            {/* Empty column for 3rd package */}
            <div className="p-6 text-center">
              <div className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-400">Add 3rd package</span>
              </div>
              <a
                href="/package"
                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 px-6 rounded-lg font-medium"
              >
                Add Package
              </a>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisonFields.map((field) => (
            <div key={field.key} className="grid grid-cols-3 border-b hover:bg-gray-50">
              <div className="p-4 border-r flex items-center">
                <div className="flex items-center">
                  {field.icon && <field.icon className="text-gray-500 mr-2" size={18} />}
                  <span className="font-medium text-gray-700">{field.label}</span>
                </div>
              </div>

              {packagesToCompare.map((pkg) => (
                <div key={`${pkg.id}-${field.key}`} className="p-4 border-r">
                  {field.key === "inclusions" || field.key === "exclusions" ? (
                    <ul className="space-y-1">
                      {pkg[field.key].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          {field.key === "inclusions" ? (
                            <Check className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                          ) : (
                            <X className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                          )}
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : field.key === "verified" ? (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${pkg[field.key] ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                      {pkg[field.key] ? "✓ Verified" : "Not Verified"}
                    </div>
                  ) : field.key === "price" ? (
                    <div className="font-bold text-lg text-blue-700">NPR {pkg[field.key]}</div>
                  ) : (
                    <div className="text-gray-800">{pkg[field.key]}</div>
                  )}
                </div>
              ))}

              {/* Empty column */}
              <div className="p-4 text-gray-400">-</div>
            </div>
          ))}

          {/* Final Decision Row */}
          <div className="grid grid-cols-3">
            <div className="p-4 border-r font-medium text-gray-700">
              Your Choice
            </div>
            {packagesToCompare.map((pkg) => (
              <div key={`choice-${pkg.id}`} className="p-4 border-r">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold">
                  Select This Package
                </button>
              </div>
            ))}
            <div className="p-4"></div>
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Comparison Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Price vs Value</h4>
              <p className="text-sm text-gray-600">
                Compare what's included in the price. A higher price might include more services.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Check Reviews</h4>
              <p className="text-sm text-gray-600">
                Look at recent reviews and photos from actual travelers.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Cancellation Policy</h4>
              <p className="text-sm text-gray-600">
                Consider flexibility in case your plans change.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Agency Reputation</h4>
              <p className="text-sm text-gray-600">
                Verified agencies with experience are more reliable.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePage;                                                                        