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
      rating: pkg.rating?.average || 0,
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
      rating: pkg.rating?.average || 0,
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
      .select("-__v -agencyId");

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Format for frontend
    const formattedPackage = {
      id: package._id,
      title: package.title,
      description: package.description,
      overview: package.overview,
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
      rating: package.rating?.average || 0,
      reviews: package.rating?.count || 0,
      featured: package.featured,
      images: package.images || [],
      createdAt: package.createdAt
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