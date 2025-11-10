const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: String,
  size: Number,
  path: String,
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Submission content
  content: {
    type: String,
    default: ''
  },
  files: [fileSchema],
  
  // Legacy support
  attachments: [{
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // For quiz/exam answers
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: String
  }],
  
  // Submission metadata
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isLate: {
    type: Boolean,
    default: false
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  
  // Grading
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned', 'resubmitted'],
    default: 'submitted'
  },
  score: {
    type: Number,
    default: 0
  },
  grade: {
    type: Number,
    min: 0
  },
  maxGrade: Number,
  gradedAt: Date,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: {
    type: String,
    default: ''
  },
  feedbackFiles: [fileSchema],
  
  // Rubric scoring
  rubricScores: {
    type: Map,
    of: Number
  },
  
  // History for resubmissions
  previousSubmissions: [{
    content: String,
    files: [fileSchema],
    submittedAt: Date,
    attemptNumber: Number
  }]
}, {
  timestamps: true
});

// Indexes
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ course: 1, status: 1 });
submissionSchema.index({ student: 1, submittedAt: -1 });

// Methods
submissionSchema.methods.markAsLate = function(dueDate) {
  if (dueDate && this.submittedAt > dueDate) {
    this.isLate = true;
  }
  return this.isLate;
};

submissionSchema.methods.addGrade = async function(gradeData) {
  this.status = 'graded';
  this.grade = gradeData.grade;
  this.maxGrade = gradeData.maxGrade;
  this.score = gradeData.grade; // Legacy support
  this.feedback = gradeData.feedback;
  this.gradedAt = new Date();
  this.gradedBy = gradeData.gradedBy;
  
  if (gradeData.rubricScores) {
    this.rubricScores = gradeData.rubricScores;
  }
  
  if (gradeData.feedbackFiles) {
    this.feedbackFiles = gradeData.feedbackFiles;
  }
  
  await this.save();
  
  // Create grade item in gradebook
  try {
    const Grade = require('./Grade');
    const Assignment = require('./Assignment');
    
    const assignment = await Assignment.findById(this.assignment);
    const grade = await Grade.getOrCreate(this.student, this.course);
    
    await grade.addGradeItem({
      itemType: 'assignment',
      itemId: this.assignment,
      itemName: assignment.title,
      maxPoints: this.maxGrade,
      earnedPoints: this.grade,
      percentage: Math.round((this.grade / this.maxGrade) * 100),
      feedback: this.feedback,
      status: 'graded',
      isLate: this.isLate,
      submittedAt: this.submittedAt,
      gradedAt: this.gradedAt,
      gradedBy: this.gradedBy
    });
    
    await grade.save();
  } catch (error) {
    console.error('Error creating grade item:', error);
  }
  
  return this;
};

submissionSchema.methods.resubmit = function(content, files) {
  // Save current submission to history
  this.previousSubmissions.push({
    content: this.content,
    files: this.files,
    submittedAt: this.submittedAt,
    attemptNumber: this.attemptNumber
  });
  
  // Update with new submission
  this.content = content;
  this.files = files;
  this.submittedAt = new Date();
  this.attemptNumber += 1;
  this.status = 'resubmitted';
  
  return this;
};

// Static methods
submissionSchema.statics.getSubmissionStats = async function(assignmentId) {
  const stats = await this.aggregate([
    { $match: { assignment: mongoose.Types.ObjectId(assignmentId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    submitted: 0,
    graded: 0,
    returned: 0,
    late: 0,
    averageGrade: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  // Calculate average grade
  const graded = await this.find({ 
    assignment: assignmentId, 
    status: 'graded',
    grade: { $exists: true }
  });
  
  if (graded.length > 0) {
    const sum = graded.reduce((acc, sub) => acc + (sub.grade / sub.maxGrade * 100), 0);
    result.averageGrade = sum / graded.length;
  }
  
  // Count late submissions
  result.late = await this.countDocuments({ 
    assignment: assignmentId, 
    isLate: true 
  });
  
  return result;
};

submissionSchema.statics.getStudentSubmissions = async function(studentId, courseId) {
  return this.find({ student: studentId, course: courseId })
    .populate('assignment', 'title dueDate maxGrade')
    .sort({ submittedAt: -1 });
};

submissionSchema.statics.getCourseSubmissions = async function(courseId, options = {}) {
  const query = { course: courseId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.assignment) {
    query.assignment = options.assignment;
  }
  
  return this.find(query)
    .populate('student', 'name email')
    .populate('assignment', 'title dueDate')
    .populate('gradedBy', 'name')
    .sort({ submittedAt: -1 });
};

module.exports = mongoose.model('Submission', submissionSchema);
