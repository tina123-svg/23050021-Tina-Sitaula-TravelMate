// PackageDetailPage.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ImageGallery from "./ImageGallery";
import BookingWidget from "./BookingWidget";
import ItineraryAccordion from "./ItineraryAccordion";
import AgencyCard from "./AgencyCard";
import ReviewsSection from "./ReviewsSection";
import RelatedPackages from "./RelatedPackages";
import { packageDetailService } from "../../services/packageDetailsService";
import {
  Share2, Heart, MapPin, Calendar, Users, Star,
  ChevronLeft, Download, Printer, Globe, Loader
} from "lucide-react";

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [travelerCount, setTravelerCount] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch package details
  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await packageDetailService.getPackageDetails(id);

      if (response.success) {
        setPackageDetail(response.data);

        // Set default selected date (create some if not exists)
        if (!response.data.availableDates || response.data.availableDates.length === 0) {
          // Create mock dates if backend doesn't provide them
          const mockDates = generateMockDates();
          setSelectedDate(mockDates[0].date);
        } else {
          setSelectedDate(response.data.availableDates[0].date);
        }

        // Set traveler count to minimum
        setTravelerCount(response.data.groupSize?.min || 2);

        // Set related packages if available in response
        if (response.relatedPackages) {
          setRelatedPackages(response.relatedPackages);
        }
      } else {
        setError(response.message || "Failed to load package details");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error");
      console.error("Package details error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate mock dates if backend doesn't provide
  const generateMockDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + (i * 10));

      dates.push({
        date: date.toISOString().split('T')[0],
        status: "available",
        seats: Math.floor(Math.random() * 10) + 3
      });
    }

    return dates;
  };

  const calculateTotalPrice = () => {
    if (!packageDetail) return "0";

    const basePrice = packageDetail.price; // Already a number from backend
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
    if (!packageDetail) return;

    navigate(`/booking/${id}`, {
      state: {
        package: packageDetail,
        selectedDate,
        travelerCount,
        totalPrice: calculateTotalPrice()
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageDetail?.title || "Package",
        text: `Check out ${packageDetail?.title} on TravelMate`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !packageDetail) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-600 mb-4">Error: {error || "Package not found"}</div>
            <button
              onClick={fetchPackageDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/packages")}
              className="ml-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-lg"
            >
              Browse Packages
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Create tagline from description if not provided
  const tagline = packageDetail.tagline ||
    (packageDetail.description?.length > 100
      ? packageDetail.description.substring(0, 100) + "..."
      : packageDetail.description);

  // Use detailedDescription or overview or description
  const detailedDescription = packageDetail.detailedDescription ||
    packageDetail.overview ||
    packageDetail.description;

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
          <ImageGallery images={packageDetail.images || []} />

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
                    {packageDetail.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ⭐ {packageDetail.rating || 5} ({packageDetail.reviews || 0} reviews)
                  </span>
                  {packageDetail.discount && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                      {packageDetail.discount}% OFF
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {packageDetail.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {tagline}
                </p>

                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" />
                    <span>{packageDetail.destination}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    <span>{packageDetail.duration} days</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={18} className="mr-2" />
                    <span>Max {packageDetail.groupSize?.max || 12} travelers</span>
                  </div>
                  <div className="flex items-center">
                    <Globe size={18} className="mr-2" />
                    <span>Altitude: {packageDetail.altitude || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
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

              {/* Tab Content */}
              <div className="mb-12">
                {activeTab === "overview" && (
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold mb-4">About This Adventure</h2>
                    <p className="text-gray-700 mb-6 text-lg">
                      {detailedDescription}
                    </p>

                    {/* Important Information Card */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                      <h3 className="text-xl font-bold mb-3">📋 Important Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Best Time to Go</h4>
                          <ul className="list-disc pl-5">
                            {Array.isArray(packageDetail.bestTimeToGo) && packageDetail.bestTimeToGo.length > 0 ? (
                              packageDetail.bestTimeToGo.map((season, idx) => (
                                <li key={idx}>{season}</li>
                              ))
                            ) : (
                              <li>Year-round</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Difficulty Level</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-orange-500 h-2.5 rounded-full"
                                style={{
                                  width: packageDetail.difficulty === "easy" ? "30%" :
                                    packageDetail.difficulty === "moderate" ? "60%" :
                                      packageDetail.difficulty === "challenging" ? "85%" : "95%"
                                }}
                              ></div>
                            </div>
                            <span className="ml-3 font-medium capitalize">{packageDetail.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <ItineraryAccordion itinerary={packageDetail.itinerary || []} />
                )}

                {activeTab === "reviews" && (
                  <ReviewsSection
                    rating={packageDetail.rating || 5}
                    reviewCount={packageDetail.reviews || 0}
                    packageId={id}
                  />
                )}
              </div>

              {/* Agency Information - Create mock if not provided */}
              {packageDetail.agencyDetails ? (
                <AgencyCard agency={packageDetail.agencyDetails} />
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Agency Information</h3>
                  <p className="text-gray-600">Provided by our verified travel partner.</p>
                </div>
              )}
            </div>

            {/* Right Column - Booking Widget Only (30%) */}
            <div className="lg:w-5/12">
              <div className="lg:sticky lg:top-24">
                <BookingWidget
                  package={{
                    ...packageDetail,
                    price: packageDetail.price.toLocaleString(), // Format for display
                    maxTravelers: packageDetail.groupSize?.max || 12,
                    minTravelers: packageDetail.groupSize?.min || 2,
                    availableDates: packageDetail.availableDates || generateMockDates()
                  }}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  travelerCount={travelerCount}
                  setTravelerCount={setTravelerCount}
                  onBookNow={handleBookNow}
                />

                {/* Safety & Support */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-6 mt-6">
                  <h3 className="font-bold text-green-800 mb-3">✅ Book with Confidence</h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Best Price Guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Free Cancellation (30 days)</span>
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
          currentPackageId={id}
          relatedPackages={relatedPackages}
        />
      </main>

      <Footer />
    </div>
  );
};

export default PackageDetailPage;