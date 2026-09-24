const express = require("express");

const router = express.Router();

const {
  createBookingOrder,
  verifyBookingPayment,
  getMyPayments,
} = require("../controllers/paymentController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/booking/order", authMiddleware, createBookingOrder);

router.post("/booking/verify", authMiddleware, verifyBookingPayment);

router.get("/my", authMiddleware, getMyPayments);

module.exports = router;