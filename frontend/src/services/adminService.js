import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Agency approvals
  getPendingAgencies: async () => {
    try {
      const response = await api.get('/admin/pending-agencies');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending agencies:', error);
      throw error;
    }
  },

  approveAgency: async (id) => {
    try {
      const response = await api.post(`/admin/approve/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error approving agency:', error);
      throw error;
    }
  },

  rejectAgency: async (id) => {
    try {
      const response = await api.post(`/admin/reject/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting agency:', error);
      throw error;
    }
  },

  // User management
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  toggleUserStatus: async (id) => {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Bookings
  getAllBookings: async () => {
    try {
      const response = await api.get('/admin/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }
};