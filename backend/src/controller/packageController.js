const Package = require("../models/Package");

//  Create new package
exports.createPackage = async (req, res) => {
  try {
    const {
      title, description, overview, price, duration,
      difficulty, destination, category, groupSize,
      bestTimeToGo, highlights, included, excluded,
      itinerary, whatToBring, featured, physicalRequirements
    } = req.body;

    // Basic validation
    if (!title || !description || !price || !duration || !destination) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Create package
    const newPackage = new Package({
      agencyId: req.user.id,
      title,
      description,
      overview: overview || description,
      price: Number(price),
      duration: Number(duration),
      difficulty: difficulty || "moderate",
      destination,
      category: category || "trekking",
      groupSize: groupSize || { min: 1, max: 12 },
      bestTimeToGo: bestTimeToGo || [],
      highlights: highlights || [],
      included: included || [],
      excluded: excluded || [],
      whatToBring: whatToBring || [],
      itinerary: itinerary || [],
      featured: featured || false,
      physicalRequirements: physicalRequirements || "",
      status: "draft"
    });

    await newPackage.save();

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage
    });

  } catch (error) {
    console.error("Create Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//     Get all packages for agency
exports.getAgencyPackages = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { agencyId: req.user.id };

    // Filter by status
    if (status && ["draft", "active", "inactive"].includes(status)) {
      query.status = status;
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-__v");

    // Get total count for pagination
    const total = await Package.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: packages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: packages
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

//     Get single package
exports.getPackage = async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      agencyId: req.user.id
    }).select("-__v");

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: package
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

//     Update package
exports.updatePackage = async (req, res) => {
  try {
    const {
      title, description, overview, price, duration,
      difficulty, destination, category, groupSize,
      bestTimeToGo, highlights, included, excluded,
      itinerary, whatToBring, featured, physicalRequirements, status
    } = req.body;

    // Find package
    let package = await Package.findOne({
      _id: req.params.id,
      agencyId: req.user.id
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    // Update fields (only update provided fields)
    if (title !== undefined) package.title = title;
    if (description !== undefined) package.description = description;
    if (overview !== undefined) package.overview = overview;
    if (price !== undefined) package.price = Number(price);
    if (duration !== undefined) package.duration = Number(duration);
    if (difficulty !== undefined) package.difficulty = difficulty;
    if (destination !== undefined) package.destination = destination;
    if (category !== undefined) package.category = category;
    if (groupSize !== undefined) package.groupSize = groupSize;
    if (bestTimeToGo !== undefined) package.bestTimeToGo = bestTimeToGo;
    if (highlights !== undefined) package.highlights = highlights;
    if (included !== undefined) package.included = included;
    if (excluded !== undefined) package.excluded = excluded;
    if (itinerary !== undefined) package.itinerary = itinerary;
    if (whatToBring !== undefined) package.whatToBring = whatToBring;
    if (physicalRequirements !== undefined) package.physicalRequirements = physicalRequirements;
    if (status !== undefined) package.status = status;
    if (featured !== undefined) package.featured = featured;

    await package.save();

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: package
    });

  } catch (error) {
    console.error("Update Package Error:", error);
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

//     Delete package
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findOneAndDelete({
      _id: req.params.id,
      agencyId: req.user.id
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
      data: {}
    });

  } catch (error) {
    console.error("Delete Package Error:", error);
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

//     Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      agencyId: req.user.id
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    package.featured = !package.featured;
    await package.save();

    return res.status(200).json({
      success: true,
      message: `Package ${package.featured ? "marked as" : "removed from"} featured`,
      data: { featured: package.featured }
    });

  } catch (error) {
    console.error("Toggle Featured Error:", error);
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

//     Update package status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const package = await Package.findOneAndUpdate(
      {
        _id: req.params.id,
        agencyId: req.user.id
      },
      { status },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Package status updated to ${status}`,
      data: package
    });

  } catch (error) {
    console.error("Update Status Error:", error);
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