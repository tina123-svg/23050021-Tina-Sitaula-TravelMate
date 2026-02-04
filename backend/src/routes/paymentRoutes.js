const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  initiateEsewaPayment,
  esewaCallback,
  checkPaymentStatus,
  verifyPayment
} = require('../controller/paymentController');

// Protected routes (user must be logged in)
router.post('/bookings/:bookingId/pay/esewa', protect, initiateEsewaPayment);
router.get('/bookings/:bookingId/payment/status', protect, checkPaymentStatus);
router.get('/verify/:transactionId', protect, verifyPayment);

// Public callback (eSewa will call this)
router.get('/callback/esewa', esewaCallback);

module.exports = router;