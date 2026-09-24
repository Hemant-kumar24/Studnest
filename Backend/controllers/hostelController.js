const mongoose = require('mongoose');
const Hostel = require('../models/Hostel');

function getAdminId(req) {
  return req.admin?.id || req.admin?._id || req.user?.id || req.user?._id;
}

exports.createHostel = async (req, res) => {
  try {
    const ownerId = getAdminId(req);

    if (!ownerId) {
      return res.status(401).json({ message: 'Authentication required' });
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
      amenities = [],
      images = [],
      image = '',
      ownerName = '',
      ownerEmail = '',
      ownerPhone = '',
      location,
    } = req.body;

    if (!propertyTitle || !address || !city) {
      return res.status(400).json({
        message: 'propertyTitle, address and city are required',
      });
    }

    const hostel = await Hostel.create({
      propertyTitle,
      propertyType,
      description,
      address,
      city,
      nearbyCollege,
      monthlyRent,
      securityDeposit,
      genderPreference,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: Array.isArray(images) ? images : [],
      image,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerId,
      location,
      status: 'approved',
    });

    return res.status(201).json({
      message: 'Hostel created successfully',
      hostel,
    });
  } catch (error) {
    console.error('createHostel error:', error);
    return res.status(500).json({ message: 'Failed to create hostel' });
  }
};

exports.getHostels = async (req, res) => {
  try {
    const filter = { status: 'approved' };

    if (req.query.city) {
      filter.city = new RegExp(`^${escapeRegex(req.query.city)}$`, 'i');
    }

    const hostels = await Hostel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    console.error('getHostels error:', error);
    return res.status(500).json({ message: 'Failed to fetch hostels' });
  }
};

exports.getHostelById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid hostel ID' });
    }

    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    return res.status(200).json(hostel);
  } catch (error) {
    console.error('getHostelById error:', error);
    return res.status(500).json({ message: 'Failed to fetch hostel' });
  }
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
