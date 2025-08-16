/**
 * app.js
 * @description The core Express application configuration file.
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const resumeRoutes = require('./routes/resume.routes');
const authRoutes = require('./routes/auth.routes'); // 1. Import the new auth routes

const app = express();

// --- Global Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Resume Analyzer API is up and running!');
});

// Mount the resume routes
app.use('/api/resume', resumeRoutes);
// 2. Mount the new auth routes
app.use('/api/auth', authRoutes);


// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error('--- [Global Error Handler] An error occurred: ---', err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  }
  
  if (err.message === "Invalid file type. Only PDF and DOCX files are allowed.") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

module.exports = app;
