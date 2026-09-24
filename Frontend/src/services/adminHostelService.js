import api from "../api/axios";

export const getAdminHostels = (params = {}) =>
  api.get("/admin/hostels", {
    params,
  });

export const getAdminHostel = (id) =>
  api.get(`/admin/hostels/${id}`);

export const createHostel = (formData) =>
  api.post("/admin/hostels", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateHostel = (id, formData) =>
  api.put(`/admin/hostels/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteHostel = (id) =>
  api.delete(`/admin/hostels/${id}`);

export const updateHostelSeats = (
  id,
  data
) =>
  api.patch(
    `/admin/hostels/${id}/seats`,
    data
  );

export const approveHostel = (id) =>
  api.patch(`/admin/hostels/${id}/approve`);

export const rejectHostel = (
  id,
  reason = ""
) =>
  api.patch(
    `/admin/hostels/${id}/reject`,
    { reason }
  );

export const uploadHostelImages = (
  id,
  formData
) =>
  api.post(
    `/admin/hostels/${id}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );