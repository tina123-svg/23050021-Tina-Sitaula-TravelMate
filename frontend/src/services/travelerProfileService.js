import api from './api';

export const travelerProfileService = {
  // Get traveler profile
  getProfile: async () => {
    try {
      const response = await api.get('/traveler/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching traveler profile:', error);
      throw error;
    }
  },

  // Update traveler profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/traveler/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating traveler profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/traveler/profile/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing traveler password:', error);
      throw error;
    }
  }
};

export default travelerProfileService;