const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const {
  getOverview,
  getFavorites,
  addFavorite,
  removeFavorite,
  getMyReviews,
  addReview,
  getNotifications,
  markNotificationRead,
} = require("../controllers/dashboardController");

// ============================================
// PROFILE
// ============================================

router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateUserProfile
);

// ============================================
// DASHBOARD OVERVIEW
// ============================================

router.get(
  "/overview",
  authMiddleware,
  getOverview
);

// ============================================
// FAVORITES
// ============================================

router.get(
  "/favorites",
  authMiddleware,
  getFavorites
);

router.post(
  "/favorites",
  authMiddleware,
  addFavorite
);

router.delete(
  "/favorites/:hostelId",
  authMiddleware,
  removeFavorite
);

// ============================================
// REVIEWS
// ============================================

router.get(
  "/reviews",
  authMiddleware,
  getMyReviews
);

router.post(
  "/reviews",
  authMiddleware,
  addReview
);

// ============================================
// NOTIFICATIONS
// ============================================

router.get(
  "/notifications",
  authMiddleware,
  getNotifications
);

router.patch(
  "/notifications/:id/read",
  authMiddleware,
  markNotificationRead
);

module.exports = router;