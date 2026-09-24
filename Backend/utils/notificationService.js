const Notification = require("../models/Notification");
const Admin = require("../models/Admin");

async function createStudentNotification({
  userId,
  type = "system",
  title = "Notification",
  text,
  link = "",
  entityId = null,
}) {
  if (!userId || !text) return null;

  return Notification.create({
    recipientType: "student",
    userId,
    type,
    title,
    text,
    link,
    entityId,
    read: false,
  });
}

async function createAdminNotifications({
  type = "system",
  title = "Notification",
  text,
  link = "",
  entityId = null,
}) {
  if (!text) return [];

  const admins = await Admin.find({}).select("_id").lean();

  if (!admins.length) return [];

  return Notification.insertMany(
    admins.map((admin) => ({
      recipientType: "admin",
      adminId: admin._id,
      type,
      title,
      text,
      link,
      entityId,
      read: false,
    }))
  );
}

async function safeStudentNotification(payload) {
  try {
    await createStudentNotification(payload);
  } catch (error) {
    console.error("Student notification error:", error);
  }
}

async function safeAdminNotifications(payload) {
  try {
    await createAdminNotifications(payload);
  } catch (error) {
    console.error("Admin notification error:", error);
  }
}

module.exports = {
  createStudentNotification,
  createAdminNotifications,
  safeStudentNotification,
  safeAdminNotifications,
};
