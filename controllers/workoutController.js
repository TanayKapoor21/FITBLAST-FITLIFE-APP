const Workout = require('../models/Workout');
const asyncHandler = require('express-async-handler');

// @desc    Add a new workout
// @route   POST /api/workouts
// @access  Private
const addWorkout = asyncHandler(async (req, res) => {
  const { date, workoutType, duration, caloriesBurned, notes } = req.body;

  const workout = await Workout.create({
    user: req.user._id,
    date,
    workoutType,
    duration,
    caloriesBurned,
    notes,
  });

  res.status(201).json(workout);
});

// @desc    Get workout history
// @route   GET /api/workouts
// @access  Private
const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id });
  res.json(workouts);
});

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = asyncHandler(async (req, res) => {
  const { date, workoutType, duration, caloriesBurned, notes } = req.body;

  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  workout.date = date || workout.date;
  workout.workoutType = workoutType || workout.workoutType;
  workout.duration = duration || workout.duration;
  workout.caloriesBurned = caloriesBurned || workout.caloriesBurned;
  workout.notes = notes || workout.notes;

  const updatedWorkout = await workout.save();
  res.json(updatedWorkout);
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  await workout.remove();
  res.json({ message: 'Workout removed' });
});

module.exports = {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
};
