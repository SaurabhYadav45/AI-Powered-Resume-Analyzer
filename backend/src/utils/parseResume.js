/**
 * parseResume Utility
 * @description Extracts plain text from uploaded resume files (PDF or DOCX).
 * It relies on the 'pdf-parse' and 'mammoth' libraries.
 */

// Import the necessary libraries. You will need to install these:
// npm install pdf-parse mammoth
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const parseResume = {
  /**
   * @async
   * @function getText
   * @description Determines the file type and uses the appropriate parser to extract text.
   * @param {object} file - The file object provided by Multer. It contains the file buffer and mimetype.
   * @returns {Promise<string>} A promise that resolves with the extracted plain text from the file.
   * @throws {Error} Throws an error if the file is missing, the type is unsupported, or parsing fails.
   */
  getText: async (file) => {
    if (!file) {
      throw new Error("No file was provided for parsing.");
    }

    const { buffer, mimetype } = file;

    try {
      // Check the mimetype to decide which parser to use
      if (mimetype === 'application/pdf') {
        console.log('--- [Parser] Parsing PDF file... ---');
        const data = await pdf(buffer);
        return data.text;
      } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('--- [Parser] Parsing DOCX file... ---');
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      } else {
        // If the file is neither a PDF nor a DOCX, throw an error.
        throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
      }
    } catch (error) {
        console.error("--- [Parser] Error parsing file: ---", error);
        // Re-throw a more user-friendly error to be caught by the controller.
        throw new Error("Failed to read the content of the resume file.");
    }
  }
};

module.exports = parseResume;
