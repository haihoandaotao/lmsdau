const mongoose = require('mongoose');

// Answer schema
const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // Answer content based on question type
  answer: mongoose.Schema.Types.Mixed, // Can be String, Boolean, Array
  
  // Grading
  isCorrect: Boolean,
  pointsAwarded: {
    type: Number,
    default: 0
  },
  
  // For manual grading (essay questions)
  feedback: String,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gradedAt: Date
});

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Attempt number
  attemptNumber: {
    type: Number,
    default: 1
  },
  
  // Timing
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  timeSpent: Number, // in seconds
  
  // Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned', 'timed_out'],
    default: 'in_progress'
  },
  
  // Answers
  answers: [answerSchema],
  
  // Questions snapshot (in case quiz is edited after attempt)
  questionsSnapshot: [{
    type: mongoose.Schema.Types.Mixed
  }],
  
  // Scoring
  totalPoints: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  
  // Pass/Fail
  passed: {
    type: Boolean,
    default: false
  },
  
  // Manual grading needed
  needsManualGrading: {
    type: Boolean,
    default: false
  },
  fullyGraded: {
    type: Boolean,
    default: false
  },
  
  // Gradebook integration
  gradeItemCreated: {
    type: Boolean,
    default: false
  },
  gradeItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade'
  },
  
  // Feedback
  teacherFeedback: String,
  feedbackBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedbackAt: Date
}, {
  timestamps: true
});

// Indexes
quizAttemptSchema.index({ quiz: 1, student: 1 });
quizAttemptSchema.index({ student: 1, status: 1 });
quizAttemptSchema.index({ course: 1 });

// Methods

// Auto-grade objective questions
quizAttemptSchema.methods.autoGrade = async function() {
  const Quiz = require('./Quiz');
  const quiz = await Quiz.findById(this.quiz);
  
  if (!quiz) throw new Error('Quiz not found');
  
  let totalScore = 0;
  let hasEssayQuestions = false;
  
  for (let i = 0; i < this.answers.length; i++) {
    const answer = this.answers[i];
    const question = quiz.questions.id(answer.questionId);
    
    if (!question) continue;
    
    let isCorrect = false;
    let pointsAwarded = 0;
    
    switch (question.type) {
      case 'multiple_choice':
        const correctOption = question.options.find(opt => opt.isCorrect);
        isCorrect = correctOption && answer.answer === correctOption.text;
        pointsAwarded = isCorrect ? question.points : 0;
        break;
        
      case 'true_false':
        isCorrect = answer.answer === question.correctAnswer;
        pointsAwarded = isCorrect ? question.points : 0;
        break;
        
      case 'short_answer':
      case 'fill_blank':
        const studentAnswer = question.caseSensitive 
          ? answer.answer 
          : answer.answer.toLowerCase();
        
        isCorrect = question.acceptedAnswers.some(accepted => {
          const acceptedAnswer = question.caseSensitive 
            ? accepted 
            : accepted.toLowerCase();
          return acceptedAnswer === studentAnswer;
        });
        pointsAwarded = isCorrect ? question.points : 0;
        break;
        
      case 'essay':
        // Essays need manual grading
        hasEssayQuestions = true;
        isCorrect = null;
        pointsAwarded = 0;
        break;
    }
    
    this.answers[i].isCorrect = isCorrect;
    this.answers[i].pointsAwarded = pointsAwarded;
    totalScore += pointsAwarded;
  }
  
  this.score = totalScore;
  this.totalPoints = quiz.totalPoints;
  this.percentage = this.totalPoints > 0 ? (this.score / this.totalPoints) * 100 : 0;
  this.passed = this.percentage >= quiz.passingScore;
  this.needsManualGrading = hasEssayQuestions;
  this.fullyGraded = !hasEssayQuestions;
  
  return this;
};

