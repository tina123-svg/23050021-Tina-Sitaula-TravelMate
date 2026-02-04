import React from "react";
import { Phone, MessageCircle, Mail, MapPin, Building, Camera } from "lucide-react";

const AgencyCard = ({ agency }) => {
  if (!agency) return null;

  // Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If it's a path from backend
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }

    // If it's just a filename
    if (imagePath.startsWith('uploads/')) {
      return `http://localhost:5000/${imagePath}`;
    }

    // If it's just a relative path
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  // Check if agency has avatar
  const hasAvatar = agency.avatar && agency.avatar.trim() !== "";

  // Get initials for placeholder
  const getInitials = () => {
    if (!agency.name) return "A";
    return agency.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar URL
  const avatarUrl = hasAvatar ? getImageUrl(agency.avatar) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Agency Information</h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Agency Logo/Image */}
        <div className="md:w-1/4">
          <div className="relative">
            {/* Profile Picture Container - Similar to packages page */}
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden h-48 w-full">
              {hasAvatar && avatarUrl ? (
                <>
                  <img
                    src={avatarUrl}
                    alt={`${agency.name} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show placeholder
                      console.error('Image failed to load:', avatarUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Show initials behind if image loads but we need fallback */}
                  <div className="absolute inset-0 flex items-center justify-center hidden">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white">
                        {getInitials()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Building size={60} className="mx-auto mb-3 text-white/80" />
                    <div className="text-lg font-medium text-white">
                      {agency.name?.split(' ')[0] || 'Agency'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload/edit indicator (optional) */}
            {hasAvatar && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full p-1">
                <Camera size={14} />
              </div>
            )}

            {/* Agency Name Badge */}
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-gray-800">
                {agency.name?.split(' ')[0]}
              </div>
              {agency.licenseNumber && (
                <div className="text-xs text-gray-500 mt-1">
                  License: {agency.licenseNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agency Details */}
        <div className="md:w-3/4">
          {/* Agency Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {agency.name || agency.agencyName}
            </h2>
            <div className="flex items-center gap-2 text-gray-500">
              <Building size={16} />
              <span>Travel Agency</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              {agency.description || agency.agencyDescription || "No description provided."}
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
            {(agency.agencyAddress || agency.address) && (
              <div className="flex items-start text-gray-700 p-4 bg-gray-50 rounded-lg">
                <MapPin size={20} className="mr-3 text-blue-500 mt-1" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-lg">
                    {agency.agencyAddress || agency.address}
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default AgencyCard;