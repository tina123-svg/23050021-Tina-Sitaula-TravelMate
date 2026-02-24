import React, { useState } from "react";
import { Calendar, Users, Shield, CreditCard } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingWidget = ({
  package: pkg,
  selectedDate,
  setSelectedDate,
  travelerCount,
  setTravelerCount,
  onBookNow
}) => {
  const [showTravelerPicker, setShowTravelerPicker] = useState(false);

  // Get today's date (can't select past dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const price = typeof pkg.price === 'string'
    ? parseInt(pkg.price.replace(/,/g, ''))
    : pkg.price;
  const baseTotal = price * travelerCount;
  const discount = travelerCount >= 6 ? baseTotal * 0.1 : 0;
  const serviceFee = 1500;
  const total = baseTotal - discount + serviceFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Price Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="text-2xl font-bold">NPR {pkg.price}</div>
        <div className="text-blue-100 text-sm">per person</div>
      </div>

      {/* Booking Form */}
      <div className="p-6">
        {/* Date Selection - Simple Calendar */}
        <div className="mb-6">
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <Calendar size={18} className="mr-2" />
            Select Start Date
          </label>

          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            minDate={today}
            inline
            className="w-full"
          />

          <p className="text-sm text-gray-500 mt-2">
            {selectedDate ? (
              <>You'll start on <span className="font-medium">
                {new Date(selectedDate).toLocaleDateString()}
              </span></>
            ) : (
              "Please select your start date"
            )}
          </p>
        </div>

        {/* Traveler Selection */}
        <div className="mb-6">
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <Users size={18} className="mr-2" />
            Travelers
          </label>

          <div className="relative">
            <button
              onClick={() => setShowTravelerPicker(!showTravelerPicker)}
              className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-gray-400"
            >
              {travelerCount} Traveler{travelerCount > 1 ? 's' : ''}
            </button>

            {showTravelerPicker && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700">Number of travelers</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTravelerCount(c => Math.max(pkg.minTravelers || 1, c - 1))}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold">{travelerCount}</span>
                    <button
                      onClick={() => setTravelerCount(c => Math.min(pkg.maxTravelers || 10, c + 1))}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Min: {pkg.minTravelers || 1}, Max: {pkg.maxTravelers || 10}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mb-6 border-t pt-6">
          <h3 className="font-bold text-gray-800 mb-3">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">NPR {price.toLocaleString()} × {travelerCount}</span>
              <span>NPR {baseTotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Group discount (10%)</span>
                <span>- NPR {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee</span>
              <span>NPR {serviceFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>NPR {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={onBookNow}
          disabled={!selectedDate}
          className={`w-full font-bold py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${selectedDate
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          {selectedDate ? "Book Now" : "Select a date to continue"}
        </button>

        {/* Instant Confirmation */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-green-600 text-sm">
            <Shield size={14} className="mr-1" />
            Instant confirmation
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t">
          <div className="text-center text-gray-500 text-sm mb-2">We accept</div>
          <div className="flex justify-center gap-4">
            <div className="bg-gray-100 p-2 rounded">
              <CreditCard size={20} />
            </div>
            <div className="text-sm font-medium bg-gray-100 px-3 py-2 rounded">
              eSewa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;