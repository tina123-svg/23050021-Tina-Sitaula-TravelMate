import api from './api';

const travelerBookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/traveler/bookings', bookingData);
    return response.data;
  },

  // Get traveler's bookings
  getMyBookings: async () => {
    const response = await api.get('/traveler/bookings/my-bookings');
    return response.data;
  },

  // Get single booking
  getBooking: async (bookingId) => {
    const response = await api.get(`/traveler/bookings/${bookingId}`);
    return response.data;
  },

  // Update payment
  updatePayment: async (bookingId, paymentData) => {
    const response = await api.put(`/traveler/bookings/${bookingId}/payment`, paymentData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    const response = await api.put(`/traveler/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  // Get booking stats
  getBookingStats: async () => {
    const response = await api.get('/traveler/bookings/stats');
    return response.data;
  }
};

export default travelerBookingService;