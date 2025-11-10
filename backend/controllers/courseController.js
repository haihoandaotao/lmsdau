const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { semester, year, department, search } = req.query;
    
    let query = {};
    
    if (semester) query.semester = semester;
    if (year) query.year = year;
    if (department) query.department = department;
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email studentId')
      .sort('-createdAt');

    res.status(200).json({
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
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email department')
      .populate('enrolledStudents', 'name email studentId')
      .populate('prerequisites', 'title code');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Teacher/Admin
exports.createCourse = async (req, res) => {
  try {
    // Set instructor as current user if teacher
    if (req.user.role === 'teacher') {
      req.body.instructor = req.user.id;
    }

    const course = await Course.create(req.body);

    // Add course to instructor's teaching courses
    await User.findByIdAndUpdate(
      req.body.instructor,
      { $push: { teachingCourses: course._id } }
    );

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is course instructor or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check capacity
    if (course.enrolledStudents.length >= course.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Add course to student's enrolled courses
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { enrolledCourses: course._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Private/Student
exports.unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if enrolled
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Remove student from course
    course.enrolledStudents = course.enrolledStudents.filter(
      id => id.toString() !== req.user.id
    );
    await course.save();

    // Remove course from student's enrolled courses
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { enrolledCourses: course._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add course material
// @route   POST /api/courses/:id/materials
// @access  Private/Teacher
exports.addMaterial = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is course instructor
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add materials to this course'
      });
    }

    course.materials.push(req.body);
    await course.save();

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course settings (syllabus, grading, access)
// @route   PUT /api/courses/:id/settings
// @access  Private (Instructor/Admin)
exports.updateCourseSettings = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course settings'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'syllabus',
      'objectives',
      'courseFormat',
      'startDate',
      'endDate',
      'gradingScheme',
      'accessSettings'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    });

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course settings updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course settings
// @route   GET /api/courses/:id/settings
// @access  Private (Enrolled/Instructor/Admin)
exports.getCourseSettings = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .select('title code syllabus objectives courseFormat startDate endDate gradingScheme accessSettings');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has access
    const isInstructor = course.instructor._id.toString() === req.user.id;
    const isEnrolled = course.enrolledStudents?.includes(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isEnrolled && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view course settings'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
