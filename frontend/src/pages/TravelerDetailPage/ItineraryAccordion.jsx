// components/package-detail/ItineraryAccordion.jsx
import React, { useState } from "react";
import { ChevronDown, MapPin, Coffee, Home, Camera } from "lucide-react";

const ItineraryAccordion = ({ itinerary }) => {
  const [expandedDays, setExpandedDays] = useState([0]); // First day expanded by default

  const toggleDay = (dayIndex) => {
    setExpandedDays(prev => 
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const expandAll = () => {
    setExpandedDays(itinerary.map((_, index) => index));
  };

  const collapseAll = () => {
    setExpandedDays([]);
  };

  const getDayIcon = (icon) => {
    switch(icon) {
      case "🏨": return <Home size={20} className="text-blue-500" />;
      case "✈️": return <MapPin size={20} className="text-green-500" />;
      case "🏔️": return <Camera size={20} className="text-purple-500" />;
      default: return <Coffee size={20} className="text-orange-500" />;
    }
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No itinerary details available
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Day-by-Day Itinerary</h2>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded-lg"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded-lg"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Itinerary Days */}
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Day Header */}
            <button
              onClick={() => toggleDay(index)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-blue-700">Day {day.day}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">{day.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    {getDayIcon(day.icon)}
                    <span className="ml-2">{day.highlight}</span>
                  </div>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  expandedDays.includes(index) ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Day Details */}
            {expandedDays.includes(index) && (
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Description */}
                  <div className="md:col-span-2">
                    <h4 className="font-bold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600">{day.description}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">Accommodation</h4>
                      <div className="flex items-center text-gray-600">
                        <Home size={16} className="mr-2 text-blue-500" />
                        <span>{day.accommodation}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">Meals</h4>
                      <div className="flex items-center text-gray-600">
                        <Coffee size={16} className="mr-2 text-orange-500" />
                        <span>{day.meals}</span>
                      </div>
                    </div>
                    {day.altitude && (
                      <div>
                        <h4 className="font-bold text-gray-700 mb-2">Altitude</h4>
                        <div className="text-gray-600">{day.altitude}</div>
                      </div>
                    )}
                    {day.distance && (
                      <div>
                        <h4 className="font-bold text-gray-700 mb-2">Trekking Distance</h4>
                        <div className="text-gray-600">{day.distance}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips (if any) */}
                {day.tips && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">💡 Pro Tip</h4>
                    <p className="text-yellow-700">{day.tips}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Itinerary Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h3 className="font-bold text-gray-800 mb-3">📊 Itinerary Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{itinerary.length}</div>
            <div className="text-sm text-gray-600">Total Days</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {itinerary.filter(d => d.meals?.includes("Breakfast")).length}
            </div>
            <div className="text-sm text-gray-600">Breakfast Included</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {itinerary.filter(d => d.accommodation?.includes("Hotel")).length}
            </div>
            <div className="text-sm text-gray-600">Hotel Nights</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {itinerary.filter(d => d.highlight).length}
            </div>
            <div className="text-sm text-gray-600">Key Highlights</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryAccordion;