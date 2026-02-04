import api from './api';

export const agencyReviewService = {
  // Get all reviews for agency's packages
  getAgencyReviews: async () => {
    try {
      const response = await api.get('/agency/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching agency reviews:', error);
      throw error;
    }
  },

  // Get agency review statistics
  getAgencyReviewStats: async () => {
    try {
      const response = await api.get('/agency/reviews/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching agency stats:', error);
      throw error;
    }
  },

  // Agency response to review
  addAgencyResponse: async (reviewId, response) => {
    try {
      const responseData = await api.post(`/agency/reviews/${reviewId}/response`, { response });
      return responseData.data;
    } catch (error) {
      console.error('Error adding agency response:', error);
      throw error;
    }
  },

  // Toggle featured status
  toggleFeatured: async (reviewId) => {
    try {
      const response = await api.patch(`/agency/reviews/${reviewId}/featured`);
      return response.data;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }
};