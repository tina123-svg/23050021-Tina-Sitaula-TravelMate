const crypto = require('crypto');
const Booking = require('../models/Booking');

// eSewa Configuration
const ESEWA_CONFIG = {
  TEST: {
    url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    merchantCode: 'EPAYTEST',
    secretKey: '8gBm/:&EnhH.1/q'
  },
  PRODUCTION: {
    url: 'https://epay.esewa.com.np/api/epay/main/v2/form',
  }
};

const config = ESEWA_CONFIG.TEST;

// Generate eSewa signature
const generateEsewaSignature = (message) => {
  return crypto
    .createHmac('sha256', config.secretKey)
    .update(message)
    .digest('base64');
};

// Initiate eSewa payment
exports.initiateEsewaPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Find booking
    const booking = await Booking.findOne({
      _id: bookingId,
      travelerId: userId
    }).populate('packageId', 'title');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid'
      });
    }


    // Prepare payment data
    const totalAmountNum = Number(booking.totalAmount);
    if (isNaN(totalAmountNum) || totalAmountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking amount'
      });
    }

    const amountStr = totalAmountNum.toFixed(2);
    const taxAmountStr = '0.00';
    const serviceChargeStr = '0.00';
    const deliveryChargeStr = '0.00';
    const totalAmountStr = amountStr;

    // Generate unique transaction ID
    const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create signature message (uses total_amount!)
    const signatureMessage = `total_amount=${totalAmountStr},transaction_uuid=${transactionId},product_code=${config.merchantCode}`;
    const signature = generateEsewaSignature(signatureMessage);

    // Update booking with transaction ID
    booking.paymentDetails.transactionId = transactionId;
    await booking.save();

    // Prepare payment form data
    const paymentData = {
      amount: amountStr,
      tax_amount: taxAmountStr,
      total_amount: totalAmountStr,
      transaction_uuid: transactionId,
      product_code: config.merchantCode,
      product_service_charge: serviceChargeStr,
      product_delivery_charge: deliveryChargeStr,
      success_url: `${process.env.FRONTEND_URL}/booking-confirmation/${booking._id}`,
      failure_url: `${process.env.FRONTEND_URL}/payment/failed?bookingId=${booking._id}`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: signature,
      customer_name: booking.travelerInfo?.name || '',
      customer_email: booking.travelerInfo?.email || '',
      customer_phone: booking.travelerInfo?.phone || ''
    };

    res.status(200).json({
      success: true,
      message: 'Payment initiated',
      data: {
        paymentUrl: config.url,
        formData: paymentData,
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
          totalAmount: booking.totalAmount,
          package: booking.packageId?.title
        }
      }
    });

  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message
    });
  }
};

// eSewa callback (success/failure)
exports.esewaCallback = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No payment data received'
      });
    }

    // Decode base64 data
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString());

    const {
      transaction_uuid: transactionId,
      status,
      total_amount: amount,
      product_code: merchantCode
    } = decodedData;

    // Verify merchant code
    if (merchantCode !== config.merchantCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid merchant code'
      });
    }

    // Find booking by transaction ID
    const booking = await Booking.findOne({
      'paymentDetails.transactionId': transactionId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for this transaction'
      });
    }

    // Verify amount matches
    if (parseFloat(amount) !== booking.totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch'
      });
    }

    // Update booking based on payment status
    if (status === 'COMPLETE') {
      booking.paymentStatus = 'paid';
      booking.paymentDetails.paidAt = new Date();
      booking.paymentDetails.method = 'online';
      booking.status = 'confirmed';

      await booking.save();



      return res.status(200).json({
        success: true,
        message: 'Payment successful',
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
          status: booking.status,
          paymentStatus: booking.paymentStatus
        }
      });
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: 'Payment failed or cancelled',
        status: status
      });
    }

  } catch (error) {
    console.error('eSewa callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Callback processing failed',
      error: error.message
    });
  }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      _id: bookingId,
      travelerId: userId
    }).select('bookingId paymentStatus status paymentDetails.totalAmount paymentDetails.transactionId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking.bookingId,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.status,
        amount: booking.totalAmount,
        transactionId: booking.paymentDetails?.transactionId,
        paidAt: booking.paymentDetails?.paidAt
      }
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
};

// Verify eSewa payment (manual verification)
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Verify with eSewa API
    const verifyUrl = `https://uat.esewa.com.np/api/epay/transaction/status/?product_code=${config.merchantCode}&total_amount=AMOUNT&transaction_uuid=${transactionId}`;

    // Note: This requires proper integration with eSewa status API
    // For now, we'll rely on callback

    res.status(200).json({
      success: true,
      message: 'Verification endpoint - integrate with eSewa status API',
      transactionId
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
};