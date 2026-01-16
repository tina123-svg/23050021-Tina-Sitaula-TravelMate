import React from "react";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

const AgencyCard = ({ agency }) => {
  if (!agency) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Agency Information</h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Agency Logo/Image */}
        <div className="md:w-1/4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <div className="text-4xl font-bold mb-2">
              {agency.name?.split(' ').map(word => word[0]).join('').toUpperCase()}
            </div>
            <div className="text-lg font-medium">{agency.name?.split(' ')[0]}</div>
          </div>
        </div>

        {/* Agency Details */}
        <div className="md:w-3/4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {agency.name}
            </h2>
            {agency.licenseNumber && (
              <div className="text-sm text-gray-500">
                License: {agency.licenseNumber}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              {agency.description}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            {/* Phone */}
            {agency.contact && agency.contact !== "Not provided" && (
              <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg">
                <Phone size={20} className="mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">Phone Number</div>
                  <div className="text-lg">{agency.contact}</div>
                </div>
              </div>
            )}

            {/* Email */}
            {agency.email && (
              <div className="flex items-center text-gray-700 p-4 bg-gray-50 rounded-lg">
                <Mail size={20} className="mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-lg">{agency.email}</div>
                </div>
              </div>
            )}

            {/* Address */}
            {agency.address && (
              <div className="flex items-start text-gray-700 p-4 bg-gray-50 rounded-lg">
                <MapPin size={20} className="mr-3 text-blue-500 mt-1" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-lg">{agency.address}</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center">
              <MessageCircle size={18} className="mr-2" />
              Message Agency
            </button>
            {agency.contact && agency.contact !== "Not provided" && (
              <a
                href={`tel:${agency.contact}`}
                className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium flex items-center justify-center"
              >
                <Phone size={18} className="mr-2" />
                Call Now
              </a>
            )}
            <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium">
              View All Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgencyCard;