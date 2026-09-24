import api from "../api/axios";

// ==========================================
// CREATE COMPLAINT
// POST /api/complaints
// ==========================================

export const createComplaint = (data) =>
  api.post("/complaints", data);

// ==========================================
// GET MY COMPLAINTS
// GET /api/complaints/my
// ==========================================

export const getMyComplaints = (params = {}) =>
  api.get("/complaints/my", {
    params,
  });

// ==========================================
// GET SINGLE MY COMPLAINT
// GET /api/complaints/my/:id
// ==========================================

export const getComplaintById = (id) =>
  api.get(`/complaints/my/${id}`);

// ==========================================
// DELETE MY COMPLAINT
// DELETE /api/complaints/my/:id
// ==========================================

export const deleteComplaint = (id) =>
  api.delete(`/complaints/my/${id}`);