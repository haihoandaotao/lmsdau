const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const Course = require('../models/Course');

// @desc    Get all forum posts
// @route   GET /api/forum/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const { courseId, category, search } = req.query;
    
    let query = {};
    if (courseId) query.course = courseId;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name email role avatar')
      .populate('course', 'title code')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email role avatar' }
      })
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/forum/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name email role avatar')
      .populate('course', 'title code')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email role avatar' }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create post
// @route   POST /api/forum/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    // Verify user is enrolled in course or is instructor
    const course = await Course.findById(req.body.course);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const isEnrolled = course.enrolledStudents.includes(req.user.id);
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isInstructor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to post'
      });
    }

    req.body.author = req.user.id;
    const post = await ForumPost.create(req.body);

    await post.populate('author', 'name email role avatar');
    await post.populate('course', 'title code');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/forum/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    post = await ForumPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name email role avatar');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/forum/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Delete all comments
    await ForumComment.deleteMany({ post: req.params.id });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/unlike post
// @route   POST /api/forum/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create comment
// @route   POST /api/forum/posts/:id/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await ForumComment.create({
      post: req.params.id,
      author: req.user.id,
      content: req.body.content,
      parentComment: req.body.parentComment,
      attachments: req.body.attachments
    });

    await comment.populate('author', 'name email role avatar');

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update comment
// @route   PUT /api/forum/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    let comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await ForumComment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name email role avatar');

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/forum/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is comment author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark comment as answer
// @route   PUT /api/forum/comments/:id/mark-answer
// @access  Private/Teacher
exports.markAsAnswer = async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id).populate({
      path: 'post',
      populate: { path: 'course' }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user is course instructor or admin
    if (comment.post.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only course instructor can mark answers'
      });
    }

    comment.isAnswer = !comment.isAnswer;
    await comment.save();

    // Update post resolved status
    if (comment.isAnswer) {
      await ForumPost.findByIdAndUpdate(comment.post._id, { isResolved: true });
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
