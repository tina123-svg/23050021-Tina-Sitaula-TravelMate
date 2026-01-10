// pages/BookingConfirmationPage.jsx
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import {
  CheckCircle, Download, Printer, Calendar, Users,
  MapPin, Phone, Mail, ArrowRight, Home
} from "lucide-react";

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {
    bookingId: bookingId || `BK${Date.now()}`,
    package: {
      title: "Everest Base Camp Trek",
      duration: 14,
      destination: "Everest Region"
    },
    bookingDetails: {
      selectedDate: "2024-03-15",
      travelerCount: 2
    },
    travelerInfo: {
      fullName: "John Doe",
      email: "john@example.com"
    },
    total: "241500"
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your booking. Your adventure awaits!
            </p>
            <div className="bg-blue-50 inline-block px-6 py-3 rounded-full">
              <span className="font-mono font-bold text-blue-700">
                Booking ID: {bookingData.bookingId}
              </span>
            </div>
          </div>

          {/* Confirmation Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{bookingData.package.title}</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold">NPR {parseInt(bookingData.total).toLocaleString()}</div>
                  <div className="text-green-100">Paid in Full</div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trip Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Trip Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="text-blue-500 mr-4" size={24} />
                      <div>
                        <div className="text-gray-600">Departure Date</div>
                        <div className="font-medium">{formatDate(bookingData.bookingDetails.selectedDate)}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="text-blue-500 mr-4" size={24} />
                      <div>
                        <div className="text-gray-600">Travelers</div>
                        <div className="font-medium">{bookingData.bookingDetails.travelerCount} person{bookingData.bookingDetails.travelerCount > 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="text-blue-500 mr-4" size={24} />
                      <div>
                        <div className="text-gray-600">Destination</div>
                        <div className="font-medium">{bookingData.package.destination}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traveler Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Traveler Information</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-600">Primary Traveler</div>
                      <div className="font-medium text-lg">{bookingData.travelerInfo.fullName}</div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="text-gray-400 mr-3" size={20} />
                      <span>{bookingData.travelerInfo.email}</span>
                    </div>

                    {bookingData.travelerInfo.phone && (
                      <div className="flex items-center">
                        <Phone className="text-gray-400 mr-3" size={20} />
                        <span>{bookingData.travelerInfo.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📋 What Happens Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📧</span>
                    </div>
                    <h4 className="font-medium mb-2">Confirmation Email</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive a detailed itinerary and invoice within 24 hours.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h4 className="font-medium mb-2">Dedicated Support</h4>
                    <p className="text-sm text-gray-600">
                      Our team will contact you to discuss preparation and details.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📅</span>
                    </div>
                    <h4 className="font-medium mb-2">Pre-Trip Briefing</h4>
                    <p className="text-sm text-gray-600">
                      Join our online briefing 2 weeks before departure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Printer size={20} className="mr-2" />
              Print Confirmation
            </button>

            <button
              onClick={() => window.location.href = "#"} // Would generate PDF
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={20} className="mr-2" />
              Download as PDF
            </button>

            <button
              onClick={() => navigate("/my-bookings")}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View My Bookings
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>

          {/* Continue Browsing */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Want to explore more adventures?</p>
            <button
              onClick={() => navigate("/packages")}
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
            >
              <Home size={20} className="mr-2" />
              Browse More Packages
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;