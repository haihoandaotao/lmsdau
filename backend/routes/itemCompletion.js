const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ItemCompletion = require('../models/ItemCompletion');
const Module = require('../models/Module');

// Mark item as completed (after passing quiz)
router.post('/complete', auth, async (req, res) => {
  try {
    const { itemId, moduleId, courseId, quizScore } = req.body;

    let completion = await ItemCompletion.findOne({
      user: req.user.id,
      item: itemId
    });

    if (completion) {
      completion.completed = quizScore >= 80;
      completion.quizScore = quizScore;
      completion.quizAttempts += 1;
      if (completion.completed) {
        completion.completedAt = new Date();
      }
      await completion.save();
    } else {
      completion = await ItemCompletion.create({
        user: req.user.id,
        item: itemId,
        module: moduleId,
        course: courseId,
        completed: quizScore >= 80,
        quizScore,
        quizAttempts: 1,
        completedAt: quizScore >= 80 ? new Date() : null
      });
    }

    res.json({
      success: true,
      data: completion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check if item is unlocked (sequential learning)
router.get('/check-unlock/:moduleId/:itemId', auth, async (req, res) => {
  try {
    const { moduleId, itemId } = req.params;

    // Get module with items
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Find current item
    const currentItem = module.items.find(item => item._id.toString() === itemId);
    if (!currentItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // First item is always unlocked
    if (currentItem.order === 1) {
      return res.json({
        success: true,
        data: { isUnlocked: true }
      });
    }

    // Find previous item
    const previousItem = module.items.find(item => item.order === currentItem.order - 1);
    if (!previousItem) {
      return res.json({
        success: true,
        data: { isUnlocked: true }
      });
    }

    // Check if previous item is completed
    const completion = await ItemCompletion.findOne({
      user: req.user.id,
      item: previousItem._id,
      completed: true
    });

    if (completion) {
      return res.json({
        success: true,
        data: { isUnlocked: true }
      });
    } else {
      return res.json({
        success: true,
        data: { 
          isUnlocked: false,
          message: `Bạn cần hoàn thành "${previousItem.title}" trước`
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get completion status for all items in a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const completions = await ItemCompletion.find({
      user: req.user.id,
      course: req.params.courseId
    });

    res.json({
      success: true,
      data: completions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
