const mongoose = require("mongoose");

const User = require("../models/User");
const Booking = require("../models/Booking");
const Complaint = require("../models/Complaint");
const Review = require("../models/Review");

// ==========================================
// GET ALL STUDENTS
// ==========================================
const getAllStudents = async (req, res) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const filter = {
      role: {
        $in: ["student", "user"],
      },
    };

    // ======================================
    // STATUS FILTER
    // ======================================
    if (req.query.status) {
      const status = String(req.query.status).toLowerCase();

      if (status === "active") {
        filter.isActive = true;
      }

      if (status === "inactive") {
        filter.isActive = false;
      }
    }

    // ======================================
    // SEARCH
    // ======================================
    if (req.query.search?.trim()) {
      const search = req.query.search.trim();

      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(
        escapedSearch,
        "i"
      );

      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const [students, total] =
      await Promise.all([
        User.find(filter)
          .select(
            "name email phone profileImage role isActive createdAt location"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        User.countDocuments(filter),
      ]);

    const pages =
      total > 0
        ? Math.ceil(total / limit)
        : 0;

    return res.status(200).json({
      success: true,
      students,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    console.error(
      "Get all students error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching students",
    });
  }
};

// ==========================================
// GET STUDENT BY ID
// ==========================================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await User.findOne({
      _id: id,
      role: {
        $in: ["student", "user"],
      },
    })
      .select(
        "name email phone profileImage role isActive createdAt location"
      )
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ======================================
    // FETCH STUDENT ACTIVITY
    // ======================================
    const [
      bookings,
      complaints,
      reviews,
    ] = await Promise.all([
      Booking.find({
        userId: id,
      })
        .populate(
          "hostelId",
          "propertyTitle city address image images"
        )
        .populate(
          "roomId",
          "roomNumber roomType price capacity"
        )
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean(),

      Complaint.find({
        userId: id,
      })
        .populate(
          "hostelId",
          "propertyTitle city"
        )
        .populate(
          "roomId",
          "roomNumber roomType"
        )
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean(),

      Review.find({
        userId: id,
      })
        .populate(
          "hostelId",
          "propertyTitle city image images"
        )
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,

      student: {
        ...student,
        bookings,
        complaints,
        reviews,
      },
    });
  } catch (error) {
    console.error(
      "Get student details error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching student details",
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
};