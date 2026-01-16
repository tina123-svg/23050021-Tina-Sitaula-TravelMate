import api from './api';

export const packageDetailService = {
  getPackageDetails: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  },

  // Get package reviews
  getPackageReviews: async (id, page = 1, sort = "recent") => {
    try {
      const response = await api.get(`/packages/${id}/reviews`, {
        params: { page, limit: 10, sort }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching package reviews:', error);
      throw error;
    }
  },
  submitReview: async (packageId, reviewData) => {
    try {
      const response = await api.post(`/packages/${packageId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }
};