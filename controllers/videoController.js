const Video = require('../models/Video');
const asyncHandler = require('express-async-handler');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  
  const videos = await Video.find(query).sort({ uploadDate: -1 });
  res.json(videos);
});

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  
  if (video) {
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } else {
    res.status(404);
    throw new Error('Video not found');
  }
});

// @desc    Get videos by category
// @route   GET /api/videos/category/:category
// @access  Public
const getVideosByCategory = asyncHandler(async (req, res) => {
  const videos = await Video.find({ 
    category: req.params.category 
  }).sort({ uploadDate: -1 });
  
  res.json(videos);
});

// @desc    Add new video (Admin only)
// @route   POST /api/videos
// @access  Private/Admin
const addVideo = asyncHandler(async (req, res) => {
  const { title, description, url, category, thumbnail, duration } = req.body;
  
  if (!title || !description || !url || !category || !duration) {
    res.status(400);
    throw new Error('Please include all required fields');
  }
  
  const video = await Video.create({
    title,
    description,
    url,
    category,
    thumbnail: thumbnail || '',
    duration
  });
  
  res.status(201).json(video);
});

module.exports = {
  getVideos,
  getVideoById,
  getVideosByCategory,
  addVideo
};
