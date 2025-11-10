const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getAssignmentSubmissions,
  getMySubmission,
  getMySubmissions,
  gradeSubmission,
  bulkGradeSubmissions,
  deleteSubmission,
  downloadFile
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Student routes - submit assignment
router.post('/', upload.array('files', 10), handleUploadError, submitAssignment);

// Student routes - view own submissions
router.get('/assignment/:assignmentId/my-submission', getMySubmission);
router.get('/course/:courseId/my-submissions', getMySubmissions);

// Download file (both student and teacher)
router.get('/download/:submissionId/:filename', downloadFile);

// Teacher/Admin routes - view all submissions
router.get('/assignment/:assignmentId', authorize('teacher', 'admin'), getAssignmentSubmissions);

// Teacher/Admin routes - grade submissions
router.post('/:id/grade', authorize('teacher', 'admin'), upload.array('feedbackFiles', 5), handleUploadError, gradeSubmission);
router.post('/bulk-grade', authorize('teacher', 'admin'), bulkGradeSubmissions);

// Delete submission (student own, teacher all)
router.delete('/:id', deleteSubmission);

module.exports = router;
