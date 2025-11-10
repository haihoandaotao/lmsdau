const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher/Admin)
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, ...quizData } = req.body;
    
    // Check if user is teacher/admin of the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền tạo quiz cho khóa học này' });
    }
    
    // Create quiz
    const quiz = await Quiz.create({
      ...quizData,
      course: courseId,
      createdBy: req.user.id
    });
    
    await quiz.populate('course', 'title code');
    
    res.status(201).json({
      message: 'Tạo quiz thành công',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi tạo quiz',
      error: error.message 
    });
  }
};

// @desc    Get all quizzes in a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check enrollment - check if user is in course's enrolledStudents
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    const isEnrolled = course.enrolledStudents.some(
      studentId => studentId.toString() === req.user.id
    );
    
    const isInstructor = course.instructor.toString() === req.user.id;
    
    if (!isEnrolled && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // Teachers see all quizzes, students see only published
    const filter = {
      course: courseId,
      isActive: true
    };
    
    if (req.user.role === 'student') {
      filter.status = 'published';
    }
    
    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });
    
    // For students, add their attempt information
    if (req.user.role === 'student') {
      const quizzesWithAttempts = await Promise.all(
        quizzes.map(async (quiz) => {
          const attempts = await QuizAttempt.find({
            quiz: quiz._id,
            student: req.user.id,
            status: 'completed'
          }).sort({ score: -1 });
          
          const bestAttempt = attempts.length > 0 ? attempts[0] : null;
          
          return {
            ...quiz.toObject(),
            attemptCount: attempts.length,
            bestScore: bestAttempt ? bestAttempt.percentage : null,
            lastAttemptDate: bestAttempt ? bestAttempt.completedAt : null,
            canAttempt: quiz.isAvailable() && 
                       (quiz.allowRetake || attempts.length < quiz.maxAttempts)
          };
        })
      );
      
      return res.json(quizzesWithAttempts);
    }
    
    res.json(quizzes);
  } catch (error) {
    console.error('Get course quizzes error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách quiz',
      error: error.message 
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title code')
      .populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    
    // Check enrollment
    const course = await Course.findById(quiz.course._id);
    
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    const isEnrolled = course.enrolledStudents.some(
      studentId => studentId.toString() === req.user.id
    );
    
    const isInstructor = course.instructor.toString() === req.user.id;
    
    if (!isEnrolled && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // For students, check if quiz is available
    if (req.user.role === 'student' && !quiz.isAvailable()) {
      return res.status(403).json({ message: 'Quiz này hiện chưa mở' });
    }
    
    // Hide correct answers from students based on settings
    let quizData = quiz.toObject();
    
    if (req.user.role === 'student') {
      const attempts = await QuizAttempt.find({
        quiz: quiz._id,
        student: req.user.id,
        status: 'completed'
      });
      
      const shouldHideAnswers = 
        quiz.showAnswersAfter === 'never' ||
        (quiz.showAnswersAfter === 'after_due' && !quiz.isOverdue());
      
      if (shouldHideAnswers || attempts.length === 0) {
        quizData.questions = quizData.questions.map(q => {
          const cleanQuestion = { ...q };
          
          if (q.type === 'multiple_choice') {
            cleanQuestion.options = q.options.map(opt => ({
              text: opt.text,
              _id: opt._id
            }));
          } else if (q.type === 'true_false') {
            delete cleanQuestion.correctAnswer;
          } else if (['short_answer', 'fill_blank'].includes(q.type)) {
            delete cleanQuestion.acceptedAnswers;
          }
          
          delete cleanQuestion.explanation;
          
          return cleanQuestion;
        });
      }
      
      quizData.attemptCount = attempts.length;
      quizData.canAttempt = quiz.isAvailable() && 
                           (quiz.allowRetake || attempts.length < quiz.maxAttempts);
    }
    
    res.json(quizData);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy thông tin quiz',
      error: error.message 
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Teacher/Admin)
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    
    // Check permission
    const course = await Course.findById(quiz.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền sửa quiz này' });
    }
    
    // Update fields
    Object.assign(quiz, req.body);
    await quiz.save();
    
    await quiz.populate('course', 'title code');
    await quiz.populate('createdBy', 'name email');
    
    res.json({
      message: 'Cập nhật quiz thành công',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi cập nhật quiz',
      error: error.message 
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher/Admin)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    
    // Check permission
    const course = await Course.findById(quiz.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa quiz này' });
    }
    
    // Check if there are any attempts
    const attemptCount = await QuizAttempt.countDocuments({ quiz: quiz._id });
    
    if (attemptCount > 0) {
      // Don't delete, just archive
      quiz.status = 'archived';
      quiz.isActive = false;
      await quiz.save();
      
      return res.json({
        message: 'Quiz đã được lưu trữ (có học sinh đã làm bài)',
        quiz
      });
    }
    
    // No attempts, safe to delete
    await quiz.deleteOne();
    
    res.json({ message: 'Xóa quiz thành công' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi xóa quiz',
      error: error.message 
    });
  }
};

// @desc    Start quiz attempt
// @route   POST /api/quizzes/:id/start
// @access  Private (Student)
exports.startQuizAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    
    // Check if quiz is available
    if (!quiz.isAvailable()) {
      return res.status(403).json({ message: 'Quiz này hiện chưa mở' });
    }
    
    // Check enrollment
    const course = await Course.findById(quiz.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    const isEnrolled = course.enrolledStudents.some(
      studentId => studentId.toString() === req.user.id
    );
    
    const isInstructor = course.instructor.toString() === req.user.id;
    
    if (!isEnrolled && !isInstructor) {
      return res.status(403).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // Check existing attempts
    const existingAttempts = await QuizAttempt.find({
      quiz: quiz._id,
      student: req.user.id,
      status: 'completed'
    });
    
    // Check if in progress
    const inProgressAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user.id,
      status: 'in_progress'
    });
    
    if (inProgressAttempt) {
      return res.json({
        message: 'Bạn đang có một lần làm bài chưa hoàn thành',
        attempt: inProgressAttempt
      });
    }
    
    // Check attempt limit
    if (!quiz.allowRetake && existingAttempts.length >= quiz.maxAttempts) {
      return res.status(403).json({ 
        message: `Bạn đã hết lượt làm bài (${quiz.maxAttempts} lần)` 
      });
    }
    
    // Create new attempt
    const questions = quiz.shuffleQuestions ? quiz.getShuffledQuestions() : quiz.questions;
    
    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user.id,
      course: quiz.course,
      attemptNumber: existingAttempts.length + 1,
      totalPoints: quiz.totalPoints,
      questionsSnapshot: questions.map(q => {
        const qObj = q.toObject();
        if (quiz.shuffleOptions && q.options) {
          qObj.options = quiz.getShuffledOptions(q);
        }
        return qObj;
      })
    });
    
    // Return attempt with questions (but hide answers)
    const attemptData = attempt.toObject();
    attemptData.questionsSnapshot = attemptData.questionsSnapshot.map(q => {
      const cleanQ = { ...q };
      
      if (q.type === 'multiple_choice' && q.options) {
        cleanQ.options = q.options.map(opt => ({
          text: opt.text,
          _id: opt._id
        }));
      } else if (q.type === 'true_false') {
        delete cleanQ.correctAnswer;
      } else if (['short_answer', 'fill_blank'].includes(q.type)) {
        delete cleanQ.acceptedAnswers;
      }
      
      delete cleanQ.explanation;
      
      return cleanQ;
    });
    
    res.status(201).json({
      message: 'Bắt đầu làm bài',
      attempt: attemptData,
      timeLimit: quiz.timeLimit
    });
  } catch (error) {
    console.error('Start quiz attempt error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi bắt đầu làm bài',
      error: error.message 
    });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/attempts/:attemptId/submit
