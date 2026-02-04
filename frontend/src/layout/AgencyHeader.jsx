// components/agency/AgencyHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // add useNavigate
import { Bell, LogOut } from "lucide-react";

const AgencyHeader = () => {
  const navigate = useNavigate();

  const agencyData = {
    name: "Himalayan Adventures",
    verified: true
  };

  const handleLogout = () => {
    // 1. Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('agencyData');

    navigate('/');

  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Agency Name */}
          <div className="flex items-center">
            <Link to="/agency-dashboard" className="flex items-center mr-8">
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

            {/* Logout Button*/}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AgencyHeader;