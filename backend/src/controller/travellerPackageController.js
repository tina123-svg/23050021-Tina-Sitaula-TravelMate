const Package = require("../models/Package");

// @desc    Get featured packages (for landing page)
exports.getFeaturedPackages = async (req, res) => {
  try {
    const featuredPackages = await Package.find({
      featured: true,
      status: "active"
    })
      .select("title description price duration difficulty destination category images rating featured")
      .limit(6)
      .sort({ createdAt: -1 });

    // Format for frontend
    const formattedPackages = featuredPackages.map(pkg => ({
      id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      rating: pkg.rating?.average || pkg.rating || 0,
      reviews: pkg.rating?.count || 0,
      duration: pkg.duration,
      difficulty: pkg.difficulty,
      destination: pkg.destination,
      category: pkg.category,
      featured: pkg.featured,
      image: pkg.images?.[0]?.url || "/assets/images/default-package.jpg"
    }));

    return res.status(200).json({
      success: true,
      count: formattedPackages.length,
      data: formattedPackages
    });

  } catch (error) {
    console.error("Featured Packages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get all packages (with filters)
exports.getAllPackages = async (req, res) => {
  try {
    const {
      category,
      destination,
      minPrice,
      maxPrice,
      difficulty,
      search,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { status: "active" };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Destination filter
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const packages = await Package.find(query)
      .select("title description price duration difficulty destination category images rating featured")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Format for frontend
    const formattedPackages = packages.map(pkg => ({
      id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      rating: pkg.rating?.average || pkg.rating || 0,
      reviews: pkg.rating?.count || 0,
      duration: pkg.duration,
      difficulty: pkg.difficulty,
      destination: pkg.destination,
      category: pkg.category,
      featured: pkg.featured,
      image: pkg.images?.[0]?.url || "/assets/images/default-package.jpg"
    }));

    // Get total count
    const total = await Package.countDocuments(query);

    // Get unique categories for filters
    const categories = await Package.distinct("category", { status: "active" });
    const destinations = await Package.distinct("destination", { status: "active" });

    return res.status(200).json({
      success: true,
      count: formattedPackages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      filters: {
        categories,
        destinations,
        difficulties: ["easy", "moderate", "challenging", "strenuous"]
      },
      data: formattedPackages
    });

  } catch (error) {
    console.error("Get Packages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get single package details
exports.getPackageDetails = async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      status: "active"
    })
      .select("-__v")
      .populate({
        path: 'agencyId',
        select: 'fullName email agencyName agencyPhone agencyDescription agencyAddress licenseNumber avatar'
      });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // DEBUG: Check what's in the database
    console.log("DEBUG - Package rating from DB:", package.rating);
    console.log("DEBUG - Type of rating:", typeof package.rating);

    // Format agency details
    const agencyDetails = package.agencyId ? {
      name: package.agencyId.agencyName || package.agencyId.fullName || "Travel Agency",
      contact: package.agencyId.agencyPhone || "Not provided",
      description: package.agencyId.agencyDescription || "Professional travel agency",
      email: package.agencyId.email,
      address: package.agencyId.agencyAddress,
      licenseNumber: package.agencyId.licenseNumber,
      avatar: package.agencyId.avatar
    } : {
      name: "Travel Agency",
      contact: "Not provided",
      description: "Professional travel agency",
      email: "contact@agency.com",
      avatar: ""

    };

    // Generate available dates if not in DB
    const generateAvailableDates = (duration) => {
      const dates = [];
      const today = new Date();
      for (let i = 1; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i * 30);
        dates.push({
          startDate: date.toISOString().split('T')[0],
          endDate: new Date(date.getTime() + (duration - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          availableSpots: Math.floor(Math.random() * 8) + 4
        });
      }
      return dates;
    };

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

    // FIX: Extract rating properly - ALWAYS return a number
    const ratingValue = package.rating?.average || 4.5;
    const reviewCount = package.rating?.count || Math.floor(Math.random() * 200) + 50;

    // Format the response
    const formattedPackage = {
      id: package._id,
      title: package.title,
      tagline: package.tagline || package.description?.substring(0, 100) + "...",
      description: package.description,
      detailedDescription: package.overview || package.description,
      price: package.price?.toLocaleString(),
      duration: package.duration,
      difficulty: package.difficulty,
      destination: package.destination,
      category: package.category,
      groupSize: package.groupSize,
      bestTimeToGo: package.bestTimeToGo,
      highlights: package.highlights,
      included: package.included,
      excluded: package.excluded,
      itinerary: itinerary,
      whatToBring: package.whatToBring,
      physicalRequirements: package.physicalRequirements,

      // CRITICAL FIX: Make sure rating is always a number
      rating: ratingValue, // This should be 4.5, not {average: 4.5, count: 120}
      reviews: reviewCount,

      featured: package.featured || false,
      route: package.route || {
        startPoint: {
          name: '',
          coordinates: { lat: 0, lng: 0 }
        },
        endPoint: {
          name: '',
          coordinates: { lat: 0, lng: 0 }
        }
      },
      images: images,
      createdAt: package.createdAt,
      agencyDetails: agencyDetails,
      maxTravelers: package.groupSize?.max || 12,
      minTravelers: package.groupSize?.min || 2,
      availableDates: package.availableDates || generateAvailableDates(package.duration),
      cancellationPolicy: package.cancellationPolicy || {
        freeCancellationDays: 30,
        partialRefundDays: 14,
        noRefundDays: 7
      },
      faqs: package.faqs || [
        {
          question: "What is the difficulty level?",
          answer: `${package.difficulty || "Moderate"}. ${package.physicalRequirements || "Requires basic fitness."}`
        }
      ],
      // Additional fields for frontend
      originalPrice: package.originalPrice ? package.originalPrice.toLocaleString() : null,
      discount: package.discount || Math.floor(Math.random() * 20) + 5,
      nights: package.duration - 1,
      altitude: package.highestAltitude || "5,364m",
      bestSeason: package.bestTimeToGo || ["Spring (Mar-May)", "Autumn (Sep-Nov)"],
      tags: package.tags || ["Trekking", "Adventure", "Himalayas"]
    };

    // Get related packages
    const relatedPackages = await Package.find({
      category: package.category,
      _id: { $ne: package._id },
      status: "active"
    })
      .select("title description price duration difficulty destination category images rating")
      .limit(4);

    // Format related packages - FIX rating here too
    const formattedRelatedPackages = relatedPackages.map(pkg => {
      const relatedRating = pkg.rating?.average || 0;
      const relatedReviews = pkg.rating?.count || 0;

      return {
        id: pkg._id,
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        rating: relatedRating, // Make sure this is a number
        reviews: relatedReviews,
        duration: pkg.duration,
        difficulty: pkg.difficulty,
        destination: pkg.destination,
        image: pkg.images?.[0]?.url || "/assets/images/default-package.jpg",
        category: pkg.category
      };
    });

    // DEBUG: Check final response
    console.log("DEBUG - Final rating value:", formattedPackage.rating);
    console.log("DEBUG - Final rating type:", typeof formattedPackage.rating);

    return res.status(200).json({
      success: true,
      data: formattedPackage,
      relatedPackages: formattedRelatedPackages
    });

  } catch (error) {
    console.error("Get Package Error:", error);
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

// Helper function for dates
function generateAvailableDates(duration) {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + (i * 10));

    dates.push({
      date: date.toISOString().split('T')[0],
      status: "available",
      seats: Math.floor(Math.random() * 10) + 3
    });
  }

  return dates;
}

// @desc    Search packages
exports.searchPackages = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Please provide search query"
      });
    }

    const packages = await Package.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { destination: { $regex: q, $options: "i" } }
      ],
      status: "active"
    })
      .select("title description price duration difficulty destination category images rating")
      .limit(10);

    // Format for frontend
    const formattedPackages = packages.map(pkg => ({
      id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      rating: pkg.rating?.average || 0,
      duration: pkg.duration,
      difficulty: pkg.difficulty,
      destination: pkg.destination,
      image: pkg.images?.[0]?.url || "/assets/images/default-package.jpg"
    }));

    return res.status(200).json({
      success: true,
      count: formattedPackages.length,
      data: formattedPackages
    });

  } catch (error) {
    console.error("Search Packages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

