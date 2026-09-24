const mongoose = require("mongoose");

const Complaint = require("../models/Complaint");
const Booking = require("../models/Booking");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const { safeStudentNotification, safeAdminNotifications } = require("../utils/notificationService");


// ==========================================
// CREATE COMPLAINT
// ==========================================

exports.createComplaint = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      bookingId,
      subject,
      description,
      category,
      priority,
      attachments,
    } = req.body;

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        message: "Complaint subject is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Complaint description is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    // ----------------------------------------
    // FIND BOOKING
    // ----------------------------------------

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found or you are not authorized",
      });
    }

    // ----------------------------------------
    // COMPLAINT ALLOWED ONLY FOR ACTIVE BOOKINGS
    // ----------------------------------------

    const allowedStatuses = [
      "Confirmed",
      "CheckedIn",
      "Active",
    ];

    if (!allowedStatuses.includes(booking.status)) {
      return res.status(400).json({
        message:
          "Complaint can only be raised for an active booking",
      });
    }

    // ----------------------------------------
    // FIND HOSTEL
    // ----------------------------------------

    const hostel = await Hostel.findById(
      booking.hostelId
    );

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    // ----------------------------------------
    // ROOM
    // ----------------------------------------

    let roomId = booking.roomId || null;

    if (
      roomId &&
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      roomId = null;
    }

    // ----------------------------------------
    // PREVENT TOO MANY OPEN DUPLICATE COMPLAINTS
    // ----------------------------------------

    const existingComplaint =
      await Complaint.findOne({
        userId,
        bookingId,
        status: {
          $in: ["Open", "In Progress"],
        },
      });

    if (existingComplaint) {
      return res.status(409).json({
        message:
          "You already have an active complaint for this booking",
        complaint: existingComplaint,
      });
    }

    // ----------------------------------------
    // VALIDATE PRIORITY
    // ----------------------------------------

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
      "Urgent",
    ];

    const finalPriority =
      allowedPriorities.includes(priority)
        ? priority
        : "Medium";

    // ----------------------------------------
    // VALIDATE CATEGORY
    // ----------------------------------------

    const allowedCategories = [
      "Room",
      "Food",
      "Cleanliness",
      "Maintenance",
      "Electricity",
      "Water",
      "Security",
      "Staff",
      "Payment",
      "Other",
    ];

    const finalCategory =
      allowedCategories.includes(category)
        ? category
        : "Other";

    // ----------------------------------------
    // CREATE
    // ----------------------------------------

    const complaint = await Complaint.create({
      userId,
      bookingId,
      hostelId: booking.hostelId,
      roomId,
      subject: subject.trim(),
      description: description.trim(),
      category: finalCategory,
      priority: finalPriority,
      attachments: Array.isArray(attachments)
        ? attachments
        : [],
      status: "Open",
    });

    await safeStudentNotification({
      userId,
      type: "complaint",
      title: "Complaint Submitted",
      text: "Your complaint has been submitted successfully and is now open.",
      link: `/student/complaints/${complaint._id}`,
      entityId: complaint._id,
    });

    await safeAdminNotifications({
      type: "complaint",
      title: "New Complaint",
      text: `A new ${finalPriority.toLowerCase()} priority complaint has been submitted.`,
      link: `/admin/complaints/${complaint._id}`,
      entityId: complaint._id,
    });

    // ----------------------------------------
    // POPULATE RESPONSE
    // ----------------------------------------

    await complaint.populate([
      {
        path: "hostelId",
        select:
          "propertyTitle city address image images",
      },
      {
        path: "roomId",
        select:
          "roomNumber roomType price",
      },
      {
        path: "bookingId",
        select:
          "status startDate endDate amount",
      },
    ]);

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error(
      "Create complaint error:",
      error
    );

    return res.status(500).json({
      message: "Error creating complaint",
    });
  }
};

// ==========================================
// GET MY COMPLAINTS
// ==========================================

exports.getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      status,
      category,
    } = req.query;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      50
    );

    const skip = (page - 1) * limit;

    const filter = {
      userId,
    };

    // ----------------------------------------
    // STATUS FILTER
    // ----------------------------------------

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (
      status &&
      allowedStatuses.includes(status)
    ) {
      filter.status = status;
    }

    // ----------------------------------------
    // CATEGORY FILTER
    // ----------------------------------------

    const allowedCategories = [
      "Room",
      "Food",
      "Cleanliness",
      "Maintenance",
      "Electricity",
      "Water",
      "Security",
      "Staff",
      "Payment",
      "Other",
    ];

    if (
      category &&
      allowedCategories.includes(category)
    ) {
      filter.category = category;
    }

    // ----------------------------------------
    // QUERY
    // ----------------------------------------

    const [complaints, total] =
      await Promise.all([
        Complaint.find(filter)
          .populate(
            "hostelId",
            "propertyTitle city address image images"
          )
          .populate(
            "roomId",
            "roomNumber roomType price"
          )
          .populate(
            "bookingId",
            "status startDate endDate amount"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        Complaint.countDocuments(filter),
      ]);

    const pages =
      total > 0
        ? Math.ceil(total / limit)
        : 0;

    return res.status(200).json({
      complaints,

      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error(
      "Get my complaints error:",
      error
    );

    return res.status(500).json({
      message:
        "Error fetching complaints",
    });
  }
};

// ==========================================
// GET SINGLE MY COMPLAINT
// ==========================================

exports.getMyComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint =
      await Complaint.findOne({
        _id: id,
        userId,
      })
        .populate(
          "hostelId",
          "propertyTitle city address image images amenities"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity price amenities"
        )
        .populate(
          "bookingId",
          "status startDate endDate amount duration"
        )
        .populate(
          "respondedBy",
          "name email"
        );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      complaint,
    });
  } catch (error) {
    console.error(
      "Get complaint error:",
      error
    );

    return res.status(500).json({
      message:
        "Error fetching complaint",
    });
  }
};

// ==========================================
// DELETE / CANCEL COMPLAINT
// ==========================================

exports.deleteComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint =
      await Complaint.findOne({
        _id: id,
        userId,
      });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    // ----------------------------------------
    // ONLY OPEN COMPLAINT CAN BE DELETED
    // ----------------------------------------

    if (complaint.status !== "Open") {
      return res.status(400).json({
        message:
          "Only open complaints can be deleted",
      });
    }

    await Complaint.findByIdAndDelete(id);

    return res.status(200).json({
      message:
        "Complaint deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete complaint error:",
      error
    );

    return res.status(500).json({
      message:
        "Error deleting complaint",
    });
  }
};