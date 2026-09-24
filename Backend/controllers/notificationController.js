const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const getPagination = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

const getNotifications = async (req, res, recipientType, ownerField, ownerId) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = { recipientType, [ownerField]: ownerId };

    if (req.query.read === "true") filter.read = true;
    if (req.query.read === "false") filter.read = false;

    if (req.query.type) filter.type = req.query.type;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, read: false }),
    ]);

    return res.status(200).json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        pages: total ? Math.ceil(total / limit) : 0,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ message: "Failed to load notifications" });
  }
};

exports.getMyNotifications = (req, res) =>
  getNotifications(req, res, "student", "userId", req.user.id);

exports.getAdminNotifications = (req, res) =>
  getNotifications(req, res, "admin", "adminId", req.user.id);

const getUnreadCount = async (req, res, recipientType, ownerField, ownerId) => {
  try {
    const count = await Notification.countDocuments({
      recipientType,
      [ownerField]: ownerId,
      read: false,
    });

    return res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("Get unread notification count error:", error);
    return res.status(500).json({ message: "Failed to load unread notification count" });
  }
};

exports.getMyUnreadCount = (req, res) =>
  getUnreadCount(req, res, "student", "userId", req.user.id);

exports.getAdminUnreadCount = (req, res) =>
  getUnreadCount(req, res, "admin", "adminId", req.user.id);

const markRead = async (req, res, recipientType, ownerField, ownerId) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientType, [ownerField]: ownerId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

exports.markMyNotificationRead = (req, res) =>
  markRead(req, res, "student", "userId", req.user.id);

exports.markAdminNotificationRead = (req, res) =>
  markRead(req, res, "admin", "adminId", req.user.id);

const markAllRead = async (req, res, recipientType, ownerField, ownerId) => {
  try {
    const result = await Notification.updateMany(
      { recipientType, [ownerField]: ownerId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ message: "Failed to mark all notifications as read" });
  }
};

exports.markAllMyNotificationsRead = (req, res) =>
  markAllRead(req, res, "student", "userId", req.user.id);

exports.markAllAdminNotificationsRead = (req, res) =>
  markAllRead(req, res, "admin", "adminId", req.user.id);

const deleteNotification = async (req, res, recipientType, ownerField, ownerId) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      recipientType,
      [ownerField]: ownerId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ message: "Failed to delete notification" });
  }
};

exports.deleteMyNotification = (req, res) =>
  deleteNotification(req, res, "student", "userId", req.user.id);

exports.deleteAdminNotification = (req, res) =>
  deleteNotification(req, res, "admin", "adminId", req.user.id);
