const mongoose = require("mongoose");

const Review = require("../models/Review");
const Hostel = require("../models/Hostel");
const Booking = require("../models/Booking");
const { safeStudentNotification, safeAdminNotifications } = require("../utils/notificationService");


const syncHostelRating = async (hostelId) => {
  const result = await Review.aggregate([
    {
      $match: {
        hostelId: new mongoose.Types.ObjectId(hostelId),
      },
    },
    {
      $group: {
        _id: "$hostelId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (!result.length) {
    await Hostel.findByIdAndUpdate(hostelId, {
      $set: {
        rating: 0,
        reviewCount: 0,
      },
    });

    return;
  }

  await Hostel.findByIdAndUpdate(hostelId, {
    $set: {
      rating: Number(result[0].averageRating.toFixed(1)),
      reviewCount: result[0].reviewCount,
    },
  });
};

// Get all reviews for a hostel
exports.getHostelReviews = async (req, res) => {
  try {
    const { hostelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({
        message: "Invalid hostel ID",
      });
    }

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const reviews = await Review.find({ hostelId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("getHostelReviews error:", error);

    return res.status(500).json({
      message: "Failed to load hostel reviews",
    });
  }
};

// Get logged-in student's reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.user.id,
    })
      .populate("hostelId", "propertyTitle city image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("getMyReviews error:", error);

    return res.status(500).json({
      message: "Failed to load your reviews",
    });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      hostelId,
      rating,
      comment = "",
    } = req.body;

    if (!hostelId || rating === undefined) {
      return res.status(400).json({
        message: "hostelId and rating are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({
        message: "Invalid hostel ID",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    // Student must have stayed in the hostel
    const eligibleBooking = await Booking.findOne({
      userId,
      hostelId,
      status: {
        $in: ["CheckedIn", "Active", "Completed"],
      },
    });

    if (!eligibleBooking) {
      return res.status(403).json({
        message:
          "You can review a hostel only after checking in or completing your stay",
      });
    }

    const existingReview = await Review.findOne({
      userId,
      hostelId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this hostel",
      });
    }

    const review = await Review.create({
      userId,
      hostelId,
      rating: numericRating,
      comment: String(comment).trim(),
    });

    await syncHostelRating(hostelId);

    await safeAdminNotifications({
      type: "review",
      title: "New Review Received",
      text: `A student submitted a ${numericRating}-star review for a hostel.`,
      link: `/admin/reviews/${review._id}`,
      entityId: review._id,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name")
      .populate("hostelId", "propertyTitle city image");

    return res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("createReview error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this hostel",
      });
    }

    return res.status(500).json({
      message: "Failed to add review",
    });
  }
};

// Update own review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = numericRating;
    }

    if (comment !== undefined) {
      review.comment = String(comment).trim();
    }

    await review.save();

    await syncHostelRating(review.hostelId);

    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name")
      .populate("hostelId", "propertyTitle city image");

    return res.status(200).json({
      message: "Review updated successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("updateReview error:", error);

    return res.status(500).json({
      message: "Failed to update review",
    });
  }
};

// Delete own review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    await syncHostelRating(review.hostelId);

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("deleteReview error:", error);

    return res.status(500).json({
      message: "Failed to delete review",
    });
  }
};