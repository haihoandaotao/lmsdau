const VideoProgress = require('../models/VideoProgress');
const Module = require('../models/Module');
const Course = require('../models/Course');

// @desc    Update video progress
// @route   POST /api/video-progress
// @access  Private/Student
exports.updateVideoProgress = async (req, res) => {
  try {
    const { courseId, moduleId, itemId, currentTime, totalDuration } = req.body;
    
    // Validate course enrollment
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    // Find or create progress record
    let progress = await VideoProgress.findOne({
      user: req.user.id,
      course: courseId,
      module: moduleId,
      itemId
    });
    
    if (!progress) {
      progress = new VideoProgress({
        user: req.user.id,
        course: courseId,
        module: moduleId,
        itemId,
        currentTime: 0,
        totalDuration,
        watchedPercentage: 0
      });
    }
    
    // Update progress
    await progress.updateProgress(currentTime, totalDuration);
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get video progress
// @route   GET /api/video-progress/item/:itemId
// @access  Private/Student
exports.getVideoProgress = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const progress = await VideoProgress.findOne({
      user: req.user.id,
      itemId
    });
    
    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          currentTime: 0,
          watchedPercentage: 0,
          isCompleted: false
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course progress
// @route   GET /api/video-progress/course/:courseId
// @access  Private/Student
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Validate course enrollment
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khóa học'
      });
    }
    
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    const progress = await VideoProgress.getCourseProgress(req.user.id, courseId);
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get module progress
// @route   GET /api/video-progress/module/:moduleId
// @access  Private/Student
exports.getModuleProgress = async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    // Get module
    const module = await Module.findById(moduleId).populate('course');
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Check enrollment
    if (!module.course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chưa đăng ký khóa học này'
      });
    }
    
    // Get progress for all video items
    const videoItems = module.items.filter(item => item.type === 'video');
    const itemIds = videoItems.map(item => item._id);
    
    const progressRecords = await VideoProgress.find({
      user: req.user.id,
      itemId: { $in: itemIds }
    });
    
    // Calculate stats
    const totalVideos = videoItems.length;
    const completedVideos = progressRecords.filter(p => p.isCompleted).length;
    const totalWatchedTime = progressRecords.reduce((sum, p) => sum + p.currentTime, 0);
    
    const completionPercentage = totalVideos > 0 
      ? Math.round((completedVideos / totalVideos) * 100) 
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        moduleId,
        totalVideos,
        completedVideos,
        completionPercentage,
        totalWatchedTime,
        progressRecords
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if next item is unlocked
// @route   GET /api/video-progress/check-unlock/:moduleId/:itemId
// @access  Private/Student
exports.checkItemUnlock = async (req, res) => {
  try {
    const { moduleId, itemId } = req.params;
    
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy module'
      });
    }
    
    // Find item
    const itemIndex = module.items.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung'
      });
    }
    
    // First item is always unlocked
    if (itemIndex === 0) {
      return res.status(200).json({
        success: true,
        data: { isUnlocked: true }
      });
    }
    
    // Check unlock condition
    if (module.unlockCondition === 'none') {
      return res.status(200).json({
        success: true,
        data: { isUnlocked: true }
      });
    }
    
    if (module.unlockCondition === 'sequential') {
      // Check if previous item is completed
      const previousItem = module.items[itemIndex - 1];
      
      if (previousItem.type === 'video') {
        const progress = await VideoProgress.findOne({
          user: req.user.id,
          itemId: previousItem._id
        });
        
        const isUnlocked = progress && progress.isCompleted;
        
        return res.status(200).json({
          success: true,
          data: { 
            isUnlocked,
            message: isUnlocked ? null : 'Bạn cần hoàn thành video trước đó'
          }
        });
      } else {
        // For non-video items, assume completed (can add more logic later)
        return res.status(200).json({
          success: true,
          data: { isUnlocked: true }
        });
      }
    }
    
    // Other unlock conditions can be added here
    res.status(200).json({
      success: true,
      data: { isUnlocked: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark video as completed manually
// @route   POST /api/video-progress/complete/:itemId
// @access  Private/Student
exports.markVideoCompleted = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { courseId, moduleId } = req.body;
    
    let progress = await VideoProgress.findOne({
      user: req.user.id,
      itemId
    });
    
    if (!progress) {
      progress = new VideoProgress({
        user: req.user.id,
        course: courseId,
        module: moduleId,
        itemId,
        currentTime: 0,
        totalDuration: 0,
        watchedPercentage: 100,
        isCompleted: true
      });
    } else {
      progress.isCompleted = true;
      progress.watchedPercentage = 100;
    }
    
    await progress.save();
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
