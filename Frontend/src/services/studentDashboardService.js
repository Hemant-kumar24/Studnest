import api from "../api/axios";

export const getMyBookings = (params = {}) =>
  api.get("/bookings/my", { params });

export const getMyNotifications = (params = {}) =>
  api.get("/notifications", { params });

export const getUnreadNotificationCount = () =>
  api.get("/notifications/unread-count");

export const getMyComplaints = (params = {}) =>
  api.get("/complaints/my", { params });
