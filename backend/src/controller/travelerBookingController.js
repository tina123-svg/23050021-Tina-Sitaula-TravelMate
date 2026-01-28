const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');

// Generate unique booking ID (same as before)
const generateBookingId = async () => {
  const year = new Date().getFullYear();
  const count = await Booking.countDocuments({
    bookingId: new RegExp(`TRV-${year}-`)
  });
  return `TRV-${year}-${String(count + 1).padStart(3, '0')}`;
};

exports.createBooking = async (req, res) => {
  try {
    const {
      packageId,
      startDate,
      travelers,
      travelerInfo,
      paymentMethod = "bank_transfer",
      specialRequests
    } = req.body;

    console.log("Creating booking with data:", { packageId, startDate, travelers });

    // 1. Validate package exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    console.log("Package found:", package.title);
    console.log("Package structure:", {
      hasAvailableDates: !!package.availableDates,
      availableDatesType: typeof package.availableDates,
      agencyId: package.agencyId,
      minTravelers: package.minTravelers || package.groupSize?.min,
      maxTravelers: package.maxTravelers || package.groupSize?.max
    });

    // Use agencyId from package (not agencyDetails)
    const agencyId = package.agencyId || req.user.id;

    // 2. Check if package has availableDates - if not, create default
    let availableDate = null;
    const selectedDate = new Date(startDate);
    const dateStr = selectedDate.toISOString().split('T')[0];

    if (!package.availableDates || !Array.isArray(package.availableDates)) {
      // Create a default available date entry
      console.log("Package doesn't have availableDates, creating default");

      availableDate = {
        date: selectedDate,
        status: 'available',
        seats: package.maxTravelers || package.groupSize?.max || 10
      };

      // Add to package
      await Package.findByIdAndUpdate(
        packageId,
        {
          $push: {
            availableDates: availableDate
          }
        },
        { new: true }
      );
    } else {
      // Find existing date
      availableDate = package.availableDates.find(date => {
        if (!date || !date.date) return false;
        const availableDateStr = new Date(date.date).toISOString().split('T')[0];
        return availableDateStr === dateStr;
      });

      if (!availableDate) {
        // Create new date entry
        console.log("Date not found in availableDates, creating new entry");

        availableDate = {
          date: selectedDate,
          status: 'available',
          seats: package.maxTravelers || package.groupSize?.max || 10
        };

        await Package.findByIdAndUpdate(
          packageId,
          {
            $push: {
              availableDates: availableDate
            }
          },
          { new: true }
        );
      }
    }

    console.log("Available date for booking:", availableDate);

    // 3. Validate seats
    if (availableDate.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Selected date is ${availableDate.status}`
      });
    }

    if (availableDate.seats < travelers) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableDate.seats} seats available for this date`
      });
    }

    // 4. Calculate total amount
    const price = typeof package.price === 'string'
      ? parseInt(package.price.replace(/,/g, ''))
      : package.price;

    let totalAmount = price * travelers;

    // Add service fee
    const serviceFee = 1500;
    totalAmount += serviceFee;

    console.log("Price calculation:", { price, travelers, serviceFee, totalAmount });

    // 5. Create booking
    const booking = new Booking({
      bookingId: await generateBookingId(),
      packageId,
      agencyId: agencyId,
      travelerId: req.user.id,
      travelers,
      totalAmount,
      startDate: selectedDate,
      bookingDate: new Date(),
      travelerInfo: {
        name: travelerInfo.fullName || req.user.name,
        email: travelerInfo.email || req.user.email,
        phone: travelerInfo.phone || req.user.phone,
        emergencyContact: travelerInfo.emergencyContact || '',
        specialRequirements: travelerInfo.specialRequests || specialRequests || ''
      },
      paymentDetails: {
        method: paymentMethod
      },
      status: 'pending',
      paymentStatus: 'pending'
    });

    // 6. Save booking
    await booking.save();
    console.log("Booking saved successfully:", booking.bookingId);

    // 7. Update package seats (reserve them)
    // Find the date in the array and update seats
    await Package.updateOne(
      {
        _id: packageId,
        "availableDates.date": {
          $gte: new Date(dateStr + 'T00:00:00.000Z'),
          $lt: new Date(dateStr + 'T23:59:59.999Z')
        }
      },
      {
        $inc: { "availableDates.$.seats": -travelers },
        $set: {
          "availableDates.$.status": (availableDate.seats - travelers) <= 2 ? 'filling' : 'available'
        }
      }
    );

    console.log("Package seats updated");

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully. Please complete payment to confirm.'
    });

  } catch (error) {
    console.error('Create booking error DETAILS:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
      details: process.env.NODE_ENV === 'development' ? {
        packageId: req.body.packageId,
        startDate: req.body.startDate,
        travelers: req.body.travelers
      } : undefined
    });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ travelerId: req.user.id })
      .populate('packageId', 'title image price duration destination category')
      .populate('agencyId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};


exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      travelerId: req.user.id
    })
      .populate('packageId')
      .populate('agencyId', 'name email phone address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
};


exports.updatePayment = async (req, res) => {
  try {
    const { paymentStatus, transactionId, method } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      travelerId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update payment details
    const updateData = {
      paymentStatus: paymentStatus || booking.paymentStatus
    };

    if (transactionId) {
      updateData['paymentDetails.transactionId'] = transactionId;
      updateData['paymentDetails.paidAt'] = new Date();
    }

    if (method) {
      updateData['paymentDetails.method'] = method;
    }

    // If payment is completed, update booking status
    if (paymentStatus === 'paid') {
      updateData.status = 'confirmed';
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.id, travelerId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('packageId');

    res.json({
      success: true,
      data: updatedBooking,
      message: 'Payment updated successfully'
    });

  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment'
    });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      travelerId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Check cancellation policy  
    const daysUntilTrip = Math.floor((booking.startDate - new Date()) / (1000 * 60 * 60 * 24));

    if (daysUntilTrip < 7) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled within 7 days of departure'
      });
    }

    // Update booking status
    booking.status = 'cancelled';

    // Refund logic  
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    booking.notes = reason ? `Cancelled by traveler: ${reason}` : 'Cancelled by traveler';
    await booking.save();

    // Return seats to package
    await Package.updateOne(
      { _id: booking.packageId, "availableDates.date": booking.startDate },
      {
        $inc: { "availableDates.$.seats": booking.travelers },
        $set: { "availableDates.$.status": 'available' }
      }
    );

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
};


exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $match: { travelerId: req.user._id } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          pending: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "pending"] },
                    { $eq: ["$paymentStatus", "pending"] }
                  ]
                },
                1, 0
              ]
            }
          },
          confirmed: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "confirmed"] },
                    { $eq: ["$paymentStatus", "paid"] }
                  ]
                },
                1, 0
              ]
            }
          },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          upcoming: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "confirmed"] },
                    { $gte: ["$startDate", new Date()] }
                  ]
                },
                1, 0
              ]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalBookings: 0,
        totalSpent: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        upcoming: 0
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking stats'
    });
  }
};