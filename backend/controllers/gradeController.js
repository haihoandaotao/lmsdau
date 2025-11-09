const Grade = require('../models/Grade');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get gradebook for a course (teacher view)
// @route   GET /api/grades/course/:courseId
// @access  Private (Teacher/Admin)
exports.getCourseGradebook = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify user has access to course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Get all grades for this course
    const grades = await Grade.getCourseGradebook(courseId);
    
    // Get course statistics
    const stats = {
      totalStudents: grades.length,
      averageGrade: grades.reduce((sum, g) => sum + g.currentGrade, 0) / grades.length || 0,
      passingStudents: grades.filter(g => g.status === 'passing').length,
      failingStudents: grades.filter(g => g.status === 'failing').length,
      atRiskStudents: grades.filter(g => g.status === 'at_risk').length,
      gradeDistribution: {
        A: grades.filter(g => g.currentGrade >= 90).length,
        B: grades.filter(g => g.currentGrade >= 80 && g.currentGrade < 90).length,
        C: grades.filter(g => g.currentGrade >= 70 && g.currentGrade < 80).length,
        D: grades.filter(g => g.currentGrade >= 60 && g.currentGrade < 70).length,
        F: grades.filter(g => g.currentGrade < 60).length
      }
    };
    
    res.json({
      success: true,
      data: {
        grades,
        stats,
        course: {
          _id: course._id,
          title: course.title,
          code: course.code
        }
      }
    });
  } catch (error) {
    console.error('Error fetching gradebook:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get grade for a specific student in a course
// @route   GET /api/grades/student/:studentId/course/:courseId
// @access  Private (Student can see own, Teacher can see all)
exports.getStudentGrade = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    // Students can only view their own grades
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    const grade = await Grade.getOrCreate(studentId, courseId);
    await grade.populate('student', 'name email');
    
    // Get course info
    const course = await Course.findById(courseId).select('title code passingGrade');
    
    res.json({
      success: true,
      data: {
        grade,
        course,
        isPassing: grade.currentGrade >= (course.passingGrade || 50)
      }
    });
  } catch (error) {
    console.error('Error fetching student grade:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user's grades for a course
// @route   GET /api/grades/my-grades/:courseId
// @access  Private (Student)
exports.getMyGrades = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const grade = await Grade.getOrCreate(req.user._id, courseId);
    const course = await Course.findById(courseId).select('title code passingGrade');
    
    // Calculate grade if not calculated recently (within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (!grade.lastCalculated || grade.lastCalculated < oneHourAgo) {
      grade.calculateGrade();
      await grade.save();
    }
    
    res.json({
      success: true,
      data: {
        currentGrade: grade.currentGrade,
        letterGrade: grade.letterGrade,
        status: grade.status,
        totalEarned: grade.totalEarned,
        totalPossible: grade.totalPossible,
        items: grade.items.map(item => ({
          itemType: item.itemType,
          itemName: item.itemName,
          earnedPoints: item.earnedPoints,
          maxPoints: item.maxPoints,
          percentage: item.percentage,
          status: item.status,
          submittedAt: item.submittedAt,
          gradedAt: item.gradedAt,
          feedback: item.feedback,
          isLate: item.isLate
        })),
        course: {
          title: course.title,
          code: course.code,
          passingGrade: course.passingGrade || 50
        },
        isPassing: grade.currentGrade >= (course.passingGrade || 50)
      }
    });
  } catch (error) {
    console.error('Error fetching my grades:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add or update grade item
// @route   POST /api/grades/item
// @access  Private (Teacher/Admin)
exports.addGradeItem = async (req, res) => {
  try {
    const {
      studentId,
      courseId,
      itemType,
      itemId,
      itemName,
      maxPoints,
      earnedPoints,
      feedback,
      rubricScores,
      status
    } = req.body;
    
    // Validation
    if (!studentId || !courseId || !itemType || !itemName || maxPoints === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const grade = await Grade.getOrCreate(studentId, courseId);
    
    // Calculate percentage
    const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;
    
    // Add or update item
    grade.addGradeItem({
      itemType,
      itemId,
      itemName,
      maxPoints,
      earnedPoints: earnedPoints || 0,
      percentage,
      feedback,
      rubricScores,
      status: status || 'graded',
      gradedAt: new Date(),
      gradedBy: req.user._id
    });
    
    await grade.save();
    
    res.json({
      success: true,
      message: 'Grade item added successfully',
      data: grade
    });
  } catch (error) {
    console.error('Error adding grade item:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Bulk add grades for multiple students
// @route   POST /api/grades/bulk
// @access  Private (Teacher/Admin)
exports.bulkAddGrades = async (req, res) => {
  try {
    const { courseId, itemType, itemName, maxPoints, grades } = req.body;
    
    if (!courseId || !itemType || !itemName || !grades || !Array.isArray(grades)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data' 
      });
    }
    
    const results = [];
    
    for (const gradeData of grades) {
      try {
        const grade = await Grade.getOrCreate(gradeData.studentId, courseId);
        
        const percentage = maxPoints > 0 
          ? Math.round((gradeData.earnedPoints / maxPoints) * 100) 
          : 0;
        
        grade.addGradeItem({
          itemType,
          itemName,
          maxPoints,
          earnedPoints: gradeData.earnedPoints || 0,
          percentage,
          feedback: gradeData.feedback,
          status: 'graded',
          gradedAt: new Date(),
          gradedBy: req.user._id
        });
        
        await grade.save();
        results.push({ studentId: gradeData.studentId, success: true });
      } catch (err) {
        results.push({ 
          studentId: gradeData.studentId, 
          success: false, 
          error: err.message 
        });
      }
    }
    
    res.json({
      success: true,
      message: `Processed ${results.length} grades`,
      data: results
    });
  } catch (error) {
    console.error('Error bulk adding grades:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Recalculate all grades for a course
// @route   POST /api/grades/recalculate/:courseId
// @access  Private (Teacher/Admin)
exports.recalculateGrades = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const grades = await Grade.find({ course: courseId });
    
    for (const grade of grades) {
      grade.calculateGrade();
      await grade.save();
    }
    
    res.json({
      success: true,
      message: `Recalculated ${grades.length} grade records`,
      data: { count: grades.length }
    });
  } catch (error) {
    console.error('Error recalculating grades:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Export gradebook to CSV
// @route   GET /api/grades/export/:courseId
// @access  Private (Teacher/Admin)
exports.exportGradebook = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const grades = await Grade.find({ course: courseId })
      .populate('student', 'name email');
    
    // Build CSV
    let csv = 'Student Name,Email,Current Grade,Letter Grade,Status,Total Earned,Total Possible\n';
    
    grades.forEach(grade => {
      csv += `"${grade.student.name}","${grade.student.email}",${grade.currentGrade},${grade.letterGrade},${grade.status},${grade.totalEarned},${grade.totalPossible}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="gradebook_${courseId}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting gradebook:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