// Complete attempt
quizAttemptSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (this.startedAt) {
    this.timeSpent = Math.floor((this.completedAt - this.startedAt) / 1000);
  }
  
  await this.autoGrade();
  await this.save();
  
  // Create gradebook entry if fully graded
  if (this.fullyGraded && !this.gradeItemCreated) {
    await this.createGradeItem();
  }
  
  return this;
};

// Create gradebook entry
quizAttemptSchema.methods.createGradeItem = async function() {
  const Grade = require('./Grade');
  const Quiz = require('./Quiz');
  
  const quiz = await Quiz.findById(this.quiz);
  if (!quiz) throw new Error('Quiz not found');
  
  // Get or create grade for this course/student
  const grade = await Grade.getOrCreate(this.course, this.student);
  
  // Add quiz as grade item
  await grade.addGradeItem({
    itemType: 'quiz',
    itemId: this.quiz,
    name: quiz.title,
    score: this.score,
    maxScore: this.totalPoints,
    weight: 1,
    dueDate: quiz.dueDate,
    submittedAt: this.completedAt
  });
  
  this.gradeItemCreated = true;
  this.gradeItemId = grade._id;
  await this.save();
  
  return grade;
};

// Manual grade essay questions
quizAttemptSchema.methods.gradeEssayQuestion = async function(questionId, pointsAwarded, feedback) {
  const answer = this.answers.find(a => a.questionId.toString() === questionId.toString());
  
  if (!answer) throw new Error('Answer not found');
  
  const Quiz = require('./Quiz');
  const quiz = await Quiz.findById(this.quiz);
  const question = quiz.questions.id(questionId);
  
  if (!question || question.type !== 'essay') {
    throw new Error('Invalid essay question');
  }
  
  // Update answer
  answer.pointsAwarded = Math.min(pointsAwarded, question.points);
  answer.feedback = feedback;
  answer.isCorrect = answer.pointsAwarded > 0;
  answer.gradedAt = new Date();
  
  // Recalculate score
  this.score = this.answers.reduce((sum, a) => sum + (a.pointsAwarded || 0), 0);
  this.percentage = this.totalPoints > 0 ? (this.score / this.totalPoints) * 100 : 0;
  this.passed = this.percentage >= quiz.passingScore;
  
  // Check if all essay questions are graded
  const allEssaysGraded = this.answers
    .filter(a => {
      const q = quiz.questions.id(a.questionId);
      return q && q.type === 'essay';
    })
    .every(a => a.gradedAt != null);
  
  if (allEssaysGraded) {
    this.fullyGraded = true;
    this.needsManualGrading = false;
    
    // Create gradebook entry if not created yet
    if (!this.gradeItemCreated) {
      await this.createGradeItem();
    } else {
      // Update existing gradebook entry
      const Grade = require('./Grade');
      const grade = await Grade.findById(this.gradeItemId);
      
      if (grade) {
        const item = grade.items.find(i => 
          i.itemType === 'quiz' && i.itemId.toString() === this.quiz.toString()
        );
        
        if (item) {
          item.score = this.score;
          await grade.calculateTotalGrade();
          await grade.save();
        }
      }
    }
  }
  
  await this.save();
  return this;
};

// Static methods

// Get student attempts for a quiz
quizAttemptSchema.statics.getStudentAttempts = function(quizId, studentId) {
  return this.find({
    quiz: quizId,
    student: studentId
  }).sort({ attemptNumber: 1 });
};

// Get best attempt for a student
quizAttemptSchema.statics.getBestAttempt = async function(quizId, studentId) {
  const attempts = await this.find({
    quiz: quizId,
    student: studentId,
    status: 'completed'
  }).sort({ score: -1 });
  
  return attempts.length > 0 ? attempts[0] : null;
};

// Get attempts needing manual grading
quizAttemptSchema.statics.getAttemptsNeedingGrading = function(courseId) {
  return this.find({
    course: courseId,
    status: 'completed',
    needsManualGrading: true,
    fullyGraded: false
  })
    .populate('student', 'name email')
    .populate('quiz', 'title')
    .sort({ completedAt: 1 });
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
