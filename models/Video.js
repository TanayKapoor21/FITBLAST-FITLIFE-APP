const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Cardio',
      'Strength',
      'Flexibility',
      'HIIT',
      'Yoga',
      'Beginner',
      'Advanced',
      'Nutrition'
    ]
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
});

// Index for faster category-based queries
VideoSchema.index({ category: 1 });

module.exports = mongoose.model('Video', VideoSchema);
