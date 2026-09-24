import api from "../api/axios";

export const getMyFavorites = (params = {}) => api.get("/user/favorites", { params });
export const addFavorite = (hostelId) => api.post(`/user/favorites/${hostelId}`);
export const removeFavorite = (hostelId) => api.delete(`/user/favorites/${hostelId}`);
export const checkFavorite = (hostelId) => api.get(`/user/favorites/${hostelId}`);
