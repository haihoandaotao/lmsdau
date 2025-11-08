const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  updateComment,
  deleteComment,
  markAsAnswer
} = require('../controllers/forumController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Posts routes
router.route('/posts')
  .get(getPosts)
  .post(createPost);

router.route('/posts/:id')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost);

router.post('/posts/:id/like', likePost);
router.post('/posts/:id/comments', createComment);

// Comments routes
router.route('/comments/:id')
  .put(updateComment)
  .delete(deleteComment);

router.put('/comments/:id/mark-answer', authorize('teacher', 'admin'), markAsAnswer);

module.exports = router;
