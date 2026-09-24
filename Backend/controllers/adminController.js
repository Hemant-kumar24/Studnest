const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// ==========================================
// GET ADMIN PROFILE
// ==========================================
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);

    return res.status(500).json({
      message: "Server error while fetching admin profile",
    });
  }
};

// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      name,
      phone,
      address,
      city,
      email,
    } = req.body;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    if (name !== undefined) {
      const trimmedName = String(name).trim();

      if (!trimmedName) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      admin.name = trimmedName;
    }

    if (phone !== undefined) {
      admin.phone = String(phone).trim();
    }

    if (address !== undefined) {
      admin.address = String(address).trim();
    }

    if (city !== undefined) {
      admin.city = String(city).trim();
    }

    if (email !== undefined) {
      const trimmedEmail = String(email).trim().toLowerCase();

      if (!trimmedEmail) {
        return res.status(400).json({
          message: "Email cannot be empty",
        });
      }

      admin.email = trimmedEmail;
    }

    await admin.save();

    const updatedAdmin = await Admin.findById(adminId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    return res.status(500).json({
      message: "Server error while updating admin profile",
    });
  }
};

// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================
const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing admin password:", error);

    return res.status(500).json({
      message: "Server error while changing password",
    });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
};