const express = require('express');
const router = express.Router();
const {
  getCourseModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  addModuleItem,
  updateModuleItem,
  deleteModuleItem,
  reorderModules
} = require('../controllers/moduleController');

const { protect, authorize } = require('../middleware/auth');

// Public routes (none - all require auth)

// Protected routes
router.use(protect);

// Get modules for a course
router.get('/course/:courseId', getCourseModules);

// Get single module
router.get('/:id', getModule);

// Create module (teachers and admins only)
router.post('/', authorize('teacher', 'admin'), createModule);

// Update module (teachers and admins only)
router.put('/:id', authorize('teacher', 'admin'), updateModule);

// Delete module (teachers and admins only)
router.delete('/:id', authorize('teacher', 'admin'), deleteModule);

// Reorder modules
router.put('/course/:courseId/reorder', authorize('teacher', 'admin'), reorderModules);

// Module items routes
router.post('/:id/items', authorize('teacher', 'admin'), addModuleItem);
router.put('/:id/items/:itemId', authorize('teacher', 'admin'), updateModuleItem);
router.delete('/:id/items/:itemId', authorize('teacher', 'admin'), deleteModuleItem);

module.exports = router;
