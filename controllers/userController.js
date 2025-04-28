const asyncHandler = require('express-async-handler');
const pool = require('../config/mysql');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, age, gender, fitnessGoals FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) {
    res.status(404);
    throw new Error('User not found');
  }
  const user = rows[0];
  // fitnessGoals stored as JSON string, parse it
  user.fitnessGoals = user.fitnessGoals ? JSON.parse(user.fitnessGoals) : [];
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) {
    res.status(404);
    throw new Error('User not found');
  }
  const user = rows[0];

  const name = req.body.name || user.name;
  const email = req.body.email || user.email;
  const age = req.body.age || user.age;
  const gender = req.body.gender || user.gender;
  const fitnessGoals = req.body.fitnessGoals ? JSON.stringify(req.body.fitnessGoals) : user.fitnessGoals;

  let password = user.password;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(req.body.password, salt);
  }

  await pool.query(
    'UPDATE users SET name = ?, email = ?, age = ?, gender = ?, fitnessGoals = ?, password = ? WHERE id = ?',
    [name, email, age, gender, fitnessGoals, password, req.user.id]
  );

  res.json({
    id: req.user.id,
    name,
    email,
    age,
    gender,
    fitnessGoals: fitnessGoals ? JSON.parse(fitnessGoals) : []
  });
});

// @desc    Get user workout stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  // This would be enhanced with actual workout stats
  const stats = {
    totalWorkouts: 0,
    totalDuration: 0,
    favoriteWorkout: 'None',
    caloriesBurned: 0
  };

  res.json(stats);
});

const asyncHandler = require('express-async-handler');
const pool = require('../config/mysql');
const bcrypt = require('bcryptjs');

// Existing functions here...

const saveUserPreference = asyncHandler(async (req, res) => {
  const { workoutType, intensity, duration, daysPerWeek, goals } = req.body;
  if (!workoutType || !intensity || !duration || !daysPerWeek) {
    res.status(400);
    throw new Error('Missing required preference fields');
  }

  // Get user name from users table
  const [userRows] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
  if (userRows.length === 0) {
    res.status(404);
    throw new Error('User not found');
  }
  const userName = userRows[0].name;

  // Check if preferences already exist for user
  const [existing] = await pool.query('SELECT id FROM preferences WHERE user_id = ?', [req.user.id]);

  if (existing.length > 0) {
    // Update existing preferences
    await pool.query(
      `UPDATE preferences SET user_name = ?, workoutType = ?, intensity = ?, duration = ?, daysPerWeek = ?, goals = ? WHERE user_id = ?`,
      [userName, workoutType, intensity, duration, daysPerWeek, goals || null, req.user.id]
    );
  } else {
    // Insert new preferences
    await pool.query(
      `INSERT INTO preferences (user_id, user_name, workoutType, intensity, duration, daysPerWeek, goals) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, userName, workoutType, intensity, duration, daysPerWeek, goals || null]
    );
  }

  res.json({ message: 'Preferences saved' });
});

const getUserPreferences = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT user_name, workoutType, intensity, duration, daysPerWeek, goals FROM preferences WHERE user_id = ?',
    [req.user.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Preferences not found' });
  }
  const preferences = rows[0];
  res.json(preferences);
});

// @desc    Save user history action
// @route   POST /api/users/history
// @access  Private
const saveUserHistory = asyncHandler(async (req, res) => {
  const { action } = req.body;
  if (!action) {
    res.status(400);
    throw new Error('Action is required');
  }
  await pool.query(
    'INSERT INTO user_history (user_id, action) VALUES (?, ?)',
    [req.user.id, action]
  );
  res.json({ message: 'User history saved' });
});

// @desc    Get user history
// @route   GET /api/users/history
// @access  Private
const getUserHistory = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT action, action_time FROM user_history WHERE user_id = ? ORDER BY action_time DESC',
    [req.user.id]
  );
  res.json(rows);
});

// @desc    Save scrolling data
// @route   POST /api/users/scrolling
// @access  Private
const saveScrollingData = asyncHandler(async (req, res) => {
  const { page, scroll_position } = req.body;
  if (!page || scroll_position === undefined) {
    res.status(400);
    throw new Error('Page and scroll position are required');
  }
  await pool.query(
    'INSERT INTO scrolling_data (user_id, page, scroll_position) VALUES (?, ?, ?)',
    [req.user.id, page, scroll_position]
  );
  res.json({ message: 'Scrolling data saved' });
});

// @desc    Get scrolling data for a page
// @route   GET /api/users/scrolling/:page
// @access  Private
const getScrollingData = asyncHandler(async (req, res) => {
  const page = req.params.page;
  const [rows] = await pool.query(
    'SELECT scroll_position, scroll_time FROM scrolling_data WHERE user_id = ? AND page = ? ORDER BY scroll_time DESC LIMIT 1',
    [req.user.id, page]
  );
  if (rows.length === 0) {
    return res.json({ scroll_position: 0 });
  }
  res.json(rows[0]);
});

const asyncHandler = require('express-async-handler');
const pool = require('../config/mysql');
const bcrypt = require('bcryptjs');

// Existing functions here...

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, age, gender, email, password, fitnessGoals } = req.body;

  if (!name || !age || !gender || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user
  const [result] = await pool.query(
    'INSERT INTO users (name, age, gender, email, password, fitnessGoals) VALUES (?, ?, ?, ?, ?, ?)',
    [name, age, gender, email, hashedPassword, fitnessGoals ? JSON.stringify(fitnessGoals) : null]
  );

  if (result.affectedRows === 1) {
    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.status(500);
    throw new Error('Failed to register user');
  }
});

module.exports = {
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
};
