import api from './api';

export const travelerService = {
  // Get featured packages for landing page
  getFeaturedPackages: async () => {
    try {
      const response = await api.get('/packages/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured packages:', error);
      throw error;
    }
  },

  // Get all packages with filters
  getAllPackages: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/packages${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Get single package details
  getPackageDetails: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  },

  // Search packages
  searchPackages: async (query) => {
    try {
      const response = await api.get(`/packages/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching packages:', error);
      throw error;
    }
  }
};