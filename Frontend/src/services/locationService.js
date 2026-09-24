import api from "../api/axios";

// ============================================
// GET MY SAVED LOCATION
// ============================================

export const getMyLocation = async () => {
  const response = await api.get(
    "/user/location"
  );

  return response.data;
};

// ============================================
// SAVE MY LOCATION
// ============================================

export const saveMyLocation = async (
  latitude,
  longitude
) => {
  const response = await api.put(
    "/user/location",
    {
      latitude,
      longitude,
    }
  );

  return response.data;
};

// ============================================
// GET NEARBY HOSTELS
// ============================================

export const getNearbyHostels = async (
  params = {}
) => {
  const response = await api.get(
    "/user/nearby-hostels",
    {
      params,
    }
  );

  return response.data;
};