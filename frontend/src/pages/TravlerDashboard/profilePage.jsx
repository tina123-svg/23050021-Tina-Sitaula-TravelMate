import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { Save, Upload, Calendar, MapPin, Phone, Mail, User, Shield, Package } from 'lucide-react';
import travelerProfileService from '../../services/travelerProfileService';

const TravelerProfilePage = () => {
  const navigate = useNavigate();

  // Traveler profile data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    nationality: 'Nepali',
    emergencyContact: '',
    dateOfBirth: '',
    passportNumber: '',
    dietaryPreferences: '',
    medicalConditions: '',
    // For password change
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    pendingBookings: 0
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
      const response = await travelerProfileService.getProfile();

      if (response.success) {
        const userData = response.data.user;
        setProfile({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          nationality: userData.nationality || 'Nepali',
          emergencyContact: userData.emergencyContact || '',
          dateOfBirth: userData.dateOfBirth || '',
          passportNumber: userData.passportNumber || '',
          dietaryPreferences: userData.dietaryPreferences || '',
          medicalConditions: userData.medicalConditions || '',
          profilePicture: userData.profilePicture || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setStats(response.data.stats || {});
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
      const formData = new FormData();

      formData.append('fullName', profile.fullName);
      formData.append('phone', profile.phone);
      formData.append('address', profile.address);
      formData.append('nationality', profile.nationality);
      formData.append('emergencyContact', profile.emergencyContact);
      formData.append('dateOfBirth', profile.dateOfBirth);
      formData.append('passportNumber', profile.passportNumber);
      formData.append('dietaryPreferences', profile.dietaryPreferences);
      formData.append('medicalConditions', profile.medicalConditions);

      if (profile.profilePictureFile) {
        formData.append('profilePicture', profile.profilePictureFile);
      }

      const response = await travelerProfileService.updateProfile(formData);

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

      const response = await travelerProfileService.changePassword(passwordData);

      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
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
    { id: 'basic', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'contact', label: 'Contact & Safety', icon: <Phone size={18} /> },
    { id: 'travel', label: 'Travel Preferences', icon: <Package size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-teal-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading your profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your personal information and travel preferences</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => navigate('/my-bookings')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              My Bookings
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-sm"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <span>{message.type === 'success' ? '✓' : '✕'}</span>
            {message.text}
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-sm">
          <div
            className="absolute inset-0 opacity-15"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="relative bg-gradient-to-r from-blue-600/90 to-teal-600/90 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-2xl border-4 border-white/30 overflow-hidden bg-white/20 shadow-xl">
                  {profile.profilePicture ? (
                    <img
                      src={`https://travelmatess.onrender.com${profile.profilePicture}`}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {profile.fullName?.charAt(0)?.toUpperCase() || 'T'}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-white shadow-lg p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                    <Upload size={16} className="text-blue-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const previewUrl = URL.createObjectURL(file);
                          setProfile(prev => ({
                            ...prev,
                            profilePicture: previewUrl,
                            profilePictureFile: file
                          }));
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs text-white/90 font-medium mb-3 border border-white/30">
                  <MapPin size={11} />
                  Explorer · {profile.nationality || 'Nepali'}
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{profile.fullName || 'Traveler'}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm mb-5">
                  <Mail size={14} />
                  {profile.email}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {[
                    { value: stats.totalBookings ?? 0, label: 'Bookings', color: 'from-blue-400/30 to-blue-500/30' },
                    { value: stats.upcomingTrips ?? 0, label: 'Upcoming', color: 'from-emerald-400/30 to-emerald-500/30' },
                    { value: stats.pendingBookings ?? 0, label: 'Pending', color: 'from-amber-400/30 to-amber-500/30' },
                  ].map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.color} backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 text-center min-w-[90px]`}>
                      <div className="text-2xl font-bold text-white">{s.value}</div>
                      <div className="text-xs text-white/70 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          {/* Personal Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <select
                    name="nationality"
                    value={profile.nationality}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="Nepali">Nepali</option>
                    <option value="Indian">Indian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={profile.passportNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="A12345678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact & Safety Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contact & Safety Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="+977 98XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={profile.emergencyContact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Alternative phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Street, City, Country"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Travel Preferences Tab */}
          {activeTab === 'travel' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Travel Preferences</h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Preferences
                  </label>
                  <textarea
                    name="dietaryPreferences"
                    value={profile.dietaryPreferences}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60 resize-none"
                    placeholder="Vegetarian, Vegan, Gluten-free, Food allergies, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions & Allergies
                  </label>
                  <textarea
                    name="medicalConditions"
                    value={profile.medicalConditions}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-60 resize-none"
                    placeholder="Any medical conditions, allergies, or special requirements we should know about"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This information is important for your safety during trips
                  </p>
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
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button for Mobile */}
        {isEditing && activeTab !== 'security' && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-xl">
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TravelerProfilePage;