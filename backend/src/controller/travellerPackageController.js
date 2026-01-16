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

    // Format agency details - check what fields your User model has
    const agencyDetails = package.agencyId ? {
      name: package.agencyId.agencyName || package.agencyId.fullName || "Travel Agency",
      contact: package.agencyId.agencyPhone || "Not provided", // ← THIS LINE
      description: package.agencyId.agencyDescription || "Professional travel agency",
      email: package.agencyId.email,
      address: package.agencyId.agencyAddress,
      licenseNumber: package.agencyId.licenseNumber
    } : {
      name: "Travel Agency",
      contact: "Not provided",
      description: "Professional travel agency",
      email: "contact@agency.com"
    };

    // Format the response
    const formattedPackage = {
      id: package._id,
      title: package.title,
      tagline: package.tagline || package.description?.substring(0, 100) + "...",
      description: package.description,
      detailedDescription: package.overview || package.description,
      price: package.price,
      duration: package.duration,
      difficulty: package.difficulty,
      destination: package.destination,
      category: package.category,
      groupSize: package.groupSize,
      bestTimeToGo: package.bestTimeToGo,
      highlights: package.highlights,
      included: package.included,
      excluded: package.excluded,
      itinerary: package.itinerary,
      whatToBring: package.whatToBring,
      physicalRequirements: package.physicalRequirements,
      rating: typeof package.rating === 'object' ? package.rating?.average || 5 : package.rating || 5,
      reviews: typeof package.rating === 'object' ? package.rating?.count || 0 : package.reviews || 0,
      featured: package.featured || false,
      images: package.images || [],
      createdAt: package.createdAt,
      // ADD THESE:
      agencyDetails: agencyDetails,
      maxTravelers: package.groupSize?.max || 12,
      minTravelers: package.groupSize?.min || 2,
      // Generate available dates if not in DB
      availableDates: package.availableDates || generateAvailableDates(package.duration),
      // Add other fields for frontend
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
      ]
    };

    return res.status(200).json({
      success: true,
      data: formattedPackage
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

