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

  getRelatedPackages: async (category, excludeId) => {
    try {
      const response = await api.get('/packages/related', {
        params: { category, excludeId }
      });

      // Transform rating from object to number
      const transformedData = response.data.data?.map(pkg => ({
        ...pkg,
        rating: pkg.rating?.average || pkg.rating || 0
      }));

      return {
        ...response.data,
        data: transformedData || response.data.data
      };
    } catch (error) {
      console.error('Error fetching related packages:', error);
      throw error;
    }
  },

  submitReview: async (packageId, reviewData) => {
    try {
      const token = localStorage.getItem('token');

      const response = await api.post(`/packages/${packageId}/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  },

  canUserReview: async (packageId) => {
    try {
      const response = await api.get(`/packages/${packageId}/can-review`);
      return response.data;
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      throw error;
    }
  }
};

