const express = require('express');
const router = express.Router();
const {
  getCourseGradebook,
  getStudentGrade,
  getMyGrades,
  addGradeItem,
  bulkAddGrades,
  recalculateGrades,
  exportGradebook
} = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Student routes - get own grades
router.get('/my-grades/:courseId', getMyGrades);

// Teacher/Admin routes - view all grades
router.get('/course/:courseId', authorize('teacher', 'admin'), getCourseGradebook);
router.get('/student/:studentId/course/:courseId', authorize('teacher', 'admin'), getStudentGrade);

// Teacher/Admin routes - add/update grades
router.post('/item', authorize('teacher', 'admin'), addGradeItem);
router.post('/bulk', authorize('teacher', 'admin'), bulkAddGrades);

// Teacher/Admin routes - utilities
router.post('/recalculate/:courseId', authorize('teacher', 'admin'), recalculateGrades);
router.get('/export/:courseId', authorize('teacher', 'admin'), exportGradebook);

module.exports = router;
