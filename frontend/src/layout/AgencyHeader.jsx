// components/agency/AgencyHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Bell, HelpCircle, Settings, LogOut } from "lucide-react";

const AgencyHeader = () => {
  const agencyData = {
    name: "Himalayan Adventures",
    verified: true
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Agency Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-8">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">TravelMate</span>
            </Link>

            <div className="hidden md:flex items-center">
              <div className="ml-8">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {agencyData.name}
                  </span>
                  {agencyData.verified && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">Agency Dashboard</div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-800 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-800">
              <HelpCircle size={20} />
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Settings size={20} />
            </button>

            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-green-700 text-sm">
                {agencyData.name.charAt(0)}
              </span>
            </div>

            <button className="p-2 text-gray-600 hover:text-gray-800">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AgencyHeader;