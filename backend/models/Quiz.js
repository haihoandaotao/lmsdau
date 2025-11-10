const mongoose = require('mongoose');

// Question schema for different types
const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 1
  },
  
  // For multiple choice
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  
  // For true/false
  correctAnswer: Boolean,
  
  // For short answer / fill in blank
  acceptedAnswers: [String],
  caseSensitive: {
    type: Boolean,
    default: false
  },
  
  // For essay (manual grading needed)
  rubric: String,
  
  // Explanation shown after submission
  explanation: String,
  
  // Order/position
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Questions
  questions: [questionSchema],
  
  // Quiz settings
  totalPoints: {
    type: Number,
    default: 0
  },
  passingScore: {
    type: Number,
    default: 60 // 60%
  },
  
  // Time settings
  timeLimit: {
    type: Number, // in minutes
    default: null // null = no limit
  },
  
  // Attempt settings
  maxAttempts: {
    type: Number,
    default: 1 // 1 = one attempt only
  },
  allowRetake: {
    type: Boolean,
    default: false
  },
  
  // Scheduling
  availableFrom: Date,
  availableUntil: Date,
  dueDate: Date,
  
  // Display settings
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  shuffleOptions: {
    type: Boolean,
    default: false
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
  showAnswersAfter: {
    type: String,
    enum: ['immediate', 'after_due', 'never'],
    default: 'immediate'
  },
  
  // Grading
  autoGrade: {
    type: Boolean,
    default: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
quizSchema.index({ course: 1, status: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ dueDate: 1 });

// Methods
quizSchema.methods.calculateTotalPoints = function() {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  return this.totalPoints;
};

quizSchema.methods.isAvailable = function() {
  const now = new Date();
  
  if (this.status !== 'published') return false;
  if (!this.isActive) return false;
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;
  
  return true;
};

quizSchema.methods.isOverdue = function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate;
};

quizSchema.methods.getShuffledQuestions = function() {
  if (!this.shuffleQuestions) return this.questions;
  
  const shuffled = [...this.questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

quizSchema.methods.getShuffledOptions = function(question) {
  if (!this.shuffleOptions || !question.options) return question.options;
  
  const shuffled = [...question.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Static methods
quizSchema.statics.getActiveQuizzes = function(courseId) {
  return this.find({
    course: courseId,
    status: 'published',
    isActive: true
  }).sort({ dueDate: 1 });
};

quizSchema.statics.getQuizStatistics = async function(quizId) {
  const QuizAttempt = require('./QuizAttempt');
  
  const attempts = await QuizAttempt.find({ quiz: quizId, status: 'completed' });
  
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passingRate: 0
    };
  }
  
  const scores = attempts.map(a => a.percentage);
  const passedCount = attempts.filter(a => a.passed).length;
  
  return {
    totalAttempts: attempts.length,
    uniqueStudents: [...new Set(attempts.map(a => a.student.toString()))].length,
    averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    passingRate: (passedCount / attempts.length) * 100
  };
};

// Hooks
quizSchema.pre('save', function(next) {
  if (this.isModified('questions')) {
    this.calculateTotalPoints();
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
