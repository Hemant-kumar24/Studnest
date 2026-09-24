import api from "../api/axios";

export const createBookingOrder = (data) =>
  api.post("/payment/booking/order", data);

export const verifyBookingPayment = (data) =>
  api.post("/payment/booking/verify", data);

export const getMyPayments = (params = {}) =>
  api.get("/payment/my", { params });
