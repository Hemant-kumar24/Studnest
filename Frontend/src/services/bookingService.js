
import api from "../api/axios";

// ==========================================
// STUDENT - CREATE BOOKING
// ==========================================

export const createBooking = (data) =>
  api.post("/bookings", data);

// ==========================================
// STUDENT - GET MY BOOKINGS
// ==========================================

export const getMyBookings = (params = {}) =>
  api.get("/bookings/my", { params });

// ==========================================
// STUDENT - GET SINGLE BOOKING
// ==========================================

export const getBookingById = (id) =>
  api.get(`/bookings/my/${id}`);

// ==========================================
// STUDENT - CANCEL BOOKING
// ==========================================

export const cancelBooking = (id, data = {}) =>
  api.patch(`/bookings/my/${id}/cancel`, data);

// ==========================================
// ADMIN - GET ALL BOOKINGS
// ==========================================

export const getAdminBookings = (params = {}) =>
  api.get("/bookings/admin", { params });

// ==========================================
// ADMIN - GET SINGLE BOOKING
// ==========================================

export const getAdminBooking = (id) =>
  api.get(`/bookings/admin/${id}`);

// ==========================================
// ADMIN - APPROVE BOOKING
// ==========================================

export const approveBooking = (id) =>
  api.patch(`/bookings/admin/${id}/approve`);

// ==========================================
// ADMIN - REJECT BOOKING
// ==========================================

export const rejectBooking = (id, reason = "") =>
  api.patch(`/bookings/admin/${id}/reject`, { reason });

// ==========================================
// ADMIN - UPDATE BOOKING STATUS
// ==========================================

export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/admin/${id}`, { status });
