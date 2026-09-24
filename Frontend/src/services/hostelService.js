import api from "../api/axios";

export const getHostels = (params = {}) => api.get("/hostels", { params });
export const getHostelById = (id) => api.get(`/hostels/${id}`);
export const getNearbyHostels = (params = {}) => api.get("/hostels/nearby", { params });
