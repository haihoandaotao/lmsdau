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
router.get('/dashboard/:courseId', async (req, res) => {
  try {
    // Mock data for now - will implement full logic later
    const stats = {
      completionPercentage: 45,
      completedItems: 12,
      inProgressItems: 5,
      notStartedItems: 8,
      currentStreak: 7,
      longestStreak: 14,
      totalTimeSpent: 1800, // minutes
      avgTimePerDay: 120, // minutes
      badgesEarned: 3
    };
    
    const weeklyProgress = [
      { week: 'Week 1', videosWatched: 5, timeSpent: 3 },
      { week: 'Week 2', videosWatched: 8, timeSpent: 5 },
      { week: 'Week 3', videosWatched: 6, timeSpent: 4 },
      { week: 'Week 4', videosWatched: 10, timeSpent: 6 }
    ];
    
    const achievements = [
      { title: 'First Video', description: 'Watch your first video', icon: '🎬', unlocked: true },
      { title: 'Week Warrior', description: '7-day streak', icon: '🔥', unlocked: true },
      { title: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🎯', unlocked: true },
      { title: 'Note Taker', description: 'Take 10 notes', icon: '📝', unlocked: false },
      { title: 'Speed Learner', description: 'Complete 5 videos in one day', icon: '⚡', unlocked: false },
      { title: 'Course Complete', description: 'Finish the course', icon: '🏆', unlocked: false }
    ];
    
    res.json({
      success: true,
      data: { stats, weeklyProgress, achievements }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/student/:id', getStudentProgress);
router.get('/course/:id', authorize('teacher', 'admin'), getCourseStatistics);

module.exports = router;
