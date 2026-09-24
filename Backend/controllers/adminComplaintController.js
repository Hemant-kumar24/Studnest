const mongoose = require("mongoose");

const Complaint = require("../models/Complaint");
const { safeStudentNotification, safeAdminNotifications } = require("../utils/notificationService");


// ==========================================
// GET ALL COMPLAINTS
// ==========================================

exports.getAllComplaints = async (
  req,
  res
) => {
  try {
    const {
      status,
      category,
      priority,
      hostelId,
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

    const filter = {};

    // ----------------------------------------
    // STATUS
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
    // CATEGORY
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
    // PRIORITY
    // ----------------------------------------

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
      "Urgent",
    ];

    if (
      priority &&
      allowedPriorities.includes(priority)
    ) {
      filter.priority = priority;
    }

    // ----------------------------------------
    // HOSTEL
    // ----------------------------------------

    if (hostelId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          hostelId
        )
      ) {
        return res.status(400).json({
          message: "Invalid hostel ID",
        });
      }

      filter.hostelId = hostelId;
    }

    // ----------------------------------------
    // QUERY
    // ----------------------------------------

    const [
      complaints,
      total,
    ] = await Promise.all([
      Complaint.find(filter)
        .populate(
          "userId",
          "name email phone profileImage"
        )
        .populate(
          "hostelId",
          "propertyTitle city address image images"
        )
        .populate(
          "roomId",
          "roomNumber roomType capacity price"
        )
        .populate(
          "bookingId",
          "status startDate endDate amount duration"
        )
        .populate(
          "respondedBy",
          "name email"
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
      "Get all complaints error:",
      error
    );

    return res.status(500).json({
      message:
        "Error fetching complaints",
    });
  }
};

// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

exports.getComplaintById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint =
      await Complaint.findById(id)
        .populate(
          "userId",
          "name email phone profileImage"
        )
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
          "status startDate endDate amount duration note"
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
      "Get complaint by ID error:",
      error
    );

    return res.status(500).json({
      message:
        "Error fetching complaint",
    });
  }
};

// ==========================================
// UPDATE COMPLAINT
// ==========================================

exports.updateComplaint = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      status,
      adminResponse,
      priority,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint =
      await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const previousStatus = complaint.status;
    const previousResponse = complaint.adminResponse || "";

    // ----------------------------------------
    // STATUS VALIDATION
    // ----------------------------------------

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid complaint status",
      });
    }

    // ----------------------------------------
    // PRIORITY VALIDATION
    // ----------------------------------------

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
      "Urgent",
    ];

    if (
      priority &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    // ----------------------------------------
    // UPDATE STATUS
    // ----------------------------------------

    if (status) {
      complaint.status = status;
    }

    // ----------------------------------------
    // UPDATE PRIORITY
    // ----------------------------------------

    if (priority) {
      complaint.priority = priority;
    }

    // ----------------------------------------
    // ADMIN RESPONSE
    // ----------------------------------------

    if (
      typeof adminResponse === "string"
    ) {
      complaint.adminResponse =
        adminResponse.trim();

      complaint.respondedBy =
        req.user.id;

      complaint.respondedAt =
        new Date();
    }

    // ----------------------------------------
    // RESOLVED
    // ----------------------------------------

    if (status === "Resolved") {
      complaint.resolvedAt =
        new Date();
    }

    // ----------------------------------------
    // REOPEN
    // ----------------------------------------

    if (
      status === "Open" ||
      status === "In Progress"
    ) {
      complaint.resolvedAt = null;
    }

    await complaint.save();

    if (previousStatus !== complaint.status || previousResponse !== complaint.adminResponse) {
      await safeStudentNotification({
        userId: complaint.userId,
        type: "complaint",
        title: "Complaint Updated",
        text: complaint.adminResponse ? `Your complaint status is now ${complaint.status}. Admin response: ${complaint.adminResponse}` : `Your complaint status is now ${complaint.status}.`,
        link: `/student/complaints/${complaint._id}`,
        entityId: complaint._id,
      });
    }

    await complaint.populate([
      {
        path: "userId",
        select:
          "name email phone profileImage",
      },
      {
        path: "hostelId",
        select:
          "propertyTitle city address image images",
      },
      {
        path: "roomId",
        select:
          "roomNumber roomType capacity price",
      },
      {
        path: "bookingId",
        select:
          "status startDate endDate amount duration",
      },
      {
        path: "respondedBy",
        select: "name email",
      },
    ]);

    return res.status(200).json({
      message:
        "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error(
      "Update complaint error:",
      error
    );

    return res.status(500).json({
      message:
        "Error updating complaint",
    });
  }
};

// ==========================================
// DELETE COMPLAINT - ADMIN
// ==========================================

exports.deleteComplaint = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint =
      await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    await Complaint.findByIdAndDelete(id);

    return res.status(200).json({
      message:
        "Complaint deleted successfully",
    });
  } catch (error) {
    console.error(
      "Admin delete complaint error:",
      error
    );

    return res.status(500).json({
      message:
        "Error deleting complaint",
    });
  }
};