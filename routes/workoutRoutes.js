const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workoutController');

router.route('/')
  .post(protect, addWorkout)
  .get(protect, getWorkouts);

router.route('/:id')
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

module.exports = router;
