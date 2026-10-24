
const Favorite = require("../models/Favorite");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const Booking = require("../models/Booking");

// ==========================================
// USER DASHBOARD OVERVIEW
// ==========================================
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [favoritesCount, reviewsCount, lastBooking] = await Promise.all([
      Favorite.countDocuments({ userId }),
      Review.countDocuments({ userId }),
      Booking.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

    return res.json({
      favoritesCount,
      reviewsCount,
      lastBookingAt: lastBooking?.createdAt || null,
      lastLoginAt: null,
    });
  } catch (err) {
    console.error("getOverview error:", err);
    return res.status(500).json({
      message: "Failed to load overview",
    });
  }
};

// ==========================================
// GET USER FAVORITES
// Includes address and images for hostel cards
// ==========================================
exports.getFavorites = async (req, res) => {
  try {
    const items = await Favorite.find({ userId: req.user.id }).populate(
      "hostelId",
      "propertyTitle city address image images rating nearbyCollege"
    );

    return res.json(items);
  } catch (err) {
    console.error("getFavorites error:", err);
    return res.status(500).json({
      message: "Failed to load favorites",
    });
  }
};

// ==========================================
// ADD FAVORITE
// POST /api/user/favorites
// Body: { hostelId }
// ==========================================
exports.addFavorite = async (req, res) => {
  try {
    const { hostelId } = req.body;

    if (!hostelId) {
      return res.status(400).json({
        message: "hostelId is required",
      });
    }

    const fav = await Favorite.findOneAndUpdate(
      { userId: req.user.id, hostelId },
      {
        $setOnInsert: {
          userId: req.user.id,
          hostelId,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(201).json(fav);
  } catch (err) {
    console.error("addFavorite error:", err);
    return res.status(500).json({
      message: "Failed to add favorite",
    });
  }
};

// ==========================================
// REMOVE FAVORITE
// DELETE /api/user/favorites/:hostelId
// ==========================================
exports.removeFavorite = async (req, res) => {
  try {
    const { hostelId } = req.params;

    await Favorite.findOneAndDelete({
      userId: req.user.id,
      hostelId,
    });

    return res.json({
      message: "Removed from favorites",
    });
  } catch (err) {
    console.error("removeFavorite error:", err);
    return res.status(500).json({
      message: "Failed to remove favorite",
    });
  }
};

// ==========================================
// GET MY REVIEWS
// ==========================================
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).populate(
      "hostelId",
      "propertyTitle city"
    );

    return res.json(reviews);
  } catch (err) {
    console.error("getMyReviews error:", err);
    return res.status(500).json({
      message: "Failed to load reviews",
    });
  }
};

// ==========================================
// ADD REVIEW
// ==========================================
exports.addReview = async (req, res) => {
  try {
    const { hostelId, rating, comment } = req.body;

    if (!hostelId || rating === undefined || rating === null) {
      return res.status(400).json({
        message: "hostelId and rating are required",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      hostelId,
      rating: numericRating,
      comment,
    });

    return res.status(201).json(review);
  } catch (err) {
    console.error("addReview error:", err);
    return res.status(500).json({
      message: "Failed to add review",
    });
  }
};

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================
exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json(items);
  } catch (err) {
    console.error("getNotifications error:", err);
    return res.status(500).json({
      message: "Failed to load notifications",
    });
  }
};

// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================
exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      {
        $set: { read: true },
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.json({
      message: "Marked as read",
    });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    return res.status(500).json({
      message: "Failed to mark as read",
    });
  }
};
