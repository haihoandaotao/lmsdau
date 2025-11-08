const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an assignment title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide an assignment description']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  type: {
    type: String,
    enum: ['assignment', 'quiz', 'exam', 'project'],
    default: 'assignment'
  },
  totalPoints: {
    type: Number,
    required: true,
    default: 100
  },
  dueDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    default: 10 // percentage
  },
  instructions: {
    type: String,
    default: ''
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  // For quiz/exam
  questions: [{
    questionText: String,
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'essay']
    },
    options: [String],
    correctAnswer: String,
    points: Number,
    explanation: String
  }],
  duration: {
    type: Number, // in minutes
    default: null
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
