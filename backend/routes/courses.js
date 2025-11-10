const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  addMaterial,
  updateCourseSettings,
  getCourseSettings
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('teacher', 'admin'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('teacher', 'admin'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.post('/:id/unenroll', protect, authorize('student'), unenrollCourse);
router.post('/:id/materials', protect, authorize('teacher', 'admin'), addMaterial);

// Course Settings
router.route('/:id/settings')
  .get(protect, getCourseSettings)
  .put(protect, authorize('teacher', 'admin'), updateCourseSettings);

module.exports = router;
