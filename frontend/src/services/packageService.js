import api from './api';

export const packageService = {
  // Get all agency packages
  getPackages: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/agency/packages${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Get single package
  getPackage: async (id) => {
    try {
      const response = await api.get(`/agency/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  },

  // Create new package
  createPackage: async (formData) => {
    try {
      const response = await api.post('/agency/packages', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating package:', error);

      // Provide more specific error messages
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to create package. Please try again.');
      }
    }
  },

  // Update package
  updatePackage: async (id, formData) => {
    try {
      const response = await api.put(`/agency/packages/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating package:', error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to update package. Please try again.');
      }
    }
  },

  // Delete package
  deletePackage: async (id) => {
    try {
      const response = await api.delete(`/agency/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    try {
      const response = await api.patch(`/agency/packages/${id}/featured`);
      return response.data;
    } catch (error) {
      console.error('Error toggling featured:', error);
      throw error;
    }
  },

  // Update package status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/agency/packages/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
};