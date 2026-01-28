const User = require("../models/User");
const Booking = require("../models/Booking");
const comparePassword = require("../utils/comparePassword");
const hashPassword = require("../utils/hashPassword");

 
exports.getTravelerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetOtp -resetOtpExpiry");

    // Get booking stats for traveler
    const bookingStats = await Booking.aggregate([
      { $match: { travelerId: req.user._id } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          upcomingTrips: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "confirmed"] },
                    { $gte: ["$startDate", new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          completedTrips: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "confirmed"] },
                    { $lt: ["$startDate", new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          pendingBookings: {
            $sum: {
              $cond: [
                { $eq: ["$status", "pending"] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const stats = bookingStats[0] || {
      totalBookings: 0,
      totalSpent: 0,
      upcomingTrips: 0,
      completedTrips: 0,
      pendingBookings: 0
    };

    return res.status(200).json({
      success: true,
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          profilePicture: user.profilePicture || "",
          nationality: user.nationality || "",
          emergencyContact: user.emergencyContact || "",
          dateOfBirth: user.dateOfBirth || "",
          passportNumber: user.passportNumber || "",
          dietaryPreferences: user.dietaryPreferences || "",
          medicalConditions: user.medicalConditions || "",
          role: user.role
        },
        stats: stats
      }
    });

  } catch (error) {
    console.error("Get Traveler Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

 
exports.updateTravelerProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      nationality,
      emergencyContact,
      dateOfBirth,
      passportNumber,
      dietaryPreferences,
      medicalConditions
    } = req.body;

    const updateData = {};

    // Traveler specific fields
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (nationality) updateData.nationality = nationality;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (passportNumber) updateData.passportNumber = passportNumber;
    if (dietaryPreferences) updateData.dietaryPreferences = dietaryPreferences;
    if (medicalConditions) updateData.medicalConditions = medicalConditions;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -resetOtp -resetOtpExpiry");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update Traveler Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

 //chnage password
exports.changeTravelerPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password"
      });
    }

    const user = await User.findById(req.user.id);

    // Use your comparePassword utility
    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Use your hashPassword utility
    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change Traveler Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};