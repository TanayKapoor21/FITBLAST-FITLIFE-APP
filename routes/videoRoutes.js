const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getVideos,
  getVideoById,
  getVideosByCategory,
  addVideo
} = require('../controllers/videoController');

router.route('/')
  .get(getVideos)
  .post(protect, admin, addVideo);

router.get('/category/:category', getVideosByCategory);
router.get('/:id', getVideoById);

module.exports = router;
