const express = require('express');
const router = express.Router();
const {
  updateVideoProgress,
  getVideoProgress,
  getCourseProgress,
  getModuleProgress,
  checkItemUnlock,
  markVideoCompleted
} = require('../controllers/videoProgressController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Update video progress (students only)
router.post('/', authorize('student'), updateVideoProgress);

// Get video progress for specific item
router.get('/item/:itemId', authorize('student'), getVideoProgress);

// Get course progress
router.get('/course/:courseId', authorize('student'), getCourseProgress);

// Get module progress
router.get('/module/:moduleId', authorize('student'), getModuleProgress);

// Check if item is unlocked
router.get('/check-unlock/:moduleId/:itemId', authorize('student'), checkItemUnlock);

// Mark video as completed
router.post('/complete/:itemId', authorize('student'), markVideoCompleted);

module.exports = router;
