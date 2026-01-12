import api from './api';

export const bookingService = {
  // Get all agency bookings
  getBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/agency/bookings${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking stats
  getBookingStats: async () => {
    try {
      const response = await api.get('/agency/bookings/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/agency/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await api.patch(`/agency/bookings/${id}/payment`, { paymentStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Export bookings
  exportBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/agency/bookings/export${queryParams ? `?${queryParams}` : ''}`, {
        responseType: 'blob' // For file download
      });
      return response;
    } catch (error) {
      console.error('Error exporting bookings:', error);
      throw error;
    }
  }
};