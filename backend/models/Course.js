const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please provide a course code'],
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
    // Ngành đào tạo
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
    // Học kỳ: "1", "2", "Hè"
  },
  year: {
    type: Number,
    required: true
    // Năm học: 2024, 2025, etc.
  },
  academicYear: {
    type: Number,
    min: 1,
    max: 6,
    // Năm thứ mấy trong chương trình (Năm 1, 2, 3, 4)
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 10
    // Số tín chỉ
  },
  courseType: {
    type: String,
    enum: ['Bắt buộc', 'Tự chọn', 'Tiên quyết'],
    default: 'Bắt buộc'
  },
  category: {
    type: String,
    enum: ['Đại cương', 'Cơ sở ngành', 'Chuyên ngành', 'Tự chọn', 'Khóa luận'],
    default: 'Chuyên ngành'
  },
  capacity: {
    type: Number,
    default: 50
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    room: String
  }],
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'document']
    },
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  syllabus: {
    type: String,
    default: ''
  },
  objectives: [String],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  
  // Course Settings
  courseFormat: {
    type: String,
    enum: ['weekly', 'topics', 'social'],
    default: 'topics'
  },
  startDate: Date,
  endDate: Date,
  
  // Grading Configuration
  gradingScheme: {
    scale: {
      type: String,
      enum: ['percentage', 'points', 'letter'],
      default: 'percentage'
    },
    passingGrade: {
      type: Number,
      default: 50
    },
    weights: {
      assignments: { type: Number, default: 30 },
      quizzes: { type: Number, default: 30 },
      midterm: { type: Number, default: 20 },
      final: { type: Number, default: 20 }
    },
    letterGrades: [{
      letter: String,
      minPercentage: Number,
      maxPercentage: Number
    }]
  },
  
  // Access Settings
  accessSettings: {
    enrollmentKey: String,
    allowGuestAccess: { type: Boolean, default: false },
    visibility: {
      type: String,
      enum: ['public', 'private', 'hidden'],
      default: 'public'
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', code: 'text' });

module.exports = mongoose.model('Course', courseSchema);
