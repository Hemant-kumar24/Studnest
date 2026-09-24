import api from "../api/axios";

export const createBooking = (data) =>
  api.post("/bookings", data);

export const getBookingById = (id) =>
  api.get(`/bookings/my/${id}`);

export const getMyBookings = (params = {}) =>
  api.get("/bookings/my", { params });

export const cancelBooking = (id, data = {}) =>
  api.patch(`/bookings/my/${id}/cancel`, data);