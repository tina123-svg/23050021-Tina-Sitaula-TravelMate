 import api from './api';

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Add package to wishlist
  addToWishlist: async (packageId) => {
    try {
      const response = await api.post(`/wishlist/${packageId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove package from wishlist
  removeFromWishlist: async (packageId) => {
    try {
      const response = await api.delete(`/wishlist/${packageId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if package is in wishlist
  checkWishlistStatus: async (packageId) => {
    try {
      const response = await api.get(`/wishlist/check/${packageId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      throw error;
    }
  }
};