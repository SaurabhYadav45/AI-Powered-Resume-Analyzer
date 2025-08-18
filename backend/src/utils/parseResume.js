/**
 * parseResume Utility (with OCR)
 * @description Extracts plain text from uploaded files (PDF, DOCX, and Images).
 */

const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { createWorker } = require('tesseract.js'); // 1. Import Tesseract

const parseResume = {
  getText: async (file) => {
    if (!file) {
      throw new Error("No file was provided for parsing.");
    }

    const { buffer, mimetype } = file;

    try {
      // Handle PDF
      if (mimetype === 'application/pdf') {
        console.log('--- [Parser] Parsing PDF file... ---');
        const data = await pdf(buffer);
        return data.text;
      } 
      // Handle DOCX
      else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('--- [Parser] Parsing DOCX file... ---');
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      } 
      // 2. Handle Images (JPG, PNG)
      else if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
        console.log(`--- [Parser] Parsing Image file (${mimetype}) with OCR... ---`);
        const worker = await createWorker('eng'); // 'eng' for English
        const { data: { text } } = await worker.recognize(buffer);
        await worker.terminate(); // Clean up the worker process
        return text;
      } 
      // Handle unsupported types
      else {
        throw new Error('Unsupported file type. Please upload a PDF, DOCX, JPG, or PNG.');
      }
    } catch (error) {
        console.error("--- [Parser] Error parsing file: ---", error);
        throw new Error("Failed to read the content of the resume file.");
    }
  }
};

module.exports = parseResume;
