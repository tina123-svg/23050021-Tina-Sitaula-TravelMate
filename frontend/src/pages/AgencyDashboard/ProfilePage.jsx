import React, { useState } from 'react';
import AgencyLayout from '../../layout/Agencylayout';
import { Save, Upload, Globe, Phone, Mail, MapPin, Building, Link, Lock, Bell, Shield } from 'lucide-react';

const ProfilePage = () => {
  // Agency profile data
  const [profile, setProfile] = useState({
    // Basic Info
    agencyName: 'Himalayan Adventures',
    tagline: 'Your Gateway to the Himalayas',
    description: 'Professional trekking and tour agency with 10+ years of experience in organizing memorable adventures in Nepal.',
    email: 'info@himalayanadventures.com',
    phone: '+977-1-1234567',
    mobile: '+977-9801234567',
    address: 'Thamel, Kathmandu, Nepal',
    website: 'www.himalayanadventures.com',



    // Business Details
    establishedYear: '2014',
    licenseNumber: 'TA-12345',
    taxNumber: '123456789',

    // Contact Person
    contactPerson: 'Rajesh Thapa',
    contactPosition: 'Operations Manager',
    contactEmail: 'rajesh@himalayanadventures.com',
    contactPhone: '+977-9807654321',




    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Here you would typically send data to backend
    console.log('Saving profile:', profile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle image upload logic here
      console.log('Uploading image:', file.name);
      alert('Logo uploaded successfully!');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agency Profile</h1>
          <p className="text-gray-600">Manage your agency information and settings</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center"
              >
                <Save size={20} className="mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Logo/Image */}
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-4xl font-bold text-green-600">HA</span>
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                  <Upload size={18} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Agency Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mr-3">{profile.agencyName}</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                ✓ Verified Agency
              </span>
            </div>
            <p className="text-gray-600 text-lg mb-2">{profile.tagline}</p>
            <p className="text-gray-500">{profile.description}</p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-600">Active Packages</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">42</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{profile.establishedYear}</div>
                <div className="text-sm text-gray-600">Established</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Name *
                </label>
                <input
                  type="text"
                  name="agencyName"
                  value={profile.agencyName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={profile.tagline}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="text"
                  name="establishedYear"
                  value={profile.establishedYear}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={profile.contactPerson}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="contactPosition"
                  value={profile.contactPosition}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={profile.contactEmail}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={profile.contactPhone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        )}




        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Security Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={profile.currentPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={profile.newPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={() => {
                  if (!profile.currentPassword || !profile.newPassword) {
                    alert('Please fill all password fields');
                    return;
                  }
                  if (profile.newPassword !== profile.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                  }
                  alert('Password changed successfully!');
                  setProfile(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }));
                }}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
              >
                Change Password
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <div className="font-medium text-red-800 flex items-center">
                    <Shield size={18} className="mr-2" />
                    Account Deletion
                  </div>
                  <div className="text-sm text-red-600">Once deleted, all data will be permanently removed</div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('Account deletion requested. We\'ll contact you for confirmation.');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button for Mobile */}
      {isEditing && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Save size={20} className="mr-2" />
              Save
            </button>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default ProfilePage;