const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, hostelId: 1 }, { unique: true });

module.exports =
  mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
