
import api from "../api/axios";

// ==========================================
// STUDENT - GET MY BOOKINGS
// ==========================================

export const getMyBookings = (params = {}) =>
  api.get("/bookings/my", { params });

// ==========================================
// STUDENT - GET MY NOTIFICATIONS
// Backend: GET /api/notifications/my
// ==========================================

export const getMyNotifications = (params = {}) =>
  api.get("/notifications/my", { params });

// ==========================================
// STUDENT - GET UNREAD NOTIFICATION COUNT
// ==========================================

export const getUnreadNotificationCount = () =>
  api.get("/notifications/unread-count");

// ==========================================
// STUDENT - GET MY COMPLAINTS
// ==========================================

export const getMyComplaints = (params = {}) =>
  api.get("/complaints/my", { params });
