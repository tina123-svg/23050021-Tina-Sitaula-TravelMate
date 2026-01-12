import api from './api';

export const dashboardService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/agency/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};