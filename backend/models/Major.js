const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Mã ngành là bắt buộc'],
    unique: true,
    uppercase: true,
    trim: true,
    // Ví dụ: CNTT, KTXD, KTTM, etc.
  },
  name: {
    type: String,
    required: [true, 'Tên ngành là bắt buộc'],
    trim: true,
    // Ví dụ: Công nghệ Thông tin, Kiến trúc, Kế toán, etc.
  },
  fullName: {
    type: String,
    default: '',
    // Ví dụ: Ngành Công nghệ Thông tin
  },
  description: {
    type: String,
    default: ''
  },
  faculty: {
    type: String,
    required: [true, 'Khoa quản lý là bắt buộc'],
    // Ví dụ: Khoa Công nghệ Thông tin, Khoa Kiến trúc
  },
  trainingLevel: {
    type: String,
    enum: ['Đại học', 'Cao đẳng', 'Thạc sĩ', 'Tiến sĩ'],
    default: 'Đại học'
  },
  duration: {
    type: Number,
    default: 4,
    // Số năm đào tạo (4 năm, 3 năm, 2 năm, etc.)
  },
  totalCredits: {
    type: Number,
    default: 120,
    // Tổng số tín chỉ yêu cầu để tốt nghiệp
  },
  admissionYear: {
    type: Number,
    // Năm bắt đầu tuyển sinh
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Trưởng khoa/Trưởng ngành
  },
  isActive: {
    type: Boolean,
    default: true
  },
  objectives: [{
    type: String
    // Mục tiêu đào tạo
  }],
  careerOpportunities: [{
    type: String
    // Cơ hội nghề nghiệp sau tốt nghiệp
  }],
  metadata: {
    studentCount: {
      type: Number,
      default: 0
    },
    courseCount: {
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
majorSchema.index({ code: 1 });
majorSchema.index({ faculty: 1 });
majorSchema.index({ isActive: 1 });

// Virtual for curriculums
majorSchema.virtual('curriculums', {
  ref: 'Curriculum',
  localField: '_id',
  foreignField: 'major'
});

// Virtual for students
majorSchema.virtual('students', {
  ref: 'User',
  localField: '_id',
  foreignField: 'major'
});

// Methods
majorSchema.methods.updateStudentCount = async function() {
  const User = mongoose.model('User');
  this.metadata.studentCount = await User.countDocuments({ 
    major: this._id,
    role: 'student',
    isActive: true
  });
  await this.save();
};

majorSchema.methods.updateCourseCount = async function() {
  const Course = mongoose.model('Course');
  this.metadata.courseCount = await Course.countDocuments({ 
    major: this._id
  });
  await this.save();
};

module.exports = mongoose.model('Major', majorSchema);
