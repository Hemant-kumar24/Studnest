const mongoose = require("mongoose");
const Hostel = require("../models/Hostel");
const Admin = require("../models/Admin");

function getAdminId(req) {
  return req.admin?.id || req.admin?._id || req.user?.id || req.user?._id;
}

function parseAmenities(value) {
  if (typeof value === "undefined" || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim());
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .filter(Boolean)
          .map((item) => String(item).trim());
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function parseNumber(value, defaultValue = 0) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : defaultValue;
}

exports.createHostel = async (req, res) => {
  try {
    const ownerId = getAdminId(req);

    if (!ownerId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const admin = await Admin.findById(ownerId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const {
      propertyTitle,
      propertyType,
      description,
      address,
      city,
      nearbyCollege,
      monthlyRent,
      securityDeposit,
      genderPreference,
      totalRooms,
      availableRooms,
      ownerName,
      ownerEmail,
      ownerPhone,
      location,
    } = req.body;

    if (!propertyTitle || !address || !city) {
      return res.status(400).json({
        message: "Property title, address and city are required",
      });
    }

    const imageUrls = Array.isArray(req.files)
      ? req.files.map((file) => file.path).filter(Boolean)
      : [];

    const hostel = await Hostel.create({
      propertyTitle: propertyTitle.trim(),
      propertyType: propertyType || "Hostel",
      description: description || "",
      address: address.trim(),
      city: city.trim(),
      nearbyCollege: nearbyCollege || "",

      monthlyRent: parseNumber(monthlyRent),
      securityDeposit: parseNumber(securityDeposit),

      genderPreference: genderPreference || "Any",

      totalRooms: parseNumber(totalRooms),
      availableRooms:
        availableRooms !== undefined
          ? parseNumber(availableRooms)
          : parseNumber(totalRooms),

      amenities: parseAmenities(req.body.amenities),

      images: imageUrls,
      image: imageUrls[0] || "",

      ownerName: ownerName?.trim() || admin.name || "",
      ownerEmail: ownerEmail?.trim() || admin.email || "",
      ownerPhone: ownerPhone?.trim() || admin.phone || "",

      ownerId,

      location: location || undefined,

      status: "approved",
    });

    return res.status(201).json({
      message: "Hostel created successfully",
      hostel,
    });
  } catch (error) {
    console.error("createHostel error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Invalid hostel data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      message: "Failed to create hostel",
      error: error.message,
    });
  }
};

exports.getAdminHostels = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const hostels = await Hostel.find({
      ownerId: adminId,
    })
      .populate("ownerId", "name email phone address city")
      .sort({ createdAt: -1 });

    const result = hostels.map((hostel) => {
      const data = hostel.toObject();

      if (hostel.ownerId) {
        const owner = hostel.ownerId;

        data.ownerName = data.ownerName || owner.name || "";
        data.ownerEmail = data.ownerEmail || owner.email || "";
        data.ownerPhone = data.ownerPhone || owner.phone || "";

        data.ownerDetails = {
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          address: owner.address,
          city: owner.city,
        };
      }

      return data;
    });

    return res.status(200).json({
      count: result.length,
      hostels: result,
    });
  } catch (error) {
    console.error("getAdminHostels error:", error);

    return res.status(500).json({
      message: "Failed to fetch hostels",
      error: error.message,
    });
  }
};

exports.getAdminHostelById = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid hostel ID",
      });
    }

    const hostel = await Hostel.findOne({
      _id: id,
      ownerId: adminId,
    }).populate("ownerId", "name email phone address city");

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found or not owned by this admin",
      });
    }

    return res.status(200).json({
      hostel,
    });
  } catch (error) {
    console.error("getAdminHostelById error:", error);

    return res.status(500).json({
      message: "Failed to fetch hostel",
      error: error.message,
    });
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid hostel ID",
      });
    }

    const hostel = await Hostel.findOne({
      _id: id,
      ownerId: adminId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found or not owned by this admin",
      });
    }

    const updatedData = {};

    const allowedFields = [
      "propertyTitle",
      "propertyType",
      "description",
      "address",
      "city",
      "nearbyCollege",
      "genderPreference",
      "ownerName",
      "ownerEmail",
      "ownerPhone",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatedData[field] = req.body[field];
      }
    });

    if (req.body.monthlyRent !== undefined) {
      updatedData.monthlyRent = parseNumber(req.body.monthlyRent);
    }

    if (req.body.securityDeposit !== undefined) {
      updatedData.securityDeposit = parseNumber(
        req.body.securityDeposit
      );
    }

    if (req.body.totalRooms !== undefined) {
      updatedData.totalRooms = parseNumber(req.body.totalRooms);
    }

    if (req.body.availableRooms !== undefined) {
      updatedData.availableRooms = parseNumber(
        req.body.availableRooms
      );
    }

    if (req.body.amenities !== undefined) {
      updatedData.amenities = parseAmenities(req.body.amenities);
    }

    if (req.body.location !== undefined) {
      updatedData.location = req.body.location;
    }

    const newImages = Array.isArray(req.files)
      ? req.files.map((file) => file.path).filter(Boolean)
      : [];

    if (newImages.length > 0) {
      const existingImages = Array.isArray(hostel.images)
        ? hostel.images
        : [];

      updatedData.images = [...existingImages, ...newImages];

      updatedData.image =
        hostel.image || newImages[0] || "";
    }

    const updatedHostel = await Hostel.findOneAndUpdate(
      {
        _id: id,
        ownerId: adminId,
      },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("updateHostel error:", error);

    return res.status(500).json({
      message: "Failed to update hostel",
      error: error.message,
    });
  }
};

exports.deleteHostel = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    const deleted = await Hostel.findOneAndDelete({
      _id: req.params.id,
      ownerId: adminId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Hostel not found or not owned by this admin",
      });
    }

    return res.status(200).json({
      message: "Hostel deleted successfully",
    });
  } catch (error) {
    console.error("deleteHostel error:", error);

    return res.status(500).json({
      message: "Failed to delete hostel",
      error: error.message,
    });
  }
};

exports.updateSeats = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    const update = {};

    if (req.body.availableRooms !== undefined) {
      update.availableRooms = parseNumber(
        req.body.availableRooms
      );
    }

    if (req.body.totalRooms !== undefined) {
      update.totalRooms = parseNumber(
        req.body.totalRooms
      );
    }

    const hostel = await Hostel.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: adminId,
      },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found or not owned by this admin",
      });
    }

    return res.status(200).json({
      message: "Seats updated successfully",
      hostel,
    });
  } catch (error) {
    console.error("updateSeats error:", error);

    return res.status(500).json({
      message: "Failed to update seats",
      error: error.message,
    });
  }
};