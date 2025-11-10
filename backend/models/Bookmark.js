const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  timestamp: {
    type: Number, // seconds in video
    required: true
  },
  title: {
    type: String,
    default: 'Bookmark'
  },
  description: String
}, {
  timestamps: true
});

// Index for faster queries
bookmarkSchema.index({ user: 1, item: 1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
