import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import {
  CheckCircle, XCircle, Clock, ArrowLeft,
  CreditCard, Shield, RefreshCw, ExternalLink,
  Calendar, Users, Package as PackageIcon
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [packageData, setPackageData] = useState(location.state?.package || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!booking) {
      fetchBookingDetails();
    } else {
      checkPaymentStatus();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getBookingDetails(bookingId);
      console.log('API Response:', response);

      if (response.success) {
        const bookingData = response.data;
        setBooking(bookingData);
        setPackageData(bookingData.packageId);
        setPaymentStatus(bookingData.paymentStatus || 'pending');
      }
    } catch (err) {
      setError('Failed to load booking details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await paymentService.checkPaymentStatus(bookingId);
      if (response.success) {
        setPaymentStatus(response.data.paymentStatus);
      }
    } catch (err) {
      console.error('Failed to check payment status:', err);
    }
  };

  const initiateEsewaPayment = async () => {
    try {
      setPaymentLoading(true);
      setError(null);

      const response = await paymentService.initiateEsewaPayment(bookingId);

      if (response.success) {
        submitToEsewa(response.data.paymentUrl, response.data.formData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      console.error('Payment initiation error:', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (paymentStatus === 'pending') {
      interval = setInterval(checkPaymentStatus, 5000);
    }
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const submitToEsewa = (paymentUrl, formData) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;
    form.style.display = 'none';

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value ?? '';
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/packages')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Browse Packages
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="text-green-500" size={20} />;
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'failed': return <XCircle className="text-red-500" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/my-bookings')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to My Bookings
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {paymentStatus === 'paid' ? 'Booking Confirmed!' : 'Complete Your Payment'}
            </h1>
            <p className="text-gray-600">
              {paymentStatus === 'paid'
                ? 'Your booking is confirmed. Welcome aboard!'
                : 'Secure payment with eSewa to confirm your booking'}
            </p>
            <div className="mt-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(paymentStatus)}`}>
                {getStatusIcon(paymentStatus)}
                <span className="ml-2">
                  {paymentStatus === 'paid' ? 'Payment Completed' :
                    paymentStatus === 'pending' ? 'Payment Pending' :
                      paymentStatus === 'failed' ? 'Payment Failed' : paymentStatus}
                </span>
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="text-red-500 mr-3" size={20} />
                <div>
                  <p className="text-red-700 font-medium">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 text-sm mt-1 hover:text-red-800"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>

                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <PackageIcon className="text-blue-500 mr-3" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">{packageData?.title || 'Package'}</div>
                      <div className="text-sm text-gray-500">Package</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-green-500 mr-3" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">{formatDate(booking.startDate)}</div>
                      <div className="text-sm text-gray-500">Start Date</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="text-purple-500 mr-3" size={20} />
                    <div>
                      <div className="font-medium text-gray-800">{booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</div>
                      <div className="text-sm text-gray-500">Travelers</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{booking.bookingId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Booked on:</span>
                    <span className="font-medium">{formatDate(booking.createdAt)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{booking.status}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              {paymentStatus === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Secure Payment Instructions
                  </h3>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">1.</span>
                      <span>Click "Pay with eSewa" button below</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">2.</span>
                      <span>You'll be redirected to eSewa secure payment page</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">3.</span>
                      <span>Login to your eSewa account and complete payment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">4.</span>
                      <span>You'll be automatically redirected back here after payment</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Payment */}
            <div className="space-y-6">
              {/* Payment Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Price</span>
                    <span>NPR {booking.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>NPR 0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (13%)</span>
                    <span>NPR {(booking.totalAmount * 0.13).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-green-600">NPR {booking.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                {paymentStatus === 'pending' ? (
                  <div>
                    <button
                      onClick={initiateEsewaPayment}
                      disabled={paymentLoading}
                      className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${paymentLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        } text-white`}
                    >
                      {paymentLoading ? (
                        <>
                          <RefreshCw className="animate-spin mr-2" size={20} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2" size={20} />
                          Pay with eSewa
                          <ExternalLink className="ml-2" size={16} />
                        </>
                      )}
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        onClick={checkPaymentStatus}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Refresh Payment Status
                      </button>
                    </div>
                  </div>
                ) : paymentStatus === 'paid' ? (
                  <div className="text-center">
                    <div className="p-4 bg-green-50 rounded-lg mb-4">
                      <CheckCircle className="text-green-500 mx-auto mb-2" size={40} />
                      <p className="text-green-700 font-medium">Payment Successful!</p>
                      <p className="text-green-600 text-sm">Your booking is now confirmed</p>
                    </div>
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                    >
                      View My Bookings
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="p-4 bg-red-50 rounded-lg mb-4">
                      <XCircle className="text-red-500 mx-auto mb-2" size={40} />
                      <p className="text-red-700 font-medium">Payment Failed</p>
                      <p className="text-red-600 text-sm">Please try again or contact support</p>
                    </div>
                    <button
                      onClick={initiateEsewaPayment}
                      className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start">
                  <Shield className="text-gray-500 mr-3 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-700">
                      Your payment is secured with SSL encryption. We never store your eSewa credentials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  Need help with payment? Contact our support at{' '}
                  <a href="tel:+9779800000000" className="font-medium hover:text-yellow-900">
                    +977 9800000000
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;