// @access  Private (Student)
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    
    const attempt = await QuizAttempt.findById(req.params.attemptId);
    
    if (!attempt) {
      return res.status(404).json({ message: 'Không tìm thấy bài làm' });
    }
    
    // Check ownership
    if (attempt.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền nộp bài này' });
    }
    
    // Check if already completed
    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ message: 'Bài làm này đã được nộp' });
    }
    
    // Save answers
    attempt.answers = answers.map(ans => ({
      questionId: ans.questionId,
      answer: ans.answer
    }));
    
    // Complete and auto-grade
    await attempt.complete();
    
    await attempt.populate('quiz', 'title showCorrectAnswers showAnswersAfter');
    
    res.json({
      message: 'Nộp bài thành công',
      attempt: attempt,
      needsManualGrading: attempt.needsManualGrading
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi nộp bài',
      error: error.message 
    });
  }
};

// @desc    Get student's quiz attempts
// @route   GET /api/quizzes/:quizId/my-attempts
// @access  Private (Student)
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.quizId,
      student: req.user.id
    })
      .populate('quiz', 'title totalPoints passingScore showCorrectAnswers showAnswersAfter')
      .sort({ attemptNumber: -1 });
    
    res.json(attempts);
  } catch (error) {
    console.error('Get my attempts error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách bài làm',
      error: error.message 
    });
  }
};

