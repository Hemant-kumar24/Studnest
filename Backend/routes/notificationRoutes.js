const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  getMyUnreadCount,
  markMyNotificationRead,
  markAllMyNotificationsRead,
  deleteMyNotification,
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/authMiddleware");

// ==========================================
// STUDENT NOTIFICATIONS
// ==========================================

// Get my notifications
router.get(
  "/my",
  authMiddleware,
  getMyNotifications
);

// Get unread notification count
router.get(
  "/unread-count",
  authMiddleware,
  getMyUnreadCount
);

// Mark one notification as read
router.patch(
  "/:id/read",
  authMiddleware,
  markMyNotificationRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  authMiddleware,
  markAllMyNotificationsRead
);

// Delete notification
router.delete(
  "/:id",
  authMiddleware,
  deleteMyNotification
);

module.exports = router;