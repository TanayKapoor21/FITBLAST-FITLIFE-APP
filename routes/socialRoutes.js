const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPosts,
  createPost,
  likePost,
  addComment
} = require('../controllers/socialController');

router.route('/posts')
  .get(getPosts)
  .post(protect, createPost);

router.put('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comments', protect, addComment);

module.exports = router;
