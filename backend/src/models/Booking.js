// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  // Unique Booking ID like "TRV-2024-001"
  bookingId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },

  // Which package is booked
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true
  },

  // Which agency owns this package
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Who booked it (traveler)
  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Booking Details
  travelers: {
    type: Number,
    required: true,
    min: 1
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  bookingDate: {
    type: Date,
    default: Date.now
  },

  startDate: {
    type: Date,
    required: true
  },

  // Status: confirmed, pending, cancelled
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },

  // Payment Status: paid, pending, refunded
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },

  // Traveler Information
  travelerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    emergencyContact: String,
    specialRequirements: String
  },

  // Payment Details
  paymentDetails: {
    method: {
      type: String,
      enum: ["online", "bank_transfer", "cash"]
    },
    transactionId: String,
    paidAt: Date
  },

  // Notes (for agency internal use)
  notes: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

bookingSchema.pre("save", async function () {
  // Generate booking ID if not exists
  if (!this.bookingId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      bookingId: new RegExp(`TRV-${year}-`)
    });
    this.bookingId = `TRV-${year}-${String(count + 1).padStart(3, "0")}`;
  }

  // Update timestamp
  this.updatedAt = Date.now();
});


// Create indexes for faster search
bookingSchema.index({ agencyId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);