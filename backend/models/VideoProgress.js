const mongoose = require('mongoose');

// Video Progress Schema
const videoProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // Video watching progress
  currentTime: {
    type: Number,
    default: 0
  }, // seconds
  totalDuration: {
    type: Number,
    required: true
  }, // seconds
  watchedPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Completion tracking
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  
  // Watch history
  watchHistory: [{
    startTime: Number,
    endTime: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Total time spent watching
  totalWatchTime: {
    type: Number,
    default: 0
  }, // seconds
  
  // Playback speed tracking (for analytics)
  lastPlaybackSpeed: {
    type: Number,
    default: 1.0
  },
  
  // Last watched
  lastWatchedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index for unique user + item
videoProgressSchema.index({ user: 1, itemId: 1 }, { unique: true });
videoProgressSchema.index({ user: 1, course: 1 });
videoProgressSchema.index({ user: 1, module: 1 });

// Method to update progress
videoProgressSchema.methods.updateProgress = function(currentTime, totalDuration) {
  this.currentTime = currentTime;
  this.totalDuration = totalDuration;
  this.watchedPercentage = Math.round((currentTime / totalDuration) * 100);
  this.lastWatchedAt = new Date();
  
  // Mark as completed if watched 90% or more
  if (this.watchedPercentage >= 90 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Static method to get course progress
videoProgressSchema.statics.getCourseProgress = async function(userId, courseId) {
  const Module = require('./Module');
  
  // Get all modules and items
  const modules = await Module.find({ course: courseId, isPublished: true })
    .sort('order');
  
  let totalItems = 0;
  let completedItems = 0;
  
  for (const module of modules) {
    for (const item of module.items) {
      if (item.type === 'video' && item.isRequired) {
        totalItems++;
        const progress = await this.findOne({
          user: userId,
          itemId: item._id,
          isCompleted: true
        });
        if (progress) {
          completedItems++;
        }
      }
    }
  }
  
  return {
    totalItems,
    completedItems,
    percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  };
};

const VideoProgress = mongoose.model('VideoProgress', videoProgressSchema);

module.exports = VideoProgress;
