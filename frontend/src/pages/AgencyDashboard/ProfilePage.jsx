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
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your agency information and settings</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-emerald-700 flex items-center gap-2 shadow-sm transition-all"
              >
                <Save size={16} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-emerald-700 shadow-sm transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-5 p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl mb-7">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative bg-gradient-to-r from-teal-700/90 to-emerald-600/90 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-7">
            {/* Logo/Image */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-2xl border-4 border-white/30 overflow-hidden bg-white/20 shadow-xl">
                {profile.avatar ? (
                  <img
                    src={profile.avatar.startsWith('blob:') ? profile.avatar : `https://travelmatess.onrender.com${profile.avatar}`}
                    alt={profile.agencyName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/assets/images/default-avatar.jpg"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">{profile.agencyName?.charAt(0) || 'A'}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-white shadow-lg p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <Upload size={16} className="text-teal-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setProfile(prev => ({ ...prev, avatar: previewUrl, avatarFile: file }));
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Agency Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-2xl font-bold text-white">{profile.fullName}</h2>
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30">
                  ✓ Verified Agency
                </span>
              </div>
              {profile.agencyDescription && (
                <p className="text-white/80 mt-2 mb-3 max-w-2xl leading-relaxed text-sm">
                  {profile.agencyDescription}
                </p>
              )}
              <p className="text-white/60 text-sm mb-4">License: {profile.licenseNumber}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-5">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">8</div>
                  <div className="text-xs text-white/70">Active Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">4.8</div>
                  <div className="text-xs text-white/70">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === tab.id
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-emerald-700 shadow-sm transition-all"
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
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-700 hover:to-emerald-700 flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Save size={18} />
              Save
            </button>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
};

export default ProfilePage;