// src/models/Package.js
const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: "🏔️"
  },
  highlight: String,
  accommodation: String,
  meals: {
    type: String,
    default: "Breakfast, Lunch, Dinner"
  },
  altitude: String,
  distance: String,
  tips: String
});

const packageSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Basic Info
  title: {
    type: String,
    required: [true, "Package title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    required: [true, "Package description is required"],
    minlength: [100, "Description should be at least 100 characters"]
  },
  overview: {
    type: String,
    required: [true, "Package overview is required"]
  },

  // Pricing & Duration
  price: {
    type: Number,
    required: [true, "Package price is required"],
    min: [0, "Price cannot be negative"]
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
    min: [1, "Duration must be at least 1 day"]
  },

  // Categorization
  difficulty: {
    type: String,
    enum: ["easy", "moderate", "challenging", "strenuous"],
    default: "moderate"
  },
  destination: {
    type: String,
    required: [true, "Destination is required"]
  },
  category: {
    type: String,
    enum: ["trekking", "tour", "adventure", "cultural", "wildlife", "luxury"],
    default: "trekking"
  },

  // Logistics
  groupSize: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 12
    }
  },

  // Content
  bestTimeToGo: [String],
  highlights: [String],
  included: [String],
  excluded: [String],
  whatToBring: [String],

  // Itinerary
  itinerary: [itineraryDaySchema],

  // Media
  images: [{
    url: String,
    isCover: {
      type: Boolean,
      default: false
    }
  }],

  // Features & Status
  featured: {
    type: Boolean,
    default: false
  },
  physicalRequirements: String,

  // Rating & Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Status
  status: {
    type: String,
    enum: ["draft", "active", "inactive"],
    default: "draft"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Package", packageSchema);