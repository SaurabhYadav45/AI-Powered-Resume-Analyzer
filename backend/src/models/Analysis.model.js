/**
 * Analysis.model.js
 * @description Defines the Mongoose schema and model for storing a single resume analysis result.
 */

const mongoose = require('mongoose');

// 1. Define the Analysis Schema
const analysisSchema = new mongoose.Schema({
  // This creates a direct link to a document in the 'users' collection.
  // It's how we know who owns this analysis.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This tells Mongoose the 'user' field refers to the 'User' model.
  },
  // We store the entire analysis object that we get back from the AI.
  // The `type: Object` allows us to store the flexible JSON structure.
  analysisResult: {
    type: Object,
    required: true,
  },
  // We can also store the name of the file that was analyzed for user reference.
  fileName: {
    type: String,
    required: true,
  }
}, {
  // Adds createdAt and updatedAt timestamps automatically.
  // The `createdAt` timestamp is especially useful for sorting the history.
  timestamps: true,
});

// 2. Create and Export the Model
// Mongoose will create a collection named 'analyses' from this model.
const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
