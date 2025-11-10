const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  startQuizAttempt,
  submitQuizAttempt,
  getMyAttempts,
  getAttemptDetails,
  getQuizAttempts,
  gradeEssayQuestion
} = require('../controllers/quizController');

// Quiz CRUD
router.post('/', protect, authorize('teacher', 'admin'), createQuiz);
router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/:id', protect, getQuizById);
router.put('/:id', protect, authorize('teacher', 'admin'), updateQuiz);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteQuiz);

// Quiz attempts - Student
router.post('/:id/start', protect, startQuizAttempt);
router.post('/attempts/:attemptId/submit', protect, submitQuizAttempt);
router.get('/:quizId/my-attempts', protect, getMyAttempts);

// Quiz attempts - Teacher
router.get('/:quizId/attempts', protect, authorize('teacher', 'admin'), getQuizAttempts);
router.get('/attempts/:attemptId', protect, getAttemptDetails);
router.post('/attempts/:attemptId/grade-essay', protect, authorize('teacher', 'admin'), gradeEssayQuestion);

module.exports = router;
