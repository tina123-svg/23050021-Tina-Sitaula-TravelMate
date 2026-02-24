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
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and travel preferences</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => navigate('/my-bookings')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              My Bookings
            </button>
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

        {/* Profile Stats Card */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Profile Picture */}
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-lg overflow-hidden">
                  {profile.profilePicture ? (
                    <img
                      src={`http://localhost:5000${profile.profilePicture}`}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/assets/images/default-avatar.jpg";
                        e.target.className = "w-full h-full flex items-center justify-center";
                        e.target.innerHTML = `<span class="text-4xl font-bold text-blue-600">
          ${profile.fullName?.charAt(0)?.toUpperCase() || 'T'}
        </span>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600">
                        {profile.fullName?.charAt(0)?.toUpperCase() || 'T'}
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
            </div>

            {/* Traveler Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{profile.fullName}</h2>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <Mail size={16} className="mr-2" />
                {profile.email}
              </div>

              {/* Traveler Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{stats.upcomingTrips}</div>
                  <div className="text-sm text-gray-600">Upcoming Trips</div>
                </div>
                {/* <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">NPR {stats.totalSpent?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div> */}

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
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
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
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <Save size={20} className="mr-2" />
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