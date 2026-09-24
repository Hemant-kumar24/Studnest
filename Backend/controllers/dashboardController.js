const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

// Overview stats for the user dashboard
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [favoritesCount, reviewsCount, lastBooking, lastLogin] = await Promise.all([
      Favorite.countDocuments({ userId }),
      Review.countDocuments({ userId }),
      Booking.findOne({ userId }).sort({ createdAt: -1 }),
      Promise.resolve(null), // Placeholder (could be enhanced with user lastLogin tracking)
    ]);

    res.json({
      favoritesCount,
      reviewsCount,
      lastBookingAt: lastBooking?.createdAt || null,
      lastLoginAt: lastLogin,
    });
  } catch (err) {
    console.error('getOverview error:', err);
    res.status(500).json({ message: 'Failed to load overview' });
  }
};

// Favorites
exports.getFavorites = async (req, res) => {
  try {
    const items = await Favorite.find({ userId: req.user.id })
      .populate('hostelId', 'propertyTitle city image nearbyCollege');
    res.json(items);
  } catch (err) {
    console.error('getFavorites error:', err);
    res.status(500).json({ message: 'Failed to load favorites' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { hostelId } = req.body;
    if (!hostelId) return res.status(400).json({ message: 'hostelId is required' });
    const fav = await Favorite.findOneAndUpdate(
      { userId: req.user.id, hostelId },
      { $setOnInsert: { userId: req.user.id, hostelId } },
      { upsert: true, new: true }
    );
    res.status(201).json(fav);
  } catch (err) {
    console.error('addFavorite error:', err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { hostelId } = req.params;
    await Favorite.findOneAndDelete({ userId: req.user.id, hostelId });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error('removeFavorite error:', err);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};

// Reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .populate('hostelId', 'propertyTitle city');
    res.json(reviews);
  } catch (err) {
    console.error('getMyReviews error:', err);
    res.status(500).json({ message: 'Failed to load reviews' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { hostelId, rating, comment } = req.body;
    if (!hostelId || !rating) return res.status(400).json({ message: 'hostelId and rating are required' });
    const review = await Review.create({ userId: req.user.id, hostelId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    console.error('addReview error:', err);
    res.status(500).json({ message: 'Failed to add review' });
  }
};

// Notifications
exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ message: 'Failed to load notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.updateOne({ _id: id, userId: req.user.id }, { $set: { read: true } });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error('markNotificationRead error:', err);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};