const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  saveUserPreference,
  getUserPreferences,
  saveUserHistory,
  getUserHistory,
  saveScrollingData,
  getScrollingData,
  registerUser
} = require('../controllers/userController');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/stats', protect, getUserStats);

router.route('/preferences')
  .get(protect, getUserPreferences)
  .post(protect, saveUserPreference);

router.route('/history')
  .get(protect, getUserHistory)
  .post(protect, saveUserHistory);

router.route('/scrolling/:page')
  .get(protect, getScrollingData);

router.post('/scrolling', protect, saveScrollingData);

router.post('/signup', registerUser);

module.exports = router;
