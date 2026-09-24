const express = require("express");

const router = express.Router();

const {
  getHostelReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middlewares/authMiddleware");

// ==========================================
// PUBLIC - HOSTEL REVIEWS
// ==========================================

router.get(
  "/hostel/:hostelId",
  getHostelReviews
);

// ==========================================
// PROTECTED - MY REVIEWS
// ==========================================

router.get(
  "/my",
  authMiddleware,
  getMyReviews
);

// ==========================================
// PROTECTED - CREATE REVIEW
// ==========================================

router.post(
  "/",
  authMiddleware,
  createReview
);

// ==========================================
// PROTECTED - UPDATE REVIEW
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  updateReview
);

// ==========================================
// PROTECTED - DELETE REVIEW
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

module.exports = router;