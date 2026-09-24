const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hostel = require("../models/Hostel");
const { safeStudentNotification, safeAdminNotifications } = require("../utils/notificationService");


// ==========================================
// SYNC HOSTEL ROOM COUNTERS
// ==========================================

const syncHostelRooms = async (hostelId) => {
  const [totalRooms, availableRooms] =
    await Promise.all([
      Room.countDocuments({
        hostelId,
      }),

      Room.countDocuments({
        hostelId,
        status: "available",
        availableBeds: { $gt: 0 },
      }),
    ]);

  await Hostel.findByIdAndUpdate(
    hostelId,
    {
      $set: {
        totalRooms,
        availableRooms,
      },
    }
  );
};

// ==========================================
// CREATE BOOKING
// ==========================================

exports.createBooking = async (req, res) => {
  try {
    const {
      hostelId,
      roomId,
      duration,
      startDate,
      endDate,
      note,
    } = req.body;

    if (!hostelId || !roomId) {
      return res.status(400).json({
        msg: "Hostel and room are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(hostelId) ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      return res.status(400).json({
        msg: "Invalid hostel or room ID",
      });
    }

    const bookingDuration =
      Number(duration || 1);

    if (
      !Number.isFinite(bookingDuration) ||
      bookingDuration < 1
    ) {
      return res.status(400).json({
        msg: "Duration must be at least 1 month",
      });
    }

    const bookingStartDate = startDate
      ? new Date(startDate)
      : new Date();

    if (
      Number.isNaN(
        bookingStartDate.getTime()
      )
    ) {
      return res.status(400).json({
        msg: "Invalid start date",
      });
    }

    let bookingEndDate;

    if (endDate) {
      bookingEndDate = new Date(endDate);

      if (
        Number.isNaN(
          bookingEndDate.getTime()
        )
      ) {
        return res.status(400).json({
          msg: "Invalid end date",
        });
      }

      if (
        bookingEndDate <=
        bookingStartDate
      ) {
        return res.status(400).json({
          msg: "End date must be after start date",
        });
      }
    } else {
      bookingEndDate =
        new Date(bookingStartDate);

      bookingEndDate.setMonth(
        bookingEndDate.getMonth() +
          bookingDuration
      );
    }

    const hostel =
      await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        msg: "Hostel not found",
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      hostelId,
    });

    if (!room) {
      return res.status(404).json({
        msg: "Room not found in this hostel",
      });
    }

    if (room.status !== "available") {
      return res.status(400).json({
        msg: `Room is currently ${room.status}`,
      });
    }

    if (
      Number(room.availableBeds) <= 0
    ) {
      return res.status(400).json({
        msg: "No beds are available in this room",
      });
    }

    const existingBooking =
      await Booking.findOne({
        userId: req.user.id,
        roomId,
        status: {
          $in: [
            "Pending",
            "Approved",
            "Confirmed",
            "CheckedIn",
            "Active",
          ],
        },
      });

    if (existingBooking) {
      return res.status(409).json({
        msg: "You already have an active booking for this room",
      });
    }

    const amount =
      Number(room.price || 0) *
      bookingDuration;

    const booking =
      await Booking.create({
        userId: req.user.id,
        hostelId,
        roomId,
        roomType: room.roomType,
        duration: bookingDuration,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        amount,
        note: note?.trim() || "",
        status: "Pending",
        paymentStatus: "Pending",
      });

    await safeStudentNotification({
      userId: req.user.id,
      type: "booking",
      title: "Booking Request Submitted",
      text: "Your booking request has been submitted and is waiting for approval.",
      link: `/student/bookings/${booking._id}`,
      entityId: booking._id,
    });

    await safeAdminNotifications({
      type: "booking",
      title: "New Booking Request",
      text: "A student has submitted a new booking request.",
      link: `/admin/bookings/${booking._id}`,
      entityId: booking._id,
    });

    const populatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "userId",
          "name email phone"
        )
        .populate(
          "hostelId",
          "propertyTitle city address images image"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity availableBeds price amenities"
        );

    return res.status(201).json({
      msg: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    return res.status(500).json({
      msg: "Booking failed",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY BOOKINGS
// ==========================================

exports.getMyBookings = async (req, res) => {
  try {
    const bookings =
      await Booking.find({
        userId: req.user.id,
      })
        .populate(
          "hostelId",
          "propertyTitle city address images image"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity availableBeds price amenities"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error(
      "Get my bookings error:",
      error
    );

    return res.status(500).json({
      msg: "Error fetching your bookings",
    });
  }
};

// ==========================================
// GET SINGLE MY BOOKING
// ==========================================

exports.getMyBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findOne({
        _id: req.params.id,
        userId: req.user.id,
      })
        .populate(
          "hostelId",
          "propertyTitle city address images image"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity availableBeds price amenities"
        );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    return res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error(
      "Get booking error:",
      error
    );

    return res.status(500).json({
      msg: "Error fetching booking",
    });
  }
};

// ==========================================
// CANCEL MY BOOKING
// ==========================================

exports.cancelMyBooking = async (
  req,
  res
) => {
  try {
    const { reason } = req.body;

    const booking =
      await Booking.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    const cancellableStatuses = [
      "Pending",
      "Approved",
      "Confirmed",
    ];

    if (
      !cancellableStatuses.includes(
        booking.status
      )
    ) {
      return res.status(400).json({
        msg: `Booking cannot be cancelled because it is ${booking.status}`,
      });
    }

    if (
      booking.status === "Confirmed"
    ) {
      const room =
        await Room.findOne({
          _id: booking.roomId,
          hostelId: booking.hostelId,
        });

      if (room) {
        const currentBeds =
          Number(room.availableBeds) || 0;

        const capacity =
          Number(room.capacity) || 0;

        const newAvailableBeds =
          Math.min(
            currentBeds + 1,
            capacity
          );

        room.availableBeds =
          newAvailableBeds;

        if (
          room.status !== "maintenance" &&
          room.status !== "inactive"
        ) {
          room.status =
            newAvailableBeds > 0
              ? "available"
              : "full";
        }

        await room.save();

        await syncHostelRooms(
          booking.hostelId
        );
      }
    }

    booking.status = "Cancelled";
    booking.cancelledAt =
      new Date();

    booking.cancellationReason =
      reason?.trim() ||
      "Cancelled by student";

    await booking.save();

    await safeAdminNotifications({
      type: "booking",
      title: "Booking Cancelled",
      text: "A student has cancelled a booking.",
      link: `/admin/bookings/${booking._id}`,
      entityId: booking._id,
    });

    const updatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "hostelId",
          "propertyTitle city address images image"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity availableBeds price amenities"
        );

    return res.status(200).json({
      msg: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    return res.status(500).json({
      msg: "Cancellation failed",
    });
  }
};

// ==========================================
// ADMIN - GET ALL BOOKINGS
// ==========================================

exports.getAllBookings = async (
  req,
  res
) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      search,
    } = req.query;

    page = Math.max(
      Number(page) || 1,
      1
    );

    limit = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      100
    );

    const skip =
      (page - 1) * limit;

    // -----------------------------
    // Build filter
    // -----------------------------

    const filter = {};

    if (status) {
      filter.status = status;
    }

    // -----------------------------
    // Search
    // -----------------------------

    let bookingIds = null;

    if (
      search &&
      search.trim()
    ) {
      const keyword =
        search.trim();

      const regex = new RegExp(
        keyword,
        "i"
      );

      const [
        users,
        hostels,
      ] = await Promise.all([
        mongoose
          .model("User")
          .find({
            $or: [
              {
                name: regex,
              },
              {
                email: regex,
              },
              {
                phone: regex,
              },
            ],
          })
          .select("_id"),

        Hostel.find({
          $or: [
            {
              propertyTitle: regex,
            },
            {
              city: regex,
            },
            {
              address: regex,
            },
          ],
        }).select("_id"),
      ]);

      const userIds =
        users.map(
          (user) => user._id
        );

      const hostelIds =
        hostels.map(
          (hostel) => hostel._id
        );

      const directConditions = [
        {
          _id: mongoose.Types.ObjectId.isValid(
            keyword
          )
            ? keyword
            : null,
        },
      ].filter(
        (item) => item._id !== null
      );

      const orConditions = [
        ...directConditions,
      ];

      if (userIds.length) {
        orConditions.push({
          userId: {
            $in: userIds,
          },
        });
      }

      if (hostelIds.length) {
        orConditions.push({
          hostelId: {
            $in: hostelIds,
          },
        });
      }

      if (orConditions.length) {
        const matchingBookings =
          await Booking.find({
            $and: [
              filter,
              {
                $or: orConditions,
              },
            ],
          }).select("_id");

        bookingIds =
          matchingBookings.map(
            (booking) =>
              booking._id
          );
      } else {
        bookingIds = [];
      }
    }

    if (bookingIds !== null) {
      filter._id = {
        $in: bookingIds,
      };
    }

    // -----------------------------
    // Count
    // -----------------------------

    const total =
      await Booking.countDocuments(
        filter
      );

    // -----------------------------
    // Fetch bookings
    // -----------------------------

    const bookings =
      await Booking.find(filter)
        .populate(
          "userId",
          "name email phone"
        )
        .populate(
          "hostelId",
          "propertyTitle city address images image"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity price amenities"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    const pages =
      Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error(
      "Get all bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      msg: "Error fetching bookings",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - APPROVE BOOKING
// ==========================================

exports.approveBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    if (
      booking.status !== "Pending"
    ) {
      return res.status(400).json({
        msg: `Booking cannot be approved because it is ${booking.status}`,
      });
    }

    booking.status = "Approved";

    await booking.save();

    await safeStudentNotification({
      userId: booking.userId,
      type: "booking",
      title: "Booking Approved",
      text: "Your booking has been approved. You can continue with payment if required.",
      link: `/student/bookings/${booking._id}`,
      entityId: booking._id,
    });

    const updatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "userId",
          "name email phone"
        )
        .populate(
          "hostelId",
          "propertyTitle city address"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity price"
        );

    return res.status(200).json({
      success: true,
      msg: "Booking approved successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Approve booking error:",
      error
    );

    return res.status(500).json({
      msg: "Failed to approve booking",
    });
  }
};

// ==========================================
// ADMIN - REJECT BOOKING
// ==========================================

exports.rejectBooking = async (
  req,
  res
) => {
  try {
    const {
      reason = "",
    } = req.body;

    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    if (
      booking.status !== "Pending"
    ) {
      return res.status(400).json({
        msg: `Booking cannot be rejected because it is ${booking.status}`,
      });
    }

    booking.status = "Rejected";

    if (reason.trim()) {
      booking.cancellationReason =
        reason.trim();
    }

    await booking.save();

    await safeStudentNotification({
      userId: booking.userId,
      type: "booking",
      title: "Booking Rejected",
      text: reason?.trim() ? `Your booking was rejected: ${reason.trim()}` : "Your booking request has been rejected by the admin.",
      link: `/student/bookings/${booking._id}`,
      entityId: booking._id,
    });

    const updatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "userId",
          "name email phone"
        )
        .populate(
          "hostelId",
          "propertyTitle city address"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity price"
        );

    return res.status(200).json({
      success: true,
      msg: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Reject booking error:",
      error
    );

    return res.status(500).json({
      msg: "Failed to reject booking",
    });
  }
};

// ==========================================
// ADMIN - UPDATE BOOKING STATUS
// ==========================================

exports.updateBookingStatus = async (
  req,
  res
) => {
  try {
    const { status } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
      "Confirmed",
      "CheckedIn",
      "Active",
      "Completed",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        msg: "Invalid booking status",
      });
    }

    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    const previousStatus = booking.status;

    booking.status = status;

    if (
      status === "Cancelled"
    ) {
      booking.cancelledAt =
        new Date();
    }

    await booking.save();

    if (previousStatus !== status) {
      await safeStudentNotification({
        userId: booking.userId,
        type: "booking",
        title: "Booking Status Updated",
        text: `Your booking status changed from ${previousStatus} to ${status}.`,
        link: `/student/bookings/${booking._id}`,
        entityId: booking._id,
      });
    }

    const updatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "userId",
          "name email phone"
        )
        .populate(
          "hostelId",
          "propertyTitle city"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity price"
        );

    return res.status(200).json({
      success: true,
      msg: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    return res.status(500).json({
      msg: "Update failed",
    });
  }
};