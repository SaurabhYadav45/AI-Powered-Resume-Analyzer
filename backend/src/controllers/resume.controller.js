/**
 * resume.controller.js (Updated)
 * @description Controller for handling resume analysis, history, and cover letter generation.
 */

const jwt = require('jsonwebtoken');
const parseResume = require('../utils/parseResume');
const aiAnalysis = require('../utils/aiAnalysis');
const Analysis = require('../models/Analysis.model');

const resumeController = {
  analyze: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No resume file was uploaded.' });
      }
      console.log(`--- [Controller] Received file: ${req.file.originalname} (${req.file.mimetype}) ---`);

      const resumeText = await parseResume.getText(req.file);
      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({ message: 'Could not extract text from the resume.' });
      }

      const { jobDescription } = req.body;
      const analysisResult = await aiAnalysis.analyze(resumeText, jobDescription);

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          await Analysis.create({
            user: decoded.id,
            analysisResult: analysisResult,
            fileName: req.file.originalname,
          });
          console.log(`--- [Controller] Analysis saved for user: ${decoded.id} ---`);

        } catch (error) {
          console.log('--- [Controller] Invalid token found. Proceeding as anonymous user. ---');
        }
      } else {
        console.log('--- [Controller] No user token found. Proceeding as anonymous user. ---');
      }

      // We'll also send back the extracted resume text to the frontend
      // so we can use it for the cover letter generation without a second upload.
      res.status(200).json({ analysisResult, resumeText });

    } catch (error) {
      console.error('--- [Controller] An error occurred during analysis: ---', error);
      res.status(500).json({ message: error.message || 'An internal server error occurred.' });
    }
  },

  getHistory: async (req, res) => {
    try {
      const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json(analyses);
    } catch (error) {
      console.error('--- [History Error] ---', error);
      res.status(500).json({ message: 'Server error while fetching analysis history.' });
    }
  },

  /**
   * @async
   * @function generateCoverLetter
   * @description Generates a cover letter using the AI.
   */
  generateCoverLetter: async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume text and job description are required.' });
    }

    try {
      // We will call a new method in our aiAnalysis utility
      const coverLetter = await aiAnalysis.generateCoverLetter(resumeText, jobDescription);
      res.status(200).json({ coverLetter });
    } catch (error) {
      console.error('--- [Cover Letter Error] ---', error);
      res.status(500).json({ message: 'Server error while generating cover letter.' });
    }
  }
};

module.exports = resumeController;
