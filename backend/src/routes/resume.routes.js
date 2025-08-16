/**
 * resume.routes.js (Updated)
 * @description Defines the API routes for resume-related endpoints.
 */

const express = require('express');
const multer = require('multer');
const resumeController = require('../controllers/resume.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// --- Multer Configuration (remains the same) ---
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."), false);
    }
  }
});

// --- Route Definitions ---

// @route   POST /api/resume/analyze
// @desc    Analyze a resume. Saves history if user is logged in.
// @access  Public
router.post('/analyze', upload.single('resume'), resumeController.analyze);

// @route   GET /api/resume/history
// @desc    Get the analysis history for the logged-in user.
// @access  Private (requires a valid token)
router.get('/history', protect, resumeController.getHistory);


module.exports = router;
