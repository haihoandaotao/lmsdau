const express = require('express');
const router = express.Router();
const {
  getStudentProgress,
  getCourseStatistics,
  getDashboard
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/student/:id', getStudentProgress);
router.get('/course/:id', authorize('teacher', 'admin'), getCourseStatistics);

module.exports = router;
