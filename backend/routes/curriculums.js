const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Curriculum = require('../models/Curriculum');
const Major = require('../models/Major');
const Course = require('../models/Course');

// @route   GET /api/curriculums
// @desc    Get all curriculums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { major, effectiveYear, isActive } = req.query;

    let query = {};
    if (major) query.major = major;
    if (effectiveYear) query.effectiveYear = parseInt(effectiveYear);
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const curriculums = await Curriculum.find(query)
      .populate('major', 'code name')
      .populate('approvedBy', 'name')
      .sort({ effectiveYear: -1, createdAt: -1 });

    res.json({
      success: true,
      count: curriculums.length,
      data: curriculums
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/curriculums/:id
// @desc    Get single curriculum with full details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id)
      .populate('major', 'code name faculty totalCredits')
      .populate('approvedBy', 'name email')
      .populate({
        path: 'structure.courses.course',
        select: 'code title credits description instructor',
        populate: {
          path: 'instructor',
          select: 'name'
        }
      })
      .populate('categories.generalEducation.courses', 'code title credits')
      .populate('categories.foundational.courses', 'code title credits')
      .populate('categories.specialized.courses', 'code title credits')
      .populate('categories.elective.courses', 'code title credits')
      .populate('categories.thesis.courses', 'code title credits');

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khung chương trình'
      });
    }

    // Update enrolled count
    await curriculum.updateEnrolledCount();

    res.json({
      success: true,
      data: curriculum
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/curriculums/:id/courses
// @desc    Get courses by year and semester
// @access  Public
router.get('/:id/courses', async (req, res) => {
  try {
    const { year, semester } = req.query;

    const curriculum = await Curriculum.findById(req.params.id)
      .populate({
        path: 'structure.courses.course',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      });

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khung chương trình'
      });
    }

    let filteredStructure = curriculum.structure;

    if (year) {
      filteredStructure = filteredStructure.filter(s => s.year === parseInt(year));
    }
    if (semester) {
      filteredStructure = filteredStructure.filter(s => s.semester === parseInt(semester));
    }

    res.json({
      success: true,
      data: filteredStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/curriculums
// @desc    Create new curriculum
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Validate major exists
    const major = await Major.findById(req.body.major);
    if (!major) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ngành đào tạo'
      });
    }

    req.body.approvedBy = req.user.id;
    req.body.approvedDate = new Date();

    const curriculum = await Curriculum.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo khung chương trình thành công',
      data: curriculum
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã khung chương trình đã tồn tại'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/curriculums/:id
// @desc    Update curriculum
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const curriculum = await Curriculum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khung chương trình'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật khung chương trình thành công',
      data: curriculum
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/curriculums/:id/add-course
// @desc    Add course to curriculum structure
// @access  Private (Admin)
router.put('/:id/add-course', protect, authorize('admin'), async (req, res) => {
  try {
    const { year, semester, courseId, isRequired, prerequisites } = req.body;

    const curriculum = await Curriculum.findById(req.params.id);
    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khung chương trình'
      });
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học phần'
      });
    }

    // Find or create year-semester structure
    let yearSem = curriculum.structure.find(s => s.year === year && s.semester === semester);
    
    if (!yearSem) {
      yearSem = { year, semester, courses: [] };
      curriculum.structure.push(yearSem);
    } else {
      // Check if course already exists
      const courseExists = yearSem.courses.some(c => c.course.toString() === courseId);
      if (courseExists) {
        return res.status(400).json({
          success: false,
          message: 'Học phần đã tồn tại trong khung chương trình'
        });
      }
    }

    // Add course
    yearSem.courses.push({
      course: courseId,
      isRequired: isRequired !== false,
      prerequisites: prerequisites || []
    });

    await curriculum.save();

    res.json({
      success: true,
      message: 'Thêm học phần vào khung chương trình thành công',
      data: curriculum
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/curriculums/:id/remove-course
// @desc    Remove course from curriculum structure
// @access  Private (Admin)
router.put('/:id/remove-course', protect, authorize('admin'), async (req, res) => {
  try {
    const { year, semester, courseId } = req.body;

    const curriculum = await Curriculum.findById(req.params.id);
    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khung chương trình'
      });
    }

    // Find year-semester structure
    const yearSem = curriculum.structure.find(s => s.year === year && s.semester === semester);
    
    if (!yearSem) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy năm học - học kỳ'
      });
    }

    // Remove course
    yearSem.courses = yearSem.courses.filter(c => c.course.toString() !== courseId);

    await curriculum.save();

    res.json({
      success: true,
      message: 'Xóa học phần khỏi khung chương trình thành công',
      data: curriculum
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/curriculums/:id
// @desc    Delete curriculum
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const curriculum = await Curriculum.findByIdAndDelete(req.params.id);

    if (!curriculum) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khung chương trình'
      });
    }

    res.json({
      success: true,
      message: 'Xóa khung chương trình thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
