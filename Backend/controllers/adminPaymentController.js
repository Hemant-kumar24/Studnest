const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");

const getAdminId = (req) => req.user?.id;

// GET /api/admin/payments
exports.getAllPayments = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    const filter = {};

    // Status filter
    if (status) {
      const statusMap = {
        Successful: "Paid",
        Pending: "Pending",
        Failed: "Failed",
        Refunded: "Refunded",
        Created: "Created",
        Paid: "Paid",
      };

      if (statusMap[status]) {
        filter.status = statusMap[status];
      }
    }

    // Search filter
    if (search?.trim()) {
      const searchText = search.trim();

      const searchRegex = new RegExp(
        searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      const [users, bookings] = await Promise.all([
        User.find({
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
          ],
        }).select("_id"),

        Booking.find({
          $or: [
            { _id: mongoose.isValidObjectId(searchText) ? searchText : null },
          ].filter(Boolean),
        }).select("_id"),
      ]);

      const userIds = users.map((user) => user._id);
      const bookingIds = bookings.map((booking) => booking._id);

      filter.$or = [
        { razorpayOrderId: searchRegex },
        { razorpayPaymentId: searchRegex },
        { userId: { $in: userIds } },
        { bookingId: { $in: bookingIds } },
      ];
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("userId", "name email phone profileImage")
        .populate({
          path: "bookingId",
          select:
            "hostelId roomId amount status paymentStatus startDate endDate duration",
          populate: [
            {
              path: "hostelId",
              select: "propertyTitle address city",
            },
            {
              path: "roomId",
              select: "roomNumber roomType price",
            },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Payment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      payments,
      data: payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load payments.",
      error: error.message,
    });
  }
};

// GET /api/admin/payments/:id
exports.getPaymentById = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    const payment = await Payment.findById(id)
      .populate("userId", "name email phone profileImage")
      .populate({
        path: "bookingId",
        select:
          "hostelId roomId amount status paymentStatus startDate endDate duration createdAt",
        populate: [
          {
            path: "hostelId",
            select: "propertyTitle address city",
          },
          {
            path: "roomId",
            select: "roomNumber roomType price",
          },
        ],
      })
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
      data: payment,
    });
  } catch (error) {
    console.error("Admin payment details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load payment details.",
      error: error.message,
    });
  }
};

// GET /api/admin/payments/revenue-summary
exports.getRevenueSummary = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const [
      totalTransactions,
      pendingTransactions,
      paidAmount,
      refundedAmount,
      failedTransactions,
    ] = await Promise.all([
      Payment.countDocuments({}),

      Payment.countDocuments({
        $in: undefined,
      }).catch(() => 0),

      Payment.aggregate([
        { $match: { status: "Paid" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      Payment.aggregate([
        { $match: { status: "Refunded" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      Payment.countDocuments({
        status: "Failed",
      }),
    ]);

    const pendingCount = await Payment.countDocuments({
      status: { $in: ["Pending", "Created"] },
    });

    const totalRevenue = paidAmount[0]?.total || 0;
    const refunded = refundedAmount[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        totalRevenue,
        successfulRevenue: totalRevenue,
        pendingTransactions: pendingCount,
        failedTransactions,
        refundedAmount: refunded,
      },
    });
  } catch (error) {
    console.error("Admin revenue summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load revenue summary.",
      error: error.message,
    });
  }
};