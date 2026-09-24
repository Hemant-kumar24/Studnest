import api from "../api/axios";

// ==========================================
// GET ALL ADMIN COMPLAINTS
// GET /api/admin/complaints
// ==========================================

export const getAdminComplaints = (
  params = {}
) =>
  api.get("/admin/complaints", {
    params,
  });

// ==========================================
// GET SINGLE ADMIN COMPLAINT
// GET /api/admin/complaints/:id
// ==========================================

export const getAdminComplaint = (id) =>
  api.get(`/admin/complaints/${id}`);

// ==========================================
// UPDATE ADMIN COMPLAINT
// PUT /api/admin/complaints/:id
// ==========================================

export const updateComplaint = (
  id,
  data
) =>
  api.put(
    `/admin/complaints/${id}`,
    data
  );

// ==========================================
// DELETE ADMIN COMPLAINT
// DELETE /api/admin/complaints/:id
// ==========================================

export const deleteAdminComplaint = (id) =>
  api.delete(
    `/admin/complaints/${id}`
  );