// components/packages/MapView.jsx
import React from "react";
import { MapPin, Navigation } from "lucide-react";

// This is a simplified map view with markers
// In a real app, you'd use Google Maps or Leaflet
const MapView = ({ packages }) => {
  const nepalCenter = { lat: 28.3949, lng: 84.1240 }; 

  return (
    <div className="relative h-[600px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      {/* Simplified Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Nepal outline approximation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-96 border-2 border-gray-300 rounded-lg"></div>

        {/* Mountains */}
        <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gray-400 rounded-full"></div>

        {/* Rivers */}
        <div className="absolute top-2/3 left-1/4 w-48 h-2 bg-blue-200 rounded-full"></div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="bg-white p-3 rounded-lg shadow hover:shadow-md">
          <Navigation size={20} />
        </button>
        <button className="bg-white p-3 rounded-lg shadow hover:shadow-md">
          <MapPin size={20} />
        </button>
      </div>

      {/* Package Markers */}
      {packages.map((pkg, index) => {
        // Simple positioning logic (in real app, use actual coordinates)
        const left = 30 + (index * 10) % 60;
        const top = 30 + (index * 7) % 50;

        return (
          <div
            key={pkg.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {/* Marker */}
            <div className="relative">
              <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white rounded-lg shadow-xl p-3 min-w-[200px]">
                  <div className="flex items-start gap-3">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{pkg.title}</h4>
                      <div className="flex items-center text-yellow-600 text-xs mt-1">
                        <span>★ {pkg.rating}</span>
                        <span className="mx-1">•</span>
                        <span>NPR {pkg.price}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700">
                    View Details
                  </button>
                </div>
                <div className="w-2 h-2 bg-white transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <h4 className="font-bold text-sm mb-2">Destinations</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-xs">Trekking Packages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-xs">Safari Packages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span className="text-xs">Cultural Tours</span>
          </div>
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow">
        <div className="text-sm">
          <div className="font-bold">{packages.length} packages in this area</div>
          <div className="text-gray-600">Click markers for details</div>
        </div>
      </div>
    </div>
  );
};

export default MapView;