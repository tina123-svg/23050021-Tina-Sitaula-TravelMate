const User = require("../models/User");
const comparePassword = require("../utils/comparePassword");
const hashPassword = require("../utils/hashPassword");




exports.getAgencyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agency profile data",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName || "",
          email: user.email || "",
          role: user.role || "agency",
          nationality: user.nationality || "Nepali",

          // Agency specific fields
          agencyName: user.agencyName || "",
          agencyAddress: user.agencyAddress || "",
          agencyPhone: user.agencyPhone || "",
          licenseNumber: user.licenseNumber || "",
          agencyDescription: user.agencyDescription || "",

          // Profile image
          avatar: user.avatar || "",

          // Status
          status: user.status || "pending",

          // Timestamps
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        agencyInfo: {
          packagesCount: 0, // You can calculate these later
          bookingsCount: 0,
          totalRevenue: 0
        }
      }
    });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//   Update agency profile
exports.updateAgencyProfile = async (req, res) => {
  try {
    const { fullName, agencyPhone, agencyAddress, agencyName, licenseNumber, agencyDescription } = req.body;
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (agencyPhone) updateData.agencyPhone = agencyPhone;
    if (agencyAddress) updateData.agencyAddress = agencyAddress;
    if (agencyName) updateData.agencyName = agencyName;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (agencyDescription) updateData.agencyDescription = agencyDescription;

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


exports.changePassword = async (req, res) => {
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
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};