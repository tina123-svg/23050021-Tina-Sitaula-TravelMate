// pages/BookingPage.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import {
  Check, ArrowLeft, User, Mail, Phone, CreditCard,
  Calendar, Users, Shield, ChevronRight
} from "lucide-react";

const BookingPage = () => {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get package data from navigation state or fetch
  const packageData = location.state?.package || {
    id: packageId,
    title: "Everest Base Camp Trek",
    price: "120,000",
    duration: 14,
    destination: "Everest Region"
  };

  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    selectedDate: location.state?.selectedDate || "2024-03-15",
    travelerCount: location.state?.travelerCount || 2,
    extras: {
      porter: false,
      insurance: true,
      singleRoom: false
    }
  });

  const [travelerInfo, setTravelerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "Nepali",
    emergencyContact: "",
    specialRequests: ""
  });

  const [payment, setPayment] = useState({
    method: "esewa",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const price = parseInt(packageData.price.replace(/,/g, ''));
  const baseTotal = price * bookingDetails.travelerCount;
  const extrasTotal = calculateExtrasTotal();
  const serviceFee = 1500;
  const total = baseTotal + extrasTotal + serviceFee;

  function calculateExtrasTotal() {
    let total = 0;
    if (bookingDetails.extras.porter) total += 2500 * bookingDetails.travelerCount;
    if (bookingDetails.extras.insurance) total += 2000 * bookingDetails.travelerCount;
    if (bookingDetails.extras.singleRoom) total += 5000 * packageData.duration;
    return total;
  }

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
    else completeBooking();
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const completeBooking = () => {
    // In real app, send booking to backend
    console.log("Booking completed:", {
      package: packageData,
      bookingDetails,
      travelerInfo,
      payment,
      total
    });

    // Navigate to confirmation
    navigate(`/booking-confirmation/${Date.now()}`, {
      state: {
        bookingId: `BK${Date.now()}`,
        package: packageData,
        bookingDetails,
        travelerInfo,
        total
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handlePrevStep}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          {step === 1 ? "Back to Package" : "Previous Step"}
        </button>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stepNumber === step
                    ? "bg-blue-600 text-white"
                    : stepNumber < step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                  {stepNumber < step ? <Check size={24} /> : stepNumber}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {stepNumber === 1 ? "Booking Details" :
                    stepNumber === 2 ? "Your Information" :
                      "Payment"}
                </span>
              </div>
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Package Summary Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{packageData.title}</h1>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {packageData.duration} days
                    </span>
                    <span className="flex items-center">
                      <Users size={16} className="mr-2" />
                      {bookingDetails.travelerCount} traveler{bookingDetails.travelerCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-bold">NPR {total.toLocaleString()}</div>
                  <div className="text-blue-100">Total Amount</div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 md:p-8">
              {/* Step 1: Booking Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>

                  <div className="space-y-6">
                    {/* Selected Date */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-700">Selected Date</div>
                          <div className="text-lg">{formatDate(bookingDetails.selectedDate)}</div>
                        </div>
                        <button
                          onClick={() => setStep(1)} // Would open date picker
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {/* Traveler Count */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-medium text-gray-700">Travelers</div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setBookingDetails(prev => ({
                              ...prev,
                              travelerCount: Math.max(1, prev.travelerCount - 1)
                            }))}
                            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-xl font-bold">{bookingDetails.travelerCount}</span>
                          <button
                            onClick={() => setBookingDetails(prev => ({
                              ...prev,
                              travelerCount: prev.travelerCount + 1
                            }))}
                            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Optional Extras */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Optional Extras</h3>
                      <div className="space-y-3">
                        {[
                          { id: 'porter', label: 'Porter Service', price: 'NPR 2,500 per traveler', desc: 'Carry up to 15kg of your luggage' },
                          { id: 'insurance', label: 'Travel Insurance', price: 'NPR 2,000 per traveler', desc: 'Medical and evacuation coverage' },
                          { id: 'singleRoom', label: 'Single Room Supplement', price: 'NPR 5,000 per night', desc: 'Private room throughout the trek' }
                        ].map(extra => (
                          <label key={extra.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bookingDetails.extras[extra.id]}
                              onChange={(e) => setBookingDetails(prev => ({
                                ...prev,
                                extras: { ...prev.extras, [extra.id]: e.target.checked }
                              }))}
                              className="mt-1 h-5 w-5 text-blue-600 rounded"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-800">{extra.label}</span>
                                <span className="text-gray-600">{extra.price}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{extra.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Traveler Information */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={travelerInfo.fullName}
                          onChange={(e) => setTravelerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={travelerInfo.email}
                          onChange={(e) => setTravelerInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          value={travelerInfo.phone}
                          onChange={(e) => setTravelerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="+977 98XXXXXXX"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Nationality</label>
                        <select
                          value={travelerInfo.nationality}
                          onChange={(e) => setTravelerInfo(prev => ({ ...prev, nationality: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                          <option value="Nepali">Nepali</option>
                          <option value="Indian">Indian</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Emergency Contact</label>
                      <input
                        type="tel"
                        value={travelerInfo.emergencyContact}
                        onChange={(e) => setTravelerInfo(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Alternative phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Special Requests</label>
                      <textarea
                        value={travelerInfo.specialRequests}
                        onChange={(e) => setTravelerInfo(prev => ({ ...prev, specialRequests: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                        placeholder="Dietary requirements, allergies, or other special needs..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Select Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'esewa', label: 'eSewa', icon: '💰' },
                          { id: 'khalti', label: 'Khalti', icon: '💳' },
                          { id: 'bank', label: 'Bank Transfer', icon: '🏦' }
                        ].map(method => (
                          <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={payment.method === method.id}
                              onChange={(e) => setPayment(prev => ({ ...prev, method: e.target.value }))}
                              className="h-5 w-5 text-blue-600"
                            />
                            <div className="ml-3">
                              <span className="text-2xl mr-2">{method.icon}</span>
                              <span className="font-medium">{method.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Mock Payment Form (for demo) */}
                    {payment.method === 'bank' && (
                      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-gray-800 mb-4">Bank Transfer Details</h3>
                        <div className="space-y-3 text-gray-600">
                          <p><strong>Bank:</strong> NMB Bank Limited</p>
                          <p><strong>Account Name:</strong> Travel Mate Pvt. Ltd.</p>
                          <p><strong>Account Number:</strong> 1234567890123456</p>
                          <p><strong>Branch:</strong> Kathmandu Branch</p>
                          <p className="text-sm mt-4">Please use your booking ID as reference when transferring.</p>
                        </div>
                      </div>
                    )}

                    {/* Terms & Conditions */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 text-blue-600 rounded"
                          required
                        />
                        <span className="ml-3 text-gray-700">
                          I agree to the Terms & Conditions and Cancellation Policy. I understand that a deposit of 30% is required to confirm this booking.
                        </span>
                      </label>
                    </div>

                    {/* Security Assurance */}
                    <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg">
                      <Shield size={20} className="mr-3" />
                      <span>Your payment is secured with SSL encryption</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary (Fixed at bottom) */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">NPR {total.toLocaleString()}</div>
                    <div className="text-gray-600">Total Amount</div>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg flex items-center"
                  >
                    {step === 3 ? "Complete Booking" : "Continue"}
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;