// @desc    Get attempt details
// @route   GET /api/quizzes/attempts/:attemptId
// @access  Private
exports.getAttemptDetails = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quiz')
      .populate('student', 'name email')
      .populate('course', 'title');
    
    if (!attempt) {
      return res.status(404).json({ message: 'Không tìm thấy bài làm' });
    }
    
    // Check permission
    const isOwner = attempt.student._id.toString() === req.user.id;
    const isTeacher = req.user.role === 'teacher' || req.user.role === 'admin';
    
    if (!isOwner && !isTeacher) {
      return res.status(403).json({ message: 'Bạn không có quyền xem bài làm này' });
    }
    
    // Students can only view completed attempts
    if (isOwner && !isTeacher && attempt.status === 'in_progress') {
      return res.status(403).json({ message: 'Bài làm này chưa được nộp' });
    }
    
    res.json(attempt);
  } catch (error) {
    console.error('Get attempt details error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy chi tiết bài làm',
      error: error.message 
    });
  }
};

// @desc    Get all attempts for a quiz (Teacher)
// @route   GET /api/quizzes/:quizId/attempts
// @access  Private (Teacher/Admin)
exports.getQuizAttempts = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Không tìm thấy quiz' });
    }
    
    // Check permission
    const course = await Course.findById(quiz.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xem bài làm' });
    }
    
    const attempts = await QuizAttempt.find({
      quiz: quiz._id,
      status: 'completed'
    })
      .populate('student', 'name email')
      .sort({ completedAt: -1 });
    
    // Get statistics
    const stats = await Quiz.getQuizStatistics(quiz._id);
    
    res.json({
      attempts,
      statistics: stats,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        totalPoints: quiz.totalPoints,
        passingScore: quiz.passingScore
      }
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách bài làm',
      error: error.message 
    });
  }
};

// @desc    Grade essay question
// @route   POST /api/quizzes/attempts/:attemptId/grade-essay
// @access  Private (Teacher/Admin)
exports.gradeEssayQuestion = async (req, res) => {
  try {
    const { questionId, pointsAwarded, feedback } = req.body;
    
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quiz')
      .populate('student', 'name email');
    
    if (!attempt) {
      return res.status(404).json({ message: 'Không tìm thấy bài làm' });
    }
    
    // Check permission
    const course = await Course.findById(attempt.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền chấm bài' });
    }
    
    await attempt.gradeEssayQuestion(questionId, pointsAwarded, feedback);
    
    res.json({
      message: 'Chấm bài thành công',
      attempt
    });
  } catch (error) {
    console.error('Grade essay error:', error);
    res.status(500).json({ 
      message: 'Lỗi khi chấm bài',
      error: error.message 
    });
  }
};
