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
      success_url: `${process.env.BACKEND_URL}/api/payment/callback/esewa?bookingId=${booking._id}`,
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

exports.esewaCallback = async (req, res) => {
  try {
    // Get the full bookingId parameter which contains both
    const fullParam = req.query.bookingId;

    console.log('Full param received:', fullParam);

    if (!fullParam) {
      console.error('No data received from eSewa');
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
    }

    // Split the parameter to get bookingId and data
    const [bookingId, dataPart] = fullParam.split('?data=');

    console.log('Extracted bookingId:', bookingId);
    console.log('Extracted data part:', dataPart);

    if (!dataPart) {
      console.error('No data part found');
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?bookingId=${bookingId}`);
    }

    // Decode base64 data
    let decodedData;
    try {
      const buffer = Buffer.from(dataPart, 'base64');
      decodedData = JSON.parse(buffer.toString());
      console.log('Decoded eSewa data:', decodedData);
    } catch (parseError) {
      console.error('Failed to decode eSewa data:', parseError);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?bookingId=${bookingId}`);
    }

    const {
      transaction_uuid: transactionId,
      status,
      total_amount: amount
    } = decodedData;

    // Find booking by transaction ID
    const booking = await Booking.findOne({
      'paymentDetails.transactionId': transactionId
    });

    if (!booking) {
      console.error('Booking not found for transaction:', transactionId);
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?bookingId=${bookingId}`);
    }

    // Update booking based on payment status
    if (status === 'COMPLETE') {
      booking.paymentStatus = 'paid';
      booking.paymentDetails.paidAt = new Date();
      booking.paymentDetails.method = 'online';
      booking.status = 'confirmed';

      await booking.save();
      console.log(`✅ Payment successful for booking: ${booking.bookingId}`);

      return res.redirect(`${process.env.FRONTEND_URL}/booking-confirmation/${booking._id}?payment=success`);
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();

      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?bookingId=${booking._id}`);
    }

  } catch (error) {
    console.error('eSewa callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=server`);
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