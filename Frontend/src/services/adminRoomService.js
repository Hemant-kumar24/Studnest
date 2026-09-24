import api from "../api/axios";

export const getHostelRooms = (hostelId, params = {}) =>
  api.get(`/rooms/hostel/${hostelId}`, { params });

export const getRoom = (roomId) =>
  api.get(`/rooms/${roomId}`);

export const createRoom = (hostelId, data) =>
  api.post(`/rooms/hostel/${hostelId}`, data);

export const updateRoom = (roomId, data) =>
  api.put(`/rooms/${roomId}`, data);

export const deleteRoom = (roomId) =>
  api.delete(`/rooms/${roomId}`);

export const updateRoomAvailability = (roomId, data) =>
  api.patch(`/rooms/${roomId}/availability`, data);
