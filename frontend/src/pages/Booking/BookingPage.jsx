// pages/BookingPage.jsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import {
  Check, ArrowLeft,
  Calendar, Users, ChevronRight, AlertTriangle, X
} from "lucide-react";
import travelerBookingService from '../../services/travelerBookingService';


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
  const [errors, setErrors] = useState({});
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

  const price = typeof packageData.price === 'string'
    ? parseInt(packageData.price.replace(/,/g, ''))
    : packageData.price; const baseTotal = price * bookingDetails.travelerCount;
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



  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };



  const completeBooking = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', {
          state: {
            from: '/booking',
            message: 'Please login to complete booking'
          }
        });
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      const bookingData = {
        packageId: packageData.id,
        startDate: bookingDetails.selectedDate,
        travelers: bookingDetails.travelerCount,
        travelerInfo: {
          fullName: travelerInfo.fullName || currentUser?.name || '',
          email: travelerInfo.email || currentUser?.email || '',
          phone: travelerInfo.phone || currentUser?.phone || '',
          emergencyContact: travelerInfo.emergencyContact || '',
          specialRequests: travelerInfo.specialRequests || ''
        },
        paymentMethod: payment.method === 'esewa' ? 'online' : 'bank_transfer',
        totalAmount: total // ADD THIS LINE - Send the total amount
      };

      console.log("Sending booking data:", bookingData);

      const response = await travelerBookingService.createBooking(bookingData);

      if (response.success) {
        // ✅ FIX: Navigate to confirmation page for PAYMENT
        navigate(`/booking-confirmation/${response.data._id}`, {
          state: {
            bookingId: response.data.bookingId,
            package: packageData,
            bookingDetails,
            travelerInfo,
            total,
            booking: response.data
          }
        });
      }
    } catch (error) {
      console.error('Booking error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', {
          state: {
            from: '/booking',
            message: 'Session expired. Please login again.'
          }
        });
        return;
      }

      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };



  // Validation helper function
  const validateStepDetails = (stepNumber) => {
    const missingItems = [];
    let isValid = false;

    if (stepNumber === 1) {
      if (!bookingDetails.selectedDate) missingItems.push("Select a date");
      if (!bookingDetails.travelerCount) missingItems.push("Select number of travelers");
      if (bookingDetails.travelerCount < (packageData.minTravelers || 1))
        missingItems.push(`Minimum ${packageData.minTravelers || 1} travelers required`);
      if (bookingDetails.travelerCount > (packageData.maxTravelers || 10))
        missingItems.push(`Maximum ${packageData.maxTravelers || 10} travelers allowed`);

      isValid = bookingDetails.selectedDate &&
        bookingDetails.travelerCount >= (packageData.minTravelers || 1) &&
        bookingDetails.travelerCount <= (packageData.maxTravelers || 10);
    }

    if (stepNumber === 2) {
      if (!travelerInfo.fullName?.trim()) missingItems.push("Full name");
      if (!travelerInfo.email?.trim()) {
        missingItems.push("Email address");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(travelerInfo.email)) {
        missingItems.push("Valid email address");
      }
      if (!travelerInfo.phone?.trim()) {
        missingItems.push("Phone number");
      } else if (!/^[0-9+\-\s()]{10,15}$/.test(travelerInfo.phone.replace(/\s/g, ''))) {
        missingItems.push("Valid phone number (10-15 digits)");
      }
      if (!travelerInfo.emergencyContact?.trim()) missingItems.push("Emergency contact");

      isValid = travelerInfo.fullName?.trim() &&
        travelerInfo.email?.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(travelerInfo.email) &&
        travelerInfo.phone?.trim() &&
        /^[0-9+\-\s()]{10,15}$/.test(travelerInfo.phone.replace(/\s/g, '')) &&
        travelerInfo.emergencyContact?.trim();
    }

    if (stepNumber === 3) {
      if (!payment.method) missingItems.push("Select payment method");
      isValid = !!payment.method;
    }

    return {
      isValid,
      missingItems,
      missingCount: missingItems.length
    };
  };

  const handleNextStep = () => {
    const validation = validateStepDetails(step);

    if (!validation.isValid) {
      // Show error message
      setErrors({
        general: `Please complete ${validation.missingCount} item(s) before continuing`
      });

      // Scroll to top to see validation summary
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Clear ALL errors when validation passes
    setErrors({});

    if (step < 3) {
      setStep(step + 1);
    } else {
      completeBooking();
    }
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

        {/* Progress Steps with Validation */}
        {/* Progress Steps with Detailed Validation */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => {
              // Get validation details for each step
              const validation = validateStepDetails(stepNumber);

              return (
                <div key={stepNumber} className="flex flex-col items-center relative">
                  {/* Step Circle with Status */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${stepNumber === step
                    ? "bg-blue-600 text-white border-2 border-blue-600"
                    : stepNumber < step
                      ? validation.isValid
                        ? "bg-green-500 text-white border-2 border-green-500"
                        : "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                      : "bg-gray-200 text-gray-500 border-2 border-gray-300"
                    }`}>
                    {stepNumber < step ? (
                      validation.isValid ? <Check size={24} /> : <AlertTriangle size={20} />
                    ) : (
                      stepNumber
                    )}

                    {/* Status indicator */}
                    {stepNumber < step && (
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${validation.isValid ? "bg-green-500" : "bg-yellow-500"
                        }`}>
                        {validation.isValid ? (
                          <Check size={12} className="text-white" />
                        ) : (
                          <span className="text-white text-xs">!</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step Label */}
                  <span className="mt-2 text-sm font-medium">
                    {stepNumber === 1 ? "Booking Details" :
                      stepNumber === 2 ? "Your Information" :
                        "Payment"}
                  </span>

                  {/* Validation Status */}
                  <div className="absolute top-14 w-48 text-center">
                    {stepNumber <= step && (
                      <div className={`text-xs px-2 py-1 rounded-lg ${validation.isValid
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}>
                        {validation.isValid ? (
                          <span className="flex items-center justify-center">
                            <Check size={10} className="mr-1" /> Complete
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <AlertTriangle size={10} className="mr-1" /> {validation.missingCount} missing
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Validation Details Tooltip (on hover) */}
                  {stepNumber <= step && !validation.isValid && validation.missingItems.length > 0 && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="p-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">Missing information:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {validation.missingItems.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <X size={10} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Validation Summary (Visible Always) */}
          <div className="mb-6">
            {(() => {
              const validation = validateStepDetails(step);
              if (!validation.isValid && validation.missingItems.length > 0) {
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="text-yellow-600 mr-2" size={18} />
                      <h3 className="font-medium text-yellow-800">
                        Please complete the following to continue:
                      </h3>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validation.missingItems.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })()}
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
                  <div className="text-3xl font-bold">
                    NPR {typeof total === 'number' ? total.toLocaleString() : total}
                  </div>
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


              {step === 2 && (

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name *
                      {errors.fullName && (
                        <span className="text-red-500 text-sm ml-2">({errors.fullName})</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={travelerInfo.fullName}
                      onChange={(e) => {
                        setTravelerInfo(prev => ({ ...prev, fullName: e.target.value }));
                        if (e.target.value.trim()) {
                          setErrors(prev => ({ ...prev, fullName: '' }));
                        }
                      }}
                      className={`w-full p-3 border rounded-lg ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {!travelerInfo.fullName?.trim() && (
                      <p className="text-red-500 text-xs mt-1">Please enter your full name</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Email Address *
                      {errors.email && (
                        <span className="text-red-500 text-sm ml-2">({errors.email})</span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={travelerInfo.email}
                      onChange={(e) => {
                        setTravelerInfo(prev => ({ ...prev, email: e.target.value }));
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(e.target.value)) {
                          setErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="john@example.com"
                      required
                    />
                    {!travelerInfo.email?.trim() ? (
                      <p className="text-red-500 text-xs mt-1">Please enter your email address</p>
                    ) : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(travelerInfo.email) ? (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid email (e.g., name@example.com)</p>
                    ) : null}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone Number *
                      {errors.phone && (
                        <span className="text-red-500 text-sm ml-2">({errors.phone})</span>
                      )}
                    </label>
                    <input
                      type="tel"
                      value={travelerInfo.phone}
                      onChange={(e) => {
                        setTravelerInfo(prev => ({ ...prev, phone: e.target.value }));
                        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
                        if (phoneRegex.test(e.target.value.replace(/\s/g, ''))) {
                          setErrors(prev => ({ ...prev, phone: '' }));
                        }
                      }}
                      className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="+977 98XXXXXXX"
                      required
                    />
                    {!travelerInfo.phone?.trim() ? (
                      <p className="text-red-500 text-xs mt-1">Please enter your phone number</p>
                    ) : !/^[0-9+\-\s()]{10,15}$/.test(travelerInfo.phone.replace(/\s/g, '')) ? (
                      <p className="text-red-500 text-xs mt-1">Enter 10-15 digit phone number (e.g., +977 9812345678)</p>
                    ) : null}
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Emergency Contact *
                      <span className="text-xs text-gray-500 ml-2">(For safety during trip)</span>
                      {errors.emergencyContact && (
                        <span className="text-red-500 text-sm ml-2">({errors.emergencyContact})</span>
                      )}
                    </label>
                    <input
                      type="tel"
                      value={travelerInfo.emergencyContact}
                      onChange={(e) => {
                        setTravelerInfo(prev => ({ ...prev, emergencyContact: e.target.value }));
                        if (e.target.value.trim()) {
                          setErrors(prev => ({ ...prev, emergencyContact: '' }));
                        }
                      }}
                      className={`w-full p-3 border rounded-lg ${errors.emergencyContact ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      placeholder="Alternative phone number"
                      required
                    />
                    {!travelerInfo.emergencyContact?.trim() && (
                      <p className="text-red-500 text-xs mt-1">Emergency contact is required for your safety</p>
                    )}
                  </div>
                </div>
              )}


              {/* // Step 3: Payment (Simplified - only eSewa for now) */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment</h2>

                  <div className="space-y-6">
                    {/* eSewa Payment Box */}
                    <div className="p-6 border-2 border-green-500 rounded-lg bg-green-50">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-2xl">💰</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-green-700">Pay with eSewa</h3>
                          <p className="text-green-600">Secure online payment</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">{packageData.title}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-lg">NPR {total.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          You'll be redirected to eSewa to complete payment
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p className="mb-2">✅ Instant confirmation</p>
                        <p className="mb-2">✅ Secure SSL encryption</p>
                        <p>✅ Money-back guarantee</p>
                      </div>
                    </div>

                    {/* Bank Transfer Option (for testing) */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={payment.method === 'bank'}
                          onChange={(e) => setPayment(prev => ({ ...prev, method: e.target.value }))}
                          className="h-5 w-5 text-blue-600 mr-3"
                        />
                        <div>
                          <span className="font-medium">Bank Transfer (For Testing)</span>
                          <p className="text-sm text-gray-500 mt-1">
                            You can mark payment as complete later
                          </p>
                        </div>
                      </label>

                      {payment.method === 'bank' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 text-sm">
                            After transferring to our bank account, contact us with your transaction ID.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Terms & Conditions */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          className="mt-1 h-5 w-5 text-blue-600 rounded"
                        />
                        <span className="ml-3 text-gray-700">
                          I agree to the Terms & Conditions and Cancellation Policy.
                        </span>
                      </label>
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
                    className={`text-white font-bold px-8 py-3 rounded-lg flex items-center ${validateStepDetails(step).isValid
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                      }`}
                    disabled={!validateStepDetails(step).isValid}
                  >
                    {step === 3 ? "Proceed to Payment" : "Continue"}
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