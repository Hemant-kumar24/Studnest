const express = require("express");

const router = express.Router();

const {
  getAllReviews,
  getReviewById,
  deleteReview,
} = require(
  "../controllers/adminReviewController"
);

const adminAuth = require(
  "../middlewares/adminAuth"
);

// ==========================================
// GET ALL REVIEWS
// ==========================================

router.get(
  "/",
  adminAuth,
  getAllReviews
);

// ==========================================
// GET SINGLE REVIEW
// ==========================================

router.get(
  "/:id",
  adminAuth,
  getReviewById
);

// ==========================================
// DELETE REVIEW
// ==========================================

router.delete(
  "/:id",
  adminAuth,
  deleteReview
);

module.exports = router;