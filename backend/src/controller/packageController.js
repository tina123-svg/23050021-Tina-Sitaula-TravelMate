const Package = require("../models/Package");


// Create Package
exports.createPackage = async (req, res) => {
  try {
    const {
      title, description, overview, price, duration,
      difficulty, destination, category, groupSize,
      bestTimeToGo, highlights, included, excluded,
      itinerary, whatToBring, featured, physicalRequirements,
      route, status
    } = req.body;

    // Parse JSON fields
    const parsedGroupSize = typeof groupSize === 'string' ? JSON.parse(groupSize) : groupSize;
    const parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    const parsedRoute = typeof route === 'string' ? JSON.parse(route) : route;
    const parsedHighlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
    const parsedIncluded = typeof included === 'string' ? JSON.parse(included) : included;
    const parsedExcluded = typeof excluded === 'string' ? JSON.parse(excluded) : excluded;
    const parsedWhatToBring = typeof whatToBring === 'string' ? JSON.parse(whatToBring) : whatToBring;
    const parsedBestTimeToGo = typeof bestTimeToGo === 'string' ? JSON.parse(bestTimeToGo) : bestTimeToGo;

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
      groupSize: parsedGroupSize || { min: 1, max: 12 },
      bestTimeToGo: parsedBestTimeToGo || [],
      highlights: parsedHighlights || [],
      included: parsedIncluded || [],
      excluded: parsedExcluded || [],
      whatToBring: parsedWhatToBring || [],
      itinerary: parsedItinerary || [],
      route: parsedRoute || {
        startPoint: { name: '', coordinates: { lat: 0, lng: 0 } },
        endPoint: { name: '', coordinates: { lat: 0, lng: 0 } }
      },
      featured: featured || false,
      physicalRequirements: physicalRequirements || "",
      status: status || "draft",

      // Handle uploaded images
      images: req.files ? req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: `${title} - Image ${index + 1}`,
        isCover: index === 0 // First image as cover by default
      })) : []
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

// Update Package
exports.updatePackage = async (req, res) => {
  try {
    console.log("UPDATE PACKAGE REQ FILES:", req.files);  
    console.log("UPDATE PACKAGE REQ BODY:", req.body);  

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

    // Parse JSON fields
    const fieldsToParse = ['groupSize', 'bestTimeToGo', 'highlights', 'included',
      'excluded', 'itinerary', 'whatToBring', 'route'];

    fieldsToParse.forEach(field => {
      if (req.body[field]) {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (error) {
          console.log(`Failed to parse ${field}:`, error.message);
        }
      }
    });

    // Update all fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'images') {
        package[key] = req.body[key];
      }
    });

    // Handle images - append new ones
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: `${package.title} - Image ${package.images.length + index + 1}`,
        isCover: false
      }));

      package.images = [...package.images, ...newImages];
    }

    await package.save();

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: package
    });

  } catch (error) {
    console.error("Update Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
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