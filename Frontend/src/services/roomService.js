import api from "../api/axios";

export const getHostelRooms = (hostelId, params = {}) =>
  api.get(`/rooms/hostel/${hostelId}`, { params });

export const getRoomById = (roomId) =>
  api.get(`/rooms/${roomId}`);
