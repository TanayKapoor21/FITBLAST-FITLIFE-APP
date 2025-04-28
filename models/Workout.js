const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  workoutType: {
    type: String,
    required: true,
    enum: [
      'Cardio',
      'Strength Training',
      'HIIT',
      'Yoga',
      'Pilates',
      'CrossFit',
      'Swimming',
      'Cycling',
      'Running',
      'Other'
    ]
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries on user workouts
WorkoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', WorkoutSchema);
