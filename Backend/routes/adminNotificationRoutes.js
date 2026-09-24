const express = require("express");

const router = express.Router();

const {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
} = require("../controllers/notificationController");

const adminAuth = require("../middlewares/adminAuth");

// ==========================================
// ADMIN NOTIFICATIONS
// ==========================================

// Get admin notifications
router.get(
  "/",
  adminAuth,
  getAdminNotifications
);

// Get unread count
router.get(
  "/unread-count",
  adminAuth,
  getAdminUnreadCount
);

// Mark one as read
router.patch(
  "/:id/read",
  adminAuth,
  markAdminNotificationRead
);

// Mark all as read
router.patch(
  "/read-all",
  adminAuth,
  markAllAdminNotificationsRead
);

// Delete notification
router.delete(
  "/:id",
  adminAuth,
  deleteAdminNotification
);

module.exports = router;