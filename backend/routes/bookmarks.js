const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');

// Get all bookmarks for an item
router.get('/:itemId', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
      item: req.params.itemId
    }).sort({ timestamp: 1 });

    res.json({
      success: true,
      data: bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create bookmark
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, timestamp, title, description } = req.body;

    const bookmark = await Bookmark.create({
      user: req.user.id,
      item: itemId,
      timestamp,
      title: title || `Bookmark at ${Math.floor(timestamp)}s`,
      description
    });

    res.status(201).json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete bookmark
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.json({
      success: true,
      message: 'Bookmark deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
