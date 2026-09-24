const Room = require("../models/Room");
const Hostel = require("../models/Hostel");

const syncHostelRooms = async (hostelId) => {
  const rooms = await Room.find({ hostelId });

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) =>
      room.status === "available" &&
      room.availableBeds > 0
  ).length;

  await Hostel.findByIdAndUpdate(hostelId, {
    totalRooms,
    availableRooms,
  });
};

exports.getHostelRooms = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const hostel = await Hostel.findById(hostelId).select(
      "propertyTitle city address"
    );

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const rooms = await Room.find({ hostelId }).sort({
      roomNumber: 1,
    });

    res.status(200).json({
      hostel,
      rooms,
    });
  } catch (error) {
    console.error("Get hostel rooms error:", error);

    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "hostelId",
      "propertyTitle city address"
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      room,
    });
  } catch (error) {
    console.error("Get room error:", error);

    res.status(500).json({
      message: "Failed to fetch room",
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const {
      roomNumber,
      roomType,
      capacity,
      availableBeds,
      price,
      amenities,
    } = req.body;

    if (!roomNumber || !roomType) {
      return res.status(400).json({
        message: "Room number and room type are required",
      });
    }

    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const existingRoom = await Room.findOne({
      hostelId,
      roomNumber: roomNumber.trim(),
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "Room number already exists in this hostel",
      });
    }

    const roomCapacity = Number(capacity);
    const beds = Number(availableBeds);
    const roomPrice = Number(price);

    if (!Number.isFinite(roomCapacity) || roomCapacity < 1) {
      return res.status(400).json({
        message: "Capacity must be at least 1",
      });
    }

    if (
      !Number.isFinite(beds) ||
      beds < 0 ||
      beds > roomCapacity
    ) {
      return res.status(400).json({
        message: "Available beds must be between 0 and capacity",
      });
    }

    if (!Number.isFinite(roomPrice) || roomPrice < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    const room = await Room.create({
      hostelId,
      roomNumber: roomNumber.trim(),
      roomType,
      capacity: roomCapacity,
      availableBeds: beds,
      price: roomPrice,
      amenities: Array.isArray(amenities) ? amenities : [],
      status: beds === 0 ? "full" : "available",
    });

    await syncHostelRooms(hostelId);

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const {
      roomNumber,
      roomType,
      capacity,
      availableBeds,
      price,
      amenities,
    } = req.body;

    if (roomNumber !== undefined) {
      const duplicate = await Room.findOne({
        hostelId: room.hostelId,
        roomNumber: String(roomNumber).trim(),
        _id: { $ne: room._id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Room number already exists",
        });
      }

      room.roomNumber = String(roomNumber).trim();
    }

    if (roomType !== undefined) {
      room.roomType = roomType;
    }

    if (capacity !== undefined) {
      const value = Number(capacity);

      if (!Number.isFinite(value) || value < 1) {
        return res.status(400).json({
          message: "Invalid capacity",
        });
      }

      if (value < room.availableBeds) {
        return res.status(400).json({
          message: "Capacity cannot be less than available beds",
        });
      }

      room.capacity = value;
    }

    if (availableBeds !== undefined) {
      const value = Number(availableBeds);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > room.capacity
      ) {
        return res.status(400).json({
          message: "Invalid available beds",
        });
      }

      room.availableBeds = value;
    }

    if (price !== undefined) {
      const value = Number(price);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          message: "Invalid price",
        });
      }

      room.price = value;
    }

    if (amenities !== undefined) {
      room.amenities = Array.isArray(amenities)
        ? amenities
        : [];
    }

    if (
      room.status !== "maintenance" &&
      room.status !== "inactive"
    ) {
      room.status =
        room.availableBeds === 0
          ? "full"
          : "available";
    }

    await room.save();

    await syncHostelRooms(room.hostelId);

    res.status(200).json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update room error:", error);

    res.status(500).json({
      message: "Failed to update room",
      error: error.message,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const hostelId = room.hostelId;

    await Room.findByIdAndDelete(room._id);

    await syncHostelRooms(hostelId);

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);

    res.status(500).json({
      message: "Failed to delete room",
    });
  }
};

exports.updateRoomAvailability = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const { status, availableBeds } = req.body;

    const allowedStatuses = [
      "available",
      "full",
      "maintenance",
      "inactive",
    ];

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid room status",
      });
    }

    if (status !== undefined) {
      room.status = status;
    }

    if (availableBeds !== undefined) {
      const beds = Number(availableBeds);

      if (
        !Number.isFinite(beds) ||
        beds < 0 ||
        beds > room.capacity
      ) {
        return res.status(400).json({
          message: "Invalid available beds",
        });
      }

      room.availableBeds = beds;

      if (
        room.status !== "maintenance" &&
        room.status !== "inactive"
      ) {
        room.status =
          beds === 0 ? "full" : "available";
      }
    }

    await room.save();

    await syncHostelRooms(room.hostelId);

    res.status(200).json({
      message: "Room availability updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update availability error:", error);

    res.status(500).json({
      message: "Failed to update room availability",
    });
  }
};