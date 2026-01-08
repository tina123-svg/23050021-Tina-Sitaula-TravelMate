// components/package-detail/AgencyCard.jsx - SIMPLIFIED
import React, { useState } from "react";
import {
  Phone, MessageCircle, ChevronDown, ChevronUp
} from "lucide-react";

const AgencyCard = ({ agency }) => {
  const [showContact, setShowContact] = useState(false);

  if (!agency) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Agency Logo/Image */}
        <div className="md:w-1/4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <div className="text-4xl font-bold mb-2">
              {agency.name.split(' ').map(word => word[0]).join('')}
            </div>
            <div className="text-lg font-medium">{agency.name.split(' ')[0]}</div>
          </div>
        </div>

        {/* Agency Details */}
        <div className="md:w-3/4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {agency.name}
            </h2>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              {agency.description}
            </p>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowContact(!showContact)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="font-bold text-gray-800">Contact Information</h3>
              {showContact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showContact && (
              <div className="mb-6">
                <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg">
                  <Phone size={20} className="mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium">Phone Number</div>
                    <div className="text-lg">{agency.contact}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center">
                <MessageCircle size={18} className="mr-2" />
                Message Agency
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium flex items-center justify-center">
                <Phone size={18} className="mr-2" />
                Call Now
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium">
                View All Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyCard;