import api from './api';

export const paymentService = {
  // Initiate eSewa payment
  initiateEsewaPayment: async (bookingId) => {
    try {
      const response = await api.post(`/payment/bookings/${bookingId}/pay/esewa`);
      return response.data;
    } catch (error) {
      console.error('Initiate payment error:', error);
      throw error;
    }
  },

  // Check payment status
  checkPaymentStatus: async (bookingId) => {
    try {
      const response = await api.get(`/payment/bookings/${bookingId}/payment/status`);
      return response.data;
    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    try {
      const response = await api.get(`/traveler/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Get booking details error:', error);
      throw error;
    }
  }
};