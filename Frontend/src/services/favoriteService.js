
import api from "../api/axios";

// ==========================================
// HELPER - NORMALIZE FAVORITES RESPONSE
// ==========================================

const toFavoriteList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.favorites)) return payload.favorites;

  return [];
};

// ==========================================
// HELPER - GET HOSTEL ID FROM FAVORITE
// ==========================================

const getHostelKey = (item) => {
  const hostel = item?.hostelId ?? item?.hostel ?? item;

  if (typeof hostel === "string") {
    return hostel;
  }

  return String(hostel?._id ?? "");
};

// ==========================================
// STUDENT - GET MY FAVORITES
// ==========================================

export const getMyFavorites = async (params = {}) => {
  const response = await api.get("/user/favorites", { params });

  return {
    ...response,
    data: {
      data: toFavoriteList(response.data),
    },
  };
};

// ==========================================
// STUDENT - ADD FAVORITE
// Backend: POST /api/user/favorites
// Body: { hostelId }
// ==========================================

export const addFavorite = (hostelId) =>
  api.post("/user/favorites", { hostelId });

// ==========================================
// STUDENT - REMOVE FAVORITE
// Backend: DELETE /api/user/favorites/:hostelId
// ==========================================

export const removeFavorite = (hostelId) =>
  api.delete(`/user/favorites/${hostelId}`);

// ==========================================
// STUDENT - CHECK FAVORITE
// No separate check route required
// ==========================================

export const checkFavorite = async (hostelId) => {
  const response = await api.get("/user/favorites");
  const favorites = toFavoriteList(response.data);
  const targetId = String(hostelId);

  return {
    ...response,
    data: {
      data: {
        isFavorite: favorites.some(
          (item) => getHostelKey(item) === targetId
        ),
      },
    },
  };
};
