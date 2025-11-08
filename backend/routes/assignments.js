const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getMySubmissions,
  getAssignmentSubmissions
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAssignments)
  .post(authorize('teacher', 'admin'), createAssignment);

router.get('/my-submissions', authorize('student'), getMySubmissions);

router.route('/:id')
  .get(getAssignment)
  .put(authorize('teacher', 'admin'), updateAssignment)
  .delete(authorize('teacher', 'admin'), deleteAssignment);

router.post('/:id/submit', authorize('student'), submitAssignment);
router.get('/:id/submissions', authorize('teacher', 'admin'), getAssignmentSubmissions);
router.put('/submissions/:id/grade', authorize('teacher', 'admin'), gradeSubmission);

module.exports = router;
