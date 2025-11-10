const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Major = require('../models/Major');
const User = require('../models/User');
const Course = require('../models/Course');

// @route   GET /api/majors
// @desc    Get all majors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { isActive, faculty } = req.query;
    
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (faculty) {
      query.faculty = faculty;
    }

    const majors = await Major.find(query)
      .populate('headOfDepartment', 'name email')
      .sort({ code: 1 });

    res.json({
      success: true,
      count: majors.length,
      data: majors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/majors/:id
// @desc    Get single major
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const major = await Major.findById(req.params.id)
      .populate('headOfDepartment', 'name email phone')
      .populate('curriculums');

    if (!major) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ngành đào tạo'
      });
    }

    // Update counts
    await major.updateStudentCount();
    await major.updateCourseCount();

    res.json({
      success: true,
      data: major
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/majors/:id/students
// @desc    Get students of a major
// @access  Private (Teacher/Admin)
router.get('/:id/students', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, year } = req.query;

    let query = {
      major: req.params.id,
      role: 'student',
      isActive: true
    };

    if (year) {
      query.admissionYear = parseInt(year);
    }

    const students = await User.find(query)
      .select('name email studentId admissionYear studentClass')
      .populate('curriculum', 'name code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ admissionYear: -1, studentId: 1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/majors/:id/courses
// @desc    Get courses of a major
// @access  Public
router.get('/:id/courses', async (req, res) => {
  try {
    const { year, semester, category } = req.query;

    let query = { major: req.params.id };

    if (year) {
      query.academicYear = parseInt(year);
    }
    if (semester) {
      query.semester = semester;
    }
    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ academicYear: 1, semester: 1, code: 1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/majors
// @desc    Create new major
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const major = await Major.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo ngành đào tạo thành công',
      data: major
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã ngành đã tồn tại'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/majors/:id
// @desc    Update major
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const major = await Major.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!major) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ngành đào tạo'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật ngành đào tạo thành công',
      data: major
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/majors/:id
// @desc    Delete major
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Check if any students enrolled
    const studentCount = await User.countDocuments({
      major: req.params.id,
      role: 'student'
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa. Có ${studentCount} sinh viên đang theo học ngành này`
      });
    }

    const major = await Major.findByIdAndDelete(req.params.id);

    if (!major) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ngành đào tạo'
      });
    }

    res.json({
      success: true,
      message: 'Xóa ngành đào tạo thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/majors/:id/statistics
// @desc    Get major statistics
// @access  Private (Teacher/Admin)
router.get('/:id/statistics', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const major = await Major.findById(req.params.id);

    if (!major) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ngành đào tạo'
      });
    }

    // Student statistics by year
    const studentsByYear = await User.aggregate([
      {
        $match: {
          major: major._id,
          role: 'student',
          isActive: true
        }
      },
      {
        $group: {
          _id: '$admissionYear',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    // Course statistics by category
    const coursesByCategory = await Course.aggregate([
      {
        $match: { major: major._id }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalCredits: { $sum: '$credits' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        major: {
          code: major.code,
          name: major.name,
          totalStudents: major.metadata.studentCount,
          totalCourses: major.metadata.courseCount
        },
        studentsByYear,
        coursesByCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
