const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// Get all notes for an item
router.get('/:itemId', auth, async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
      item: req.params.itemId
    }).sort({ timestamp: 1 });

    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, timestamp, content } = req.body;

    const note = await Note.create({
      user: req.user.id,
      item: itemId,
      timestamp,
      content
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content: req.body.content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
