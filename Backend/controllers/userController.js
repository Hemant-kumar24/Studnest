const User = require("../models/User");

// ============================================
// GET USER PROFILE
// GET /api/user/profile
// ============================================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching user profile.",
    });
  }
};

// ============================================
// UPDATE USER PROFILE
// PUT /api/user/profile
// ============================================
const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      gender,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ================================
    // NAME
    // ================================

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Name must contain at least 2 characters.",
        });
      }

      user.name = cleanName;
    }

    // ================================
    // EMAIL
    // ================================

    if (email !== undefined) {
      const cleanEmail = String(email)
        .trim()
        .toLowerCase();

      if (!cleanEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty.",
        });
      }

      user.email = cleanEmail;
    }

    // ================================
    // PHONE
    // ================================

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    // ================================
    // COLLEGE
    // ================================

    if (college !== undefined) {
      user.college = String(college).trim();
    }

    // ================================
    // GENDER
    // ================================

    if (gender !== undefined) {
      const allowedGenders = [
        "",
        "Male",
        "Female",
        "Other",
      ];

      if (!allowedGenders.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender.",
        });
      }

      user.gender = gender;
    }

    // ================================
    // PROFILE IMAGE
    // ================================

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user.id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Error updating user profile:",
      error
    );

    // Duplicate email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating user profile.",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};