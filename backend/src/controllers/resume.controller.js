/**
 * resume.controller.js
 * @description Controller for handling resume analysis logic.
 */

// Import the utility modules we created earlier.
const parseResume = require('../utils/parseResume');
const aiAnalysis = require('../utils/aiAnalysis');

const resumeController = {
  /**
   * @async
   * @function analyze
   * @description Handles the entire resume analysis process.
   * @param {object} req - The Express request object.
   * @param {object} res - The Express response object.
   */
  analyze: async (req, res) => {
    try {
      // Step 1: Validate that a file was uploaded by the multer middleware.
      if (!req.file) {
        // If no file is present, send a 400 Bad Request error.
        return res.status(400).json({ message: 'No resume file was uploaded.' });
      }
      console.log(`--- [Controller] Received file: ${req.file.originalname} (${req.file.mimetype}) ---`);

      // Step 2: Call the parseResume utility to extract text from the file buffer.
      const resumeText = await parseResume.getText(req.file);

      // It's good practice to check if the extracted text is empty.
      if (!resumeText || resumeText.trim() === '') {
        return res.status(400).json({ message: 'Could not extract text from the resume. The file might be empty or corrupted.' });
      }

      // Step 3: Get the optional job description from the request's body.
      const { jobDescription } = req.body;

      // Step 4: Call the aiAnalysis utility with the extracted text.
      const analysisResult = await aiAnalysis.analyze(resumeText, jobDescription);

      // Step 5: If everything is successful, send the analysis result back to the frontend with a 200 OK status.
      console.log('--- [Controller] Sending successful analysis to client. ---');
      res.status(200).json(analysisResult);

    } catch (error) {
      // If any step in the try block fails, this catch block will execute.
      console.error('--- [Controller] An error occurred during analysis: ---', error);
      
      // Send a 500 Internal Server Error response with the error message.
      res.status(500).json({ message: error.message || 'An internal server error occurred during analysis.' });
    }
  }
};

module.exports = resumeController;
