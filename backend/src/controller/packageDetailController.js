// controllers/packageDetailController.js
const Package = require("../models/Package");

// @desc    Get package details by ID
exports.getPackageDetails = async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      status: "active"
    })
    .select("-__v -agencyId -createdAt -updatedAt")
    .populate({
      path: 'agencyId',
      select: 'name email phone description agencyName contactNumber'
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Get agency details
    const agencyDetails = package.agencyId ? {
      name: package.agencyId.agencyName || package.agencyId.name,
      contact: package.agencyId.contactNumber || package.agencyId.phone,
      description: package.agencyId.description,
      email: package.agencyId.email
    } : null;

    // Format images
    const images = package.images?.map(img => ({
      url: img.url,
      alt: img.alt || package.title
    })) || [];

    // Format itinerary
    const itinerary = (package.itinerary || []).map((day, index) => ({
      day: index + 1,
      title: day.title || `Day ${index + 1}`,
      description: day.description || '',
      accommodation: day.accommodation || 'Teahouse/Lodge',
      meals: day.meals || 'Breakfast, Lunch, Dinner',
      highlight: day.highlight || 'Scenic views and cultural experience',
      icon: day.icon || "🏔️",
      altitude: day.altitude,
      distance: day.distance,
      tips: day.tips
    }));

    // Format inclusions/exclusions
    const inclusions = package.included || [
      "All accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Licensed English-speaking guide",
      "Porter service (1 porter for 2 trekkers)",
      "All necessary permits and TIMS card",
      "Airport transfers",
      "Domestic flight (Kathmandu-Lukla-Kathmandu)"
    ];

    const exclusions = package.excluded || [
      "International airfare",
      "Nepal entry visa fee",
      "Travel insurance",
      "Personal expenses",
      "Tips for guide and porter",
      "Extra nights in Kathmandu",
      "Alcoholic beverages"
    ];

    // Format available dates (mock data for now)
    const availableDates = generateAvailableDates(package.duration);

    // Get related packages
    const relatedPackages = await Package.find({
      category: package.category,
      _id: { $ne: package._id },
      status: "active"
    })
    .select("title description price duration difficulty destination category images rating")
    .limit(4);

    // Format related packages
    const formattedRelatedPackages = relatedPackages.map(pkg => ({
      id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      rating: pkg.rating?.average || 0,
      duration: pkg.duration,
      difficulty: pkg.difficulty,
      destination: pkg.destination,
      image: pkg.images?.[0]?.url || "/assets/images/default-package.jpg",
      category: pkg.category
    }));

    // Format the response
    const formattedPackage = {
      id: package._id,
      title: package.title,
      tagline: package.overview?.substring(0, 100) + "..." || package.description?.substring(0, 100) + "...",
      description: package.description,
      detailedDescription: package.overview || package.description,
      price: package.price?.toLocaleString(),
      originalPrice: package.originalPrice ? package.originalPrice.toLocaleString() : null,
      discount: package.discount || Math.floor(Math.random() * 20) + 5,
      rating: package.rating?.average || 4.5,
      reviews: package.rating?.count || Math.floor(Math.random() * 200) + 50,
      duration: package.duration,
      nights: package.duration - 1,
      difficulty: package.difficulty,
      category: package.category,
      destination: package.destination,
      altitude: package.highestAltitude || "5,364m",
      bestSeason: package.bestTimeToGo || ["Spring (Mar-May)", "Autumn (Sep-Nov)"],
      images: images,
      itinerary: itinerary,
      availableDates: availableDates,
      maxTravelers: package.groupSize?.max || 12,
      minTravelers: package.groupSize?.min || 2,
      inclusions: inclusions,
      exclusions: exclusions,
      agencyDetails: agencyDetails,
      cancellationPolicy: {
        freeCancellationDays: 30,
        partialRefundDays: 14,
        noRefundDays: 7
      },
      faqs: package.faqs || [
        {
          question: "What is the difficulty level of this trek?",
          answer: package.difficulty + ". Requires good physical fitness and acclimatization."
        },
        {
          question: "What is the accommodation like during the trek?",
          answer: "Clean, basic teahouses with shared bathrooms."
        }
      ],
      tags: package.tags || ["Trekking", "Adventure", "Himalayas"],
      whatToBring: package.whatToBring,
      physicalRequirements: package.physicalRequirements,
      highlights: package.highlights
    };

    return res.status(200).json({
      success: true,
      data: formattedPackage,
      relatedPackages: formattedRelatedPackages
    });

  } catch (error) {
    console.error("Get Package Details Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//  function to generate available dates
function generateAvailableDates(duration) {
  const dates = [];
  const today = new Date();
  
  for (let i = 1; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + (i * 10));
    
    const statuses = ["available", "available", "filling", "available"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const seats = status === "available" ? Math.floor(Math.random() * 10) + 3 : 
                 status === "filling" ? Math.floor(Math.random() * 3) + 1 : 0;
    
    dates.push({
      date: date.toISOString().split('T')[0],
      status: status,
      seats: seats
    });
  }
  
  return dates;
}

// @desc    Get package reviews
exports.getPackageReviews = async (req, res) => {
  try {
    // dupliacte review for noww
    
    const reviews = [
      {
        id: 1,
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely incredible experience! The guides were knowledgeable, the scenery breathtaking.",
        helpful: 24,
        verified: true,
        tripDate: "March 2024",
        highlights: ["Knowledgeable guides", "Well-organized", "Great food"]
      },
      {
        id: 2,
        name: "Sarah Miller",
        avatar: "https://i.pravatar.cc/150?img=2",
        rating: 4,
        date: "1 month ago",
        comment: "Great trek with professional guides. Accommodation was basic but clean.",
        helpful: 18,
        verified: true,
        tripDate: "February 2024",
        highlights: ["Professional team", "Good value"]
      }
    ];

    const ratingBreakdown = [
      { stars: 5, count: 98, percent: 76 },
      { stars: 4, count: 22, percent: 17 },
      { stars: 3, count: 6, percent: 5 },
      { stars: 2, count: 1, percent: 1 },
      { stars: 1, count: 1, percent: 1 }
    ];

    return res.status(200).json({
      success: true,
      data: {
        reviews: reviews,
        ratingBreakdown: ratingBreakdown,
        averageRating: 4.9,
        totalReviews: 128
      }
    });

  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Submit a review
exports.submitReview = async (req, res) => {
  try {
    // This will be connected to actual Review model later
    // For now, simulate success
    
    const { packageId, rating, comment, travelerName } = req.body;
    
    if (!packageId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comment"
      });
    }

    // Update package rating (simplified)
    await Package.findByIdAndUpdate(packageId, {
      $inc: { "rating.count": 1 }
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: {
        id: Date.now(),
        name: travelerName || "Anonymous",
        rating: rating,
        comment: comment,
        date: "Just now",
        verified: false
      }
    });

  } catch (error) {
    console.error("Submit Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};