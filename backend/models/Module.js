const mongoose = require('mongoose');

// Lesson Item Schema (Video, Reading, Quiz, Assignment)
const lessonItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'reading', 'quiz', 'assignment', 'discussion'],
    required: true
  },
  description: String,
  
  // For video type
  videoUrl: String,
  videoDuration: Number, // seconds
  videoProvider: {
    type: String,
    enum: ['youtube', 'vimeo', 'direct', 's3'],
    default: 'direct'
  },
  thumbnail: String,
  subtitles: [{
    language: String,
    url: String
  }],
  
  // For reading type
  content: String, // HTML content
  readingTime: Number, // minutes
  
  // For quiz/assignment type
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  
  // Common fields
  order: {
    type: Number,
    default: 0
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  downloadable: {
    type: Boolean,
    default: false
  },
  attachments: [{
    title: String,
    url: String,
    size: Number,
    type: String
  }]
}, { timestamps: true });

// Module/Week Schema
const moduleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  order: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Learning objectives for this module
  learningObjectives: [String],
  
  // Module metadata
  duration: String, // "2 giờ", "3 tuần"
  releaseDate: Date,
  
  // Items in this module (videos, readings, quizzes, etc)
  items: [lessonItemSchema],
  
  // Module settings
  isPublished: {
    type: Boolean,
    default: false
  },
  unlockCondition: {
    type: String,
    enum: ['none', 'sequential', 'date', 'completion'],
    default: 'sequential'
  },
  requiredCompletionPercentage: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  }
}, { timestamps: true });

// Create indexes
moduleSchema.index({ course: 1, order: 1 });
moduleSchema.index({ course: 1, isPublished: 1 });

// Virtual for total items count
moduleSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Virtual for total duration (sum of all video durations)
moduleSchema.virtual('totalVideoDuration').get(function() {
  return this.items
    .filter(item => item.type === 'video')
    .reduce((sum, item) => sum + (item.videoDuration || 0), 0);
});

// Pre-save middleware to sort items by order
moduleSchema.pre('save', function(next) {
  this.items.sort((a, b) => a.order - b.order);
  next();
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
