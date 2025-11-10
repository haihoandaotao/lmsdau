const mongoose = require('mongoose');

const itemCompletionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  quizScore: {
    type: Number,
    min: 0,
    max: 100
  },
  quizAttempts: {
    type: Number,
    default: 0
  },
  completedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
itemCompletionSchema.index({ user: 1, item: 1 });
itemCompletionSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model('ItemCompletion', itemCompletionSchema);
