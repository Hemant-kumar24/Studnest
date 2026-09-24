const mongoose = require("mongoose");

const Review = require("../models/Review");
const Hostel = require("../models/Hostel");

// ==========================================
// SYNC HOSTEL RATING
// ==========================================

const syncHostelRating = async (hostelId) => {
  const result = await Review.aggregate([
    {
      $match: {
        hostelId: new mongoose.Types.ObjectId(
          hostelId
        ),
      },
    },
    {
      $group: {
        _id: "$hostelId",

        averageRating: {
          $avg: "$rating",
        },

        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (!result.length) {
    await Hostel.findByIdAndUpdate(
      hostelId,
      {
        $set: {
          rating: 0,
          reviewCount: 0,
        },
      }
    );

    return;
  }

  await Hostel.findByIdAndUpdate(
    hostelId,
    {
      $set: {
        rating: Number(
          result[0].averageRating.toFixed(1)
        ),

        reviewCount:
          result[0].reviewCount,
      },
    }
  );
};

// ==========================================
// GET ALL REVIEWS
// ==========================================

exports.getAllReviews = async (
  req,
  res
) => {
  try {
    const {
      rating,
      hostelId,
    } = req.query;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      50
    );

    const skip =
      (page - 1) * limit;

    // ======================================
    // FILTER
    // ======================================

    const filter = {};

    // Rating filter
    if (rating !== undefined && rating !== "") {
      const numericRating =
        Number(rating);

      if (
        !Number.isInteger(
          numericRating
        ) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          message:
            "Rating must be between 1 and 5",
        });
      }

      filter.rating =
        numericRating;
    }

    // Hostel filter
    if (
      hostelId !== undefined &&
      hostelId !== ""
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          hostelId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid hostel ID",
        });
      }

      filter.hostelId =
        hostelId;
    }

    // ======================================
    // FETCH DATA
    // ======================================

    const [
      reviews,
      total,
    ] = await Promise.all([
      Review.find(filter)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "hostelId",
          "propertyTitle city address image images rating reviewCount"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Review.countDocuments(filter),
    ]);

    const pages =
      total > 0
        ? Math.ceil(
            total / limit
          )
        : 0;

    return res.status(200).json({
      count: reviews.length,

      reviews,

      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error(
      "getAllReviews error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load reviews",
    });
  }
};

// ==========================================
// GET SINGLE REVIEW
// ==========================================

exports.getReviewById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid review ID",
      });
    }

    const review =
      await Review.findById(id)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "hostelId",
          "propertyTitle city address image images rating reviewCount"
        );

    if (!review) {
      return res.status(404).json({
        message:
          "Review not found",
      });
    }

    return res.status(200).json({
      review,
    });
  } catch (error) {
    console.error(
      "getReviewById error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load review",
    });
  }
};

// ==========================================
// DELETE REVIEW
// ==========================================

exports.deleteReview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid review ID",
      });
    }

    const review =
      await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message:
          "Review not found",
      });
    }

    const hostelId =
      review.hostelId;

    await Review.findByIdAndDelete(
      id
    );

    // Recalculate hostel rating
    await syncHostelRating(
      hostelId
    );

    return res.status(200).json({
      message:
        "Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "deleteReview error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete review",
    });
  }
};