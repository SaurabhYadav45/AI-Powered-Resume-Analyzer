/**
 * auth.routes.js
 * @description Defines the API routes for user authentication endpoints.
 */

const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// --- Route Definitions ---

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', authController.login);

module.exports = router;
