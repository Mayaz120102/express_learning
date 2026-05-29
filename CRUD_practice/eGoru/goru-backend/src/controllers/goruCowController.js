import GoruCow from "../models/GoruCow.js";

// ─── CREATE COW ───────────────────────────────────────────────────
export const goruCreateCow = async (req, res) => {
  try {
    const { title, breed, age, weight, price, district, description, images } =
      req.body;

    const cow = await GoruCow.create({
      title,
      breed,
      age,
      weight,
      price,
      district,
      description,
      images: images || [],
      seller: req.goruUser._id, // from auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Cow listed successfully",
      cow,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL COWS ─────────────────────────────────────────────────
// ─── GET ALL COWS (with search, filter, sort, pagination) ─────────
export const goruGetAllCows = async (req, res) => {
  try {
    const {
      search,
      district,
      breed,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    // Build the filter object dynamically
    const filter = { isAvailable: true };

    // Search by title, breed, or description (uses text index we created)
    if (search) {
      filter.$text = { $search: search };
    }

    // Filter by district (case-insensitive)
    if (district) {
      filter.district = { $regex: district, $options: "i" };
    }

    // Filter by breed (case-insensitive)
    if (breed) {
      filter.breed = { $regex: breed, $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { price: 1 },
      price_high: { price: -1 },
      weight_high: { weight: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    // Pagination math
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(20, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Run both queries in parallel — faster than sequential
    const [cows, total] = await Promise.all([
      GoruCow.find(filter)
        .populate("seller", "name phone district")
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum),
      GoruCow.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: cows.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      cows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE COW ───────────────────────────────────────────────
export const goruGetSingleCow = async (req, res) => {
  try {
    const cow = await GoruCow.findById(req.params.id).populate(
      "seller",
      "name phone district email",
    );

    if (!cow) {
      return res.status(404).json({
        success: false,
        message: "Cow not found",
      });
    }

    res.status(200).json({ success: true, cow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE COW ───────────────────────────────────────────────────
export const goruUpdateCow = async (req, res) => {
  try {
    const cow = await GoruCow.findById(req.params.id);

    if (!cow) {
      return res.status(404).json({ success: false, message: "Cow not found" });
    }

    // Only the seller who owns it can update
    if (cow.seller.toString() !== req.goruUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
      });
    }

    const updatedCow = await GoruCow.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the updated document
        runValidators: true, // run schema validations on update too
      },
    );

    res.status(200).json({
      success: true,
      message: "Cow updated successfully",
      cow: updatedCow,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE COW ───────────────────────────────────────────────────
export const goruDeleteCow = async (req, res) => {
  try {
    const cow = await GoruCow.findById(req.params.id);

    if (!cow) {
      return res.status(404).json({ success: false, message: "Cow not found" });
    }

    // Only owner or admin can delete
    if (
      cow.seller.toString() !== req.goruUser._id.toString() &&
      req.goruUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    await GoruCow.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Cow listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SELLER'S OWN COWS ────────────────────────────────────────
export const goruGetMyCows = async (req, res) => {
  try {
    const cows = await GoruCow.find({ seller: req.goruUser._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: cows.length,
      cows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
