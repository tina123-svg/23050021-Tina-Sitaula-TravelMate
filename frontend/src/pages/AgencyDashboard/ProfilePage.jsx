import React, { useState, useEffect } from 'react';
import AgencyLayout from '../../layout/Agencylayout';
import { Save, Upload } from 'lucide-react';
import { profileService } from '../../services/profileService';

const ProfilePage = () => {
  // Agency profile data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    agencyPhone: '',
    agencyAddress: '',
    agencyName: '',
    licenseNumber: '',
    avatar: '',
    avatarFile: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    agencyDescription: '',
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();

      if (response.success) {
        // Map backend fields to frontend state
        const userData = response.data.user;
        setProfile({
          fullName: userData.fullName || '',
          email: userData.email || '',
          agencyPhone: userData.agencyPhone || '',
          agencyAddress: userData.agencyAddress || '',
          agencyName: userData.agencyName || '',
          licenseNumber: userData.licenseNumber || '',
          agencyDescription: userData.agencyDescription || '',
          avatar: userData.avatar || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Create FormData for image upload
      const formData = new FormData();

      // Add text fields
      formData.append('fullName', profile.fullName);
      formData.append('agencyPhone', profile.agencyPhone);
      formData.append('agencyAddress', profile.agencyAddress);
      formData.append('agencyName', profile.agencyName);
      formData.append('licenseNumber', profile.licenseNumber);
      formData.append('agencyDescription', profile.agencyDescription);

       if (profile.avatarFile) {
        formData.append('avatar', profile.avatarFile);
      }

      const response = await profileService.updateProfile(formData);

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        fetchProfile(); 
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (profile.newPassword !== profile.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      const passwordData = {
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      };

      const response = await profileService.changePassword(passwordData);

      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password'
      });
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'security', label: 'Security' }
  ];

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </AgencyLayout>
    );
  }

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
                onClick={handleSaveProfile}
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

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Logo/Image */}
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-lg overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={
                      profile.avatar
                        ? (profile.avatar.startsWith('blob:')
                          ? profile.avatar // Local preview
                          : `http://localhost:5000${profile.avatar}`) // Server path
                        : "/assets/images/default-avatar.jpg"
                    }
                    alt={profile.agencyName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/images/default-avatar.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-green-600">
                      {profile.agencyName?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
              </div>

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                  <Upload size={18} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Create preview URL
                        const previewUrl = URL.createObjectURL(file);
                        setProfile(prev => ({
                          ...prev,
                          avatar: previewUrl,
                          avatarFile: file
                        }));
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Agency Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mr-3">{profile.fullName}</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                ✓ Verified Agency
              </span>
            </div>
            {profile.agencyDescription && (
              <p className="text-gray-600 mt-2 mb-3 max-w-2xl leading-relaxed">
                {profile.agencyDescription}
              </p>
            )}
            <p className="text-gray-500 mb-4">License: {profile.licenseNumber}</p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">8</div>
                <div className="text-sm text-gray-600">Active Packages</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
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
                  name="fullName"
                  value={profile.fullName}
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


            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="agencyDescription"
                value={profile.agencyDescription}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>


        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="agencyPhone"
                  value={profile.agencyPhone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="agencyAddress"
                  value={profile.agencyAddress}
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
                onClick={handleChangePassword}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button for Mobile */}
      {isEditing && activeTab !== 'security' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
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