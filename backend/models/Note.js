const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
noteSchema.index({ user: 1, item: 1 });

module.exports = mongoose.model('Note', noteSchema);
