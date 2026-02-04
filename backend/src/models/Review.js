// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  highlights: [{
    type: String
  }],
  tripDate: {
    type: Date
  },
  helpful: {
    type: Number,
    default: 0
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  agencyResponse: {
    text: String,
    date: Date,
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
}, {
  timestamps: true
});

// Update package rating when review is added
reviewSchema.post("save", async function () {
  const Review = this.constructor;

  const stats = await Review.aggregate([
    { $match: { packageId: this.packageId } },
    {
      $group: {
        _id: "$packageId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model("Package").findByIdAndUpdate(this.packageId, {
      "rating.average": stats[0].averageRating,
      "rating.count": stats[0].reviewCount
    });
  }
});

module.exports = mongoose.model("Review", reviewSchema);