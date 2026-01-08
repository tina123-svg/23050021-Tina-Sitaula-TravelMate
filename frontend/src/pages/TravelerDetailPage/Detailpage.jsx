import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ImageGallery from "./ImageGallery";
import BookingWidget from "./BookingWidget";
import ItineraryAccordion from "./ItineraryAccordion";
 import AgencyCard from "./AgencyCard";
import ReviewsSection from "./ReviewsSection";
 import RelatedPackages from "./RelatedPackages";
import {
  Share2, Heart, MapPin, Calendar, Users, Star,
  ChevronLeft, Download, Printer, Globe
} from "lucide-react";

// Simplified dummy data
const packageDetailData = {
  id: 1,
  title: "Everest Base Camp Trek",
  tagline: "Journey to the Roof of the World",
  description: "A legendary trek to the base of the world's highest peak, offering breathtaking Himalayan views, rich Sherpa culture, and a life-changing adventure through the heart of the Everest region.",
  detailedDescription: "The Everest Base Camp Trek is one of the most iconic treks in the world. This 14-day adventure takes you through picturesque Sherpa villages, ancient monasteries, and stunning landscapes. You'll witness majestic peaks including Everest, Lhotse, Nuptse, and Ama Dablam. The trek culminates at Everest Base Camp (5,364m) and the viewpoint of Kala Patthar (5,545m) for sunrise over Everest.",

  price: "120,000",
  originalPrice: "135,000",
  discount: 11,
  rating: 4.9,
  reviews: 128,
  duration: 14,
  nights: 13,
  difficulty: "Challenging",
  category: "Trekking",
  destination: "Everest Region, Nepal",
  altitude: "5,364m (Base Camp), 5,545m (Kala Patthar)",
  bestSeason: ["Spring (Mar-May)", "Autumn (Sep-Nov)"],

  images: [
    "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=1200",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
  ],

  itinerary: [
    {
      day: 1,
      title: "Arrival in Kathmandu (1,400m)",
      description: "Welcome to Nepal! Our representative will meet you at Tribhuvan International Airport and transfer you to your hotel. In the evening, we'll have a trek briefing and welcome dinner.",
      accommodation: "3-star Hotel in Kathmandu",
      meals: "Dinner",
      highlight: "Cultural welcome dinner",
      icon: "🏨"
    },
    {
      day: 2,
      title: "Fly to Lukla & Trek to Phakding (2,610m)",
      description: "Morning flight to Lukla (2,860m), one of the world's most thrilling flights. After breakfast in Lukla, start trekking to Phakding alongside the Dudh Koshi River.",
      accommodation: "Teahouse in Phakding",
      meals: "Breakfast, Lunch, Dinner",
      highlight: "Scenic mountain flight",
      icon: "✈️"
    },
    {
      day: 3,
      title: "Trek to Namche Bazaar (3,440m)",
      description: "Cross suspension bridges over the Dudh Koshi River and enter Sagarmatha National Park. Steep climb to Namche Bazaar, the trading hub of the Khumbu region.",
      accommodation: "Teahouse in Namche",
      meals: "Breakfast, Lunch, Dinner",
      highlight: "First view of Everest",
      icon: "🏔️"
    },
  ],

  availableDates: [
    { date: "2024-03-15", status: "available", seats: 8 },
    { date: "2024-03-20", status: "available", seats: 12 },
    { date: "2024-03-25", status: "filling", seats: 3 },
    { date: "2024-04-05", status: "available", seats: 10 },
    { date: "2024-04-10", status: "available", seats: 12 },
    { date: "2024-04-15", status: "available", seats: 6 }
  ],

  maxTravelers: 12,
  minTravelers: 2,

  cancellationPolicy: {
    freeCancellationDays: 30,
    partialRefundDays: 14,
    noRefundDays: 7,
  },

  // Simplified agency data
  agencyDetails: {
    name: "Himalayan Adventures",
    contact: "+977 1-2345678",
    description: "Specialized in Himalayan treks and expeditions. Our experienced guides and commitment to safety have made us one of Nepal's trusted trekking agencies."
  },

  faqs: [
    {
      question: "What is the difficulty level of this trek?",
      answer: "Challenging. Requires good physical fitness and acclimatization."
    },
    {
      question: "What is the accommodation like during the trek?",
      answer: "Clean, basic teahouses with shared bathrooms."
    }
  ],

  tags: ["Everest", "Trekking", "Adventure", "Himalayas"]
};

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(packageDetailData.availableDates[0].date);
  const [travelerCount, setTravelerCount] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const calculateTotalPrice = () => {
    const basePrice = parseInt(packageDetailData.price.replace(/,/g, ''));
    let total = basePrice * travelerCount;

    // Group discount
    if (travelerCount >= 6) {
      total *= 0.9; // 10% discount
    }

    // Add service fee
    total += 1500;

    return total.toLocaleString();
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`, {
      state: {
        package: packageDetailData,
        selectedDate,
        travelerCount,
        totalPrice: calculateTotalPrice()
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageDetailData.title,
        text: `Check out ${packageDetailData.title} on TravelMate`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Back to Packages</span>
        </button>
      </div>

      <main>
        {/* Hero Section with Image Gallery */}
        <section className="relative">
          <ImageGallery images={packageDetailData.images} />

          {/* Share & Favorite Overlay */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-full backdrop-blur-sm ${isFavorite
                  ? "bg-red-500/20 text-red-600"
                  : "bg-white/20 text-white hover:bg-white/30"
                }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full backdrop-blur-sm bg-white/20 text-white hover:bg-white/30"
            >
              <Share2 size={20} />
            </button>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Content (70%) */}
            <div className="lg:w-7/12">
              {/* Package Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {packageDetailData.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ⭐ {packageDetailData.rating} ({packageDetailData.reviews} reviews)
                  </span>
                  {packageDetailData.discount && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                      {packageDetailData.discount}% OFF
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {packageDetailData.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {packageDetailData.tagline}
                </p>

                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    <span>{packageDetailData.destination}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    <span>{packageDetailData.duration} days</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={18} className="mr-2" />
                    <span>Max {packageDetailData.maxTravelers} travelers</span>
                  </div>
                  <div className="flex items-center">
                    <Globe size={18} className="mr-2" />
                    <span>Altitude: {packageDetailData.altitude}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs - Simplified */}
              <div className="border-b mb-8">
                <div className="flex space-x-8">
                  {["overview", "itinerary", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 font-medium text-lg capitalize ${activeTab === tab
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab === "overview" ? "Overview" :
                        tab === "itinerary" ? "Day-by-Day Itinerary" : "Reviews"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content - Simplified */}
              <div className="mb-12">
                {activeTab === "overview" && (
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold mb-4">About This Adventure</h2>
                    <p className="text-gray-700 mb-6 text-lg">
                      {packageDetailData.detailedDescription}
                    </p>

                    {/* Important Information Card */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                      <h3 className="text-xl font-bold mb-3">📋 Important Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Best Time to Go</h4>
                          <ul className="list-disc pl-5">
                            {packageDetailData.bestSeason.map((season, idx) => (
                              <li key={idx}>{season}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Difficulty Level</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-orange-500 h-2.5 rounded-full"
                                style={{ width: "85%" }}
                              ></div>
                            </div>
                            <span className="ml-3 font-medium">{packageDetailData.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FAQs */}
                    {packageDetailData.faqs && packageDetailData.faqs.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">❓ Frequently Asked Questions</h3>
                        <div className="space-y-4">
                          {packageDetailData.faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>
                              <p className="text-gray-600">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <ItineraryAccordion itinerary={packageDetailData.itinerary} />
                )}

                {activeTab === "reviews" && (
                  <ReviewsSection
                    rating={packageDetailData.rating}
                    reviewCount={packageDetailData.reviews}
                  />
                )}
              </div>

              {/* Simplified Agency Information */}
              <AgencyCard agency={packageDetailData.agencyDetails} />
            </div>

            {/* Right Column - Booking Widget Only (30%) */}
            <div className="lg:w-5/12">
              <div className="lg:sticky lg:top-24">
                <BookingWidget
                  package={packageDetailData}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  travelerCount={travelerCount}
                  setTravelerCount={setTravelerCount}
                  calculateTotalPrice={calculateTotalPrice}
                  onBookNow={handleBookNow}
                />

                {/* Safety & Support - Keep this */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-6">
                  <h3 className="font-bold text-green-800 mb-3">✅ Book with Confidence</h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Best Price Guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Free Cancellation ({packageDetailData.cancellationPolicy.freeCancellationDays} days)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>24/7 Customer Support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Verified Agency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Packages */}
        <RelatedPackages
          currentPackageId={packageDetailData.id}
          tags={packageDetailData.tags}
        />
      </main>

      <Footer />
    </div>
  );
};

export default PackageDetailPage;