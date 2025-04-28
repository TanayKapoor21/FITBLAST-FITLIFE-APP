const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

// @desc    Get all posts
// @route   GET /api/social/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// @desc    Create new post
// @route   POST /api/social/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { content, image } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Post content cannot be empty');
  }

  const post = await Post.create({
    user: req.user._id,
    content,
    image: image || ''
  });

  res.status(201).json(post);
});

// @desc    Like/unlike a post
// @route   PUT /api/social/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likes.includes(req.user._id);

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      id => id.toString() !== req.user._id.toString()
    );
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  res.json(post);
});

// @desc    Add comment to post
// @route   POST /api/social/posts/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Comment cannot be empty');
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = {
    user: req.user._id,
    content
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json(post);
});

module.exports = {
  getPosts,
  createPost,
  likePost,
  addComment
};
