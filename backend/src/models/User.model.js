/**
 * User.model.js
 * @description Defines the Mongoose schema and model for a User.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true, // Ensures no two users can register with the same email
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  // We can add more fields here later, like username or analysisHistory
}, {
  // Adds createdAt and updatedAt timestamps to each document
  timestamps: true,
});

// 2. Add a "pre-save" Hook for Password Hashing
// This function will automatically run right before a user document is saved to the database.
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a "salt" to add randomness to the hash
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 3. Add a Method to Compare Passwords
// This adds a custom method to every user document that we can call to check their password.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 4. Create and Export the Model
// Mongoose will create a collection named 'users' (plural and lowercase) from this model.
const User = mongoose.model('User', userSchema);

module.exports = User;
