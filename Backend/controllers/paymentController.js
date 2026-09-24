const crypto = require("crypto");
const mongoose = require("mongoose");

const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Room = require("../models/Room");
const Hostel = require("../models/Hostel");
const { safeStudentNotification, safeAdminNotifications } = require("../utils/notificationService");


function getUserId(req) {
  return req.user?.id || req.user?._id || req.user?.userId;
}

// Sync hostel room counters from actual Room documents.
async function syncHostelRooms(hostelId) {
  const [totalRooms, availableRooms] = await Promise.all([
    Room.countDocuments({
      hostelId,
    }),

    Room.countDocuments({
      hostelId,
      status: "available",
      availableBeds: { $gt: 0 },
    }),
  ]);

  await Hostel.findByIdAndUpdate(hostelId, {
    $set: {
      totalRooms,
      availableRooms,
    },
  });
}

// Create Razorpay order for an existing booking.
exports.createBookingOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { bookingId } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!["Pending", "Approved"].includes(booking.status)) {
      return res.status(400).json({
        message: `Payment cannot be started for a ${booking.status} booking`,
      });
    }

    if (booking.paymentStatus === "Paid") {
      return res.status(409).json({
        message: "Booking is already paid",
      });
    }

    if (!booking.amount || booking.amount <= 0) {
      return res.status(400).json({
        message: "Invalid booking amount",
      });
    }

    // If an unpaid order already exists for this booking,
    // reuse it instead of creating unnecessary Razorpay orders.
    const existingPayment = await Payment.findOne({
      bookingId: booking._id,
      userId,
      status: { $in: ["Created", "Pending"] },
      razorpayOrderId: { $exists: true, $ne: "" },
    }).sort({ createdAt: -1 });

    if (existingPayment) {
      return res.status(200).json({
        message: "Existing payment order found",
        order: {
          id: existingPayment.razorpayOrderId,
          amount: Math.round(existingPayment.amount * 100),
          currency: existingPayment.currency || "INR",
          key: process.env.RAZORPAY_KEY_ID,
        },
        bookingId: booking._id,
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(booking.amount * 100),
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: String(booking._id),
        userId: String(userId),
      },
    });

    await Payment.create({
      userId,
      bookingId: booking._id,
      amount: booking.amount,
      currency: "INR",
      razorpayOrderId: order.id,
      status: "Created",
    });

    return res.status(201).json({
      message: "Payment order created",

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },

      bookingId: booking._id,
    });
  } catch (error) {
    console.error("createBookingOrder error:", error);

    return res.status(500).json({
      message: "Failed to create payment order",
    });
  }
};

// Verify Razorpay payment and confirm booking.
exports.verifyBookingPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = getUserId(req);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Razorpay payment details are required",
      });
    }

    if (
      !bookingId ||
      !mongoose.Types.ObjectId.isValid(bookingId)
    ) {
      return res.status(400).json({
        message: "Valid booking ID is required",
      });
    }

    // Find payment order belonging to this user.
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment order not found",
      });
    }

    // Make sure booking matches the payment.
    if (String(payment.bookingId) !== String(bookingId)) {
      return res.status(400).json({
        message: "Booking does not match payment",
      });
    }

    // Already verified payment.
    if (payment.status === "Paid") {
      const existingBooking = await Booking.findOne({
        _id: payment.bookingId,
        userId,
      });

      return res.status(200).json({
        message: "Payment already verified",

        payment: {
          id: payment._id,
          orderId: payment.razorpayOrderId,
          paymentId: payment.razorpayPaymentId,
          amount: payment.amount,
          status: payment.status,
          paidAt: payment.paidAt,
        },

        booking: existingBooking
          ? {
              id: existingBooking._id,
              status: existingBooking.status,
              paymentStatus: existingBooking.paymentStatus,
            }
          : null,
      });
    }

    // Verify Razorpay signature.
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const razorpaySecret = process.env.RAZORPAY_SECRET;

    if (!razorpaySecret) {
      console.error("RAZORPAY_SECRET is missing");

      return res.status(500).json({
        message: "Payment configuration error",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    const signaturesMatch =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!signaturesMatch) {
      payment.status = "Failed";
      payment.failureReason = "Invalid Razorpay signature";

      await payment.save();

      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    /*
     * Everything below should succeed together:
     *
     * Payment → Paid
     * Booking → Confirmed
     * Room → availableBeds - 1
     */
    session.startTransaction();

    const booking = await Booking.findOne({
      _id: payment.bookingId,
      userId,
    }).session(session);

    if (!booking) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Prevent payment against an already cancelled/rejected booking.
    if (["Cancelled", "Rejected"].includes(booking.status)) {
      await session.abortTransaction();

      return res.status(400).json({
        message: `Payment cannot be completed for a ${booking.status} booking`,
      });
    }

    // If booking somehow became paid between requests,
    // don't decrement the room again.
    if (booking.paymentStatus === "Paid") {
      await session.commitTransaction();

      return res.status(200).json({
        message: "Booking is already paid",
        booking: {
          id: booking._id,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        },
      });
    }

    const room = await Room.findOne({
      _id: booking.roomId,
      hostelId: booking.hostelId,
    }).session(session);

    if (!room) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Re-check availability at the moment payment is confirmed.
    if (
      room.status !== "available" ||
      room.availableBeds <= 0
    ) {
      await session.abortTransaction();

      payment.status = "Failed";
      payment.failureReason =
        "No beds available at payment confirmation";

      await payment.save();

      return res.status(409).json({
        message:
          "This room is no longer available. Payment could not be confirmed.",
      });
    }

    // Reserve one bed.
    room.availableBeds -= 1;

    if (room.availableBeds === 0) {
      room.status = "full";
    } else {
      room.status = "available";
    }

    await room.save({ session });

    // Update payment.
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = "Paid";
    payment.paidAt = new Date();

    await payment.save({ session });

    // Update booking.
    booking.paymentStatus = "Paid";
    booking.status = "Confirmed";

    await booking.save({ session });

    await session.commitTransaction();

    // Sync hostel counters after successful transaction.
    await syncHostelRooms(booking.hostelId);

    await safeStudentNotification({
      userId,
      type: "payment",
      title: "Payment Successful",
      text: `Payment of ₹${booking.amount} was successful and your booking is confirmed.`,
      link: `/student/bookings/${booking._id}`,
      entityId: booking._id,
    });

    await safeAdminNotifications({
      type: "payment",
      title: "Payment Received",
      text: `A student has successfully paid ₹${booking.amount} for a booking.`,
      link: `/admin/bookings/${booking._id}`,
      entityId: booking._id,
    });

    return res.status(200).json({
      message: "Payment verified successfully",

      payment: {
        id: payment._id,
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
      },

      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    try {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
    } catch (transactionError) {
      console.error(
        "Transaction rollback error:",
        transactionError
      );
    }

    console.error("verifyBookingPayment error:", error);

    return res.status(500).json({
      message: "Payment verification failed",
    });
  } finally {
    await session.endSession();
  }
};

// Student payment history.
exports.getMyPayments = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const payments = await Payment.find({ userId })
      .populate(
        "bookingId",
        "hostelId roomId amount status paymentStatus"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("getMyPayments error:", error);

    return res.status(500).json({
      message: "Failed to fetch payment history",
    });
  }
};