const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Mã khung chương trình là bắt buộc'],
    unique: true,
    uppercase: true,
    trim: true,
    // Ví dụ: CTDT-CNTT-2024
  },
  name: {
    type: String,
    required: [true, 'Tên khung chương trình là bắt buộc'],
    trim: true,
    // Ví dụ: Chương trình đào tạo CNTT khóa 2024
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
    required: [true, 'Ngành đào tạo là bắt buộc']
  },
  effectiveYear: {
    type: Number,
    required: [true, 'Năm áp dụng là bắt buộc'],
    // Năm bắt đầu áp dụng (2024, 2025, etc.)
  },
  description: {
    type: String,
    default: ''
  },
  totalCredits: {
    type: Number,
    required: [true, 'Tổng số tín chỉ là bắt buộc'],
    default: 120
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Cấu trúc học phần theo năm học và học kỳ
  structure: [{
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      // Năm thứ 1, 2, 3, 4...
    },
    semester: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
      // Học kỳ 1, 2, hè
    },
    courses: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      isRequired: {
        type: Boolean,
        default: true
        // Học phần bắt buộc hay tự chọn
      },
      prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
        // Học phần tiên quyết
      }]
    }]
  }],
  // Phân loại học phần
  categories: {
    generalEducation: {
      // Giáo dục đại cương
      credits: { type: Number, default: 0 },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    foundational: {
      // Giáo dục chuyên nghiệp - Cơ sở ngành
      credits: { type: Number, default: 0 },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    specialized: {
      // Chuyên ngành
      credits: { type: Number, default: 0 },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    elective: {
      // Tự chọn
      credits: { type: Number, default: 0 },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    thesis: {
      // Khóa luận/Thực tập
      credits: { type: Number, default: 0 },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    }
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Người phê duyệt
  },
  approvedDate: {
    type: Date
  },
  metadata: {
    enrolledStudents: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
curriculumSchema.index({ major: 1, effectiveYear: -1 });
curriculumSchema.index({ code: 1 });
curriculumSchema.index({ isActive: 1 });

// Virtual for enrolled students
curriculumSchema.virtual('enrolledStudents', {
  ref: 'User',
  localField: '_id',
  foreignField: 'curriculum'
});

// Methods
curriculumSchema.methods.getTotalCourses = function() {
  let total = 0;
  this.structure.forEach(yearSem => {
    total += yearSem.courses.length;
  });
  return total;
};

curriculumSchema.methods.getCoursesByYear = function(year) {
  return this.structure.filter(s => s.year === year);
};

curriculumSchema.methods.getCoursesBySemester = function(year, semester) {
  const found = this.structure.find(s => s.year === year && s.semester === semester);
  return found ? found.courses : [];
};

curriculumSchema.methods.updateEnrolledCount = async function() {
  const User = mongoose.model('User');
  this.metadata.enrolledStudents = await User.countDocuments({ 
    curriculum: this._id,
    role: 'student',
    isActive: true
  });
  await this.save();
};

// Calculate total credits from all courses
curriculumSchema.pre('save', function(next) {
  if (this.categories) {
    this.totalCredits = 
      (this.categories.generalEducation?.credits || 0) +
      (this.categories.foundational?.credits || 0) +
      (this.categories.specialized?.credits || 0) +
      (this.categories.elective?.credits || 0) +
      (this.categories.thesis?.credits || 0);
  }
  next();
});

module.exports = mongoose.model('Curriculum', curriculumSchema);
