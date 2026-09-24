import api from "../api/axios";

export const getAdminReviews = (params = {}) =>
  api.get("/admin/reviews", { params });

export const getAdminReview = (id) =>
  api.get(`/admin/reviews/${id}`);

export const deleteAdminReview = (id) =>
  api.delete(`/admin/reviews/${id}`);
