
import api from "../api/axios";

// ==========================================
// GET ALL HOSTELS
// ==========================================

export const getHostels = (params = {}) =>
  api.get("/hostels", { params });

// ==========================================
// GET HOSTEL BY ID
// ==========================================

export const getHostelById = (id) =>
  api.get(`/hostels/${id}`);

// ==========================================
// GET NEARBY HOSTELS
// Backend: GET /api/user/nearby-hostels
// Requires login
// ==========================================

export const getNearbyHostels = (params = {}) =>
  api.get("/user/nearby-hostels", { params });
