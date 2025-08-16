/**
 * auth.controller.js
 * @description Controller for handling user signup and login.
 */

const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// A helper function to generate a JWT
const generateToken = (id) => {
  // jwt.sign takes a payload (the user's ID), a secret key, and options (like expiration).
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

const authController = {
  /**
   * @async
   * @function signup
   * @description Registers a new user.
   */
  signup: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      // Create a new user
      const user = await User.create({
        email,
        password, // The password will be automatically hashed by the pre-save hook in the model
      });

      if (user) {
        // If user creation is successful, generate a token and send it back
        const token = generateToken(user._id);
        res.status(201).json({
          message: 'User registered successfully.',
          token,
          email: user.email,
        });
      } else {
        res.status(400).json({ message: 'Invalid user data.' });
      }
    } catch (error) {
      console.error('--- [Signup Error] ---', error);
      res.status(500).json({ message: 'Server error during user registration.' });
    }
  },

  /**
   * @async
   * @function login
   * @description Authenticates an existing user.
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by their email
      const user = await User.findOne({ email });

      // If user exists and the password is correct...
      // (we use the comparePassword method we defined in the User model)
      if (user && (await user.comparePassword(password))) {
        // Generate a token and send it back
        const token = generateToken(user._id);
        res.status(200).json({
          message: 'User logged in successfully.',
          token,
          email: user.email,
        });
      } else {
        // If user not found or password incorrect, send a generic error
        res.status(401).json({ message: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error('--- [Login Error] ---', error);
      res.status(500).json({ message: 'Server error during login.' });
    }
  },
};

module.exports = authController;
