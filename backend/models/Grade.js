const mongoose = require('mongoose');

const gradeItemSchema = new mongoose.Schema({
  itemType: { 
    type: String, 
    enum: ['assignment', 'quiz', 'discussion', 'attendance', 'manual'],
    required: true
  },
  itemId: { type: mongoose.Schema.Types.ObjectId },
  itemName: { type: String, required: true },
  
  // Scoring
  maxPoints: { type: Number, required: true, default: 100 },
  weight: { type: Number, default: 1 }, // For weighted average
  
  // Grading
  earnedPoints: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  letterGrade: String,
  
  // Submission info
  submittedAt: Date,
  gradedAt: Date,
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Feedback
  feedback: String,
  rubricScores: [{
    criterion: String,
    score: Number,
    comment: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['not_submitted', 'submitted', 'graded', 'late', 'excused'],
    default: 'not_submitted'
  },
  isLate: { type: Boolean, default: false },
  latePenalty: { type: Number, default: 0 },
  
  // Visibility
  isExcused: { type: Boolean, default: false },
  hideFromStudent: { type: Boolean, default: false }
});

const gradeSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true,
    index: true
  },
  
  // Grade items
  items: [gradeItemSchema],
  
  // Calculated grades
  totalEarned: { type: Number, default: 0 },
  totalPossible: { type: Number, default: 0 },
  currentGrade: { type: Number, default: 0 }, // Percentage
  letterGrade: { type: String },
  
  // Status
  status: {
    type: String,
    enum: ['passing', 'failing', 'incomplete', 'at_risk'],
    default: 'incomplete'
  },
  
  // Attendance
  attendanceRate: { type: Number, default: 0 },
  attendanceCount: { type: Number, default: 0 },
  totalAttendanceSessions: { type: Number, default: 0 },
  
  // Participation
  discussionPosts: { type: Number, default: 0 },
  videoCompletionRate: { type: Number, default: 0 },
  
  // Metadata
  lastCalculated: { type: Date, default: Date.now },
  lastActivity: Date
}, {
  timestamps: true
});

// Compound index for efficient queries
gradeSchema.index({ student: 1, course: 1 }, { unique: true });

// Calculate final grade
gradeSchema.methods.calculateGrade = function() {
  let totalWeightedPoints = 0;
  let totalWeightedPossible = 0;
  
  this.items.forEach(item => {
    if (!item.isExcused && item.status === 'graded') {
      const weight = item.weight || 1;
      totalWeightedPoints += (item.earnedPoints || 0) * weight;
      totalWeightedPossible += (item.maxPoints || 0) * weight;
    }
  });
  
  this.totalEarned = totalWeightedPoints;
  this.totalPossible = totalWeightedPossible;
  this.currentGrade = totalWeightedPossible > 0 
    ? Math.round((totalWeightedPoints / totalWeightedPossible) * 100) 
    : 0;
  
  // Determine letter grade
  this.letterGrade = this.getLetterGrade(this.currentGrade);
  
  // Determine status
  if (this.currentGrade >= 50) {
    this.status = 'passing';
  } else if (this.currentGrade >= 40) {
    this.status = 'at_risk';
  } else if (this.totalPossible > 0) {
    this.status = 'failing';
  } else {
    this.status = 'incomplete';
  }
  
  this.lastCalculated = new Date();
  
  return this;
};

gradeSchema.methods.getLetterGrade = function(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Add or update grade item
gradeSchema.methods.addGradeItem = function(itemData) {
  const existingIndex = this.items.findIndex(
    item => item.itemType === itemData.itemType && 
            item.itemId?.toString() === itemData.itemId?.toString()
  );
  
  if (existingIndex >= 0) {
    // Update existing item
    this.items[existingIndex] = { ...this.items[existingIndex].toObject(), ...itemData };
  } else {
    // Add new item
    this.items.push(itemData);
  }
  
  return this.calculateGrade();
};

// Get grade for specific item
gradeSchema.methods.getItemGrade = function(itemType, itemId) {
  return this.items.find(
    item => item.itemType === itemType && 
            item.itemId?.toString() === itemId?.toString()
  );
};

// Static method to get or create grade record
gradeSchema.statics.getOrCreate = async function(studentId, courseId) {
  let grade = await this.findOne({ student: studentId, course: courseId });
  
  if (!grade) {
    grade = await this.create({
      student: studentId,
      course: courseId,
      items: []
    });
  }
  
  return grade;
};

// Static method to get course gradebook (all students)
gradeSchema.statics.getCourseGradebook = async function(courseId) {
  return this.find({ course: courseId })
    .populate('student', 'name email')
    .sort({ currentGrade: -1 });
};

module.exports = mongoose.model('Grade', gradeSchema);
