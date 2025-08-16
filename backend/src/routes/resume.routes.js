/**
 * resume.routes.js
 * @description Defines the API routes for resume-related endpoints.
 */

const express = require('express');
const multer = require('multer');
const resumeController = require('../controllers/resume.controller');

const router = express.Router();

// --- Multer Configuration ---
// We configure multer to store the uploaded file in memory as a buffer.
// This is efficient because we don't need to save the file to the disk;
// we just need to process its contents and then it can be discarded.
const storage = multer.memoryStorage();

// We also set limits and a file filter to ensure users only upload
// the correct file types (PDF/DOCX) and do not upload excessively large files.
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true); // Accept the file
    } else {
      // Reject the file
      cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."), false);
    }
  }
});

// --- Route Definition ---
// Define a POST route at the path '/analyze'.
// 1. The request first hits the `upload.single('resume')` middleware.
//    - `upload.single()` tells multer to expect one file.
//    - `'resume'` is the field name from the frontend form data.
// 2. If the file is valid, multer processes it and attaches it to `req.file`.
// 3. The request is then passed to the `resumeController.analyze` function.
router.post('/analyze', upload.single('resume'), resumeController.analyze);

module.exports = router;
