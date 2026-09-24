import api from "../api/axios";

export const getHostelReviews = (hostelId, params = {}) =>
  api.get(`/reviews/hostel/${hostelId}`, { params });

export const createReview = (data) => api.post("/reviews", data);
export const updateReview = (id, data) => api.patch(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
