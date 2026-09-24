import api from "../api/axios";

// ==========================================
// ADMIN - GET ALL BOOKINGS
// ==========================================

export const getAdminBookings = (
  params = {}
) => {
  return api.get("/bookings/admin", {
    params,
  });
};

// ==========================================
// ADMIN - GET SINGLE BOOKING
// ==========================================

export const getAdminBooking = (id) => {
  return api.get(
    `/bookings/my/${id}`
  );
};

// ==========================================
// ADMIN - APPROVE BOOKING
// ==========================================

export const approveBooking = (id) => {
  return api.patch(
    `/bookings/admin/${id}/approve`
  );
};

// ==========================================
// ADMIN - REJECT BOOKING
// ==========================================

export const rejectBooking = (
  id,
  reason = ""
) => {
  return api.patch(
    `/bookings/admin/${id}/reject`,
    {
      reason,
    }
  );
};

// ==========================================
// ADMIN - UPDATE STATUS
// ==========================================

export const updateBookingStatus = (
  id,
  status
) => {
  return api.put(
    `/bookings/admin/${id}`,
    {
      status,
    }
  );
};