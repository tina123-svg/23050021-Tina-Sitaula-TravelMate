const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  updatePayment,
  cancelBooking,
  getBookingStats
} = require('../controller/travelerBookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Traveler booking routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBooking);
router.put('/:id/payment', updatePayment);
router.put('/:id/cancel', cancelBooking);

module.exports = router;