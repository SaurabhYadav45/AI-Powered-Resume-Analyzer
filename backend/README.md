/*
 * =================================================================
 * README: How to Run This Backend
 * =================================================================
 *
 * 1. File Structure:
 * This single file contains multiple modules for a complete Express.js backend.
 * In your actual project, you would separate these into the folder structure
 * we discussed (e.g., src/controllers, src/routes, etc.).
 *
 * 2. Dependencies:
 * You will need to install the following npm packages:
 * - express: The web framework
 * - cors: For enabling Cross-Origin Resource Sharing
 * - multer: For handling file uploads (multipart/form-data)
 * - pdf-parse: To extract text from PDF files
 * - mammoth: To extract text from .docx files
 * - dotenv: To manage environment variables
 *
 * 3. Installation:
 * Open your terminal in the `backend` directory and run:
 * npm init -y
 * npm install express cors multer pdf-parse mammoth dotenv
 *
 * 4. Create a `.env` file:
 * In the root of your `backend` directory, create a file named `.env`
 * and add the following line (adjust the port if needed):
 * PORT=5001
 *
 * 5. Running the Server:
 * Save this entire code block as `server.js` in your `backend` directory.
 * Then, run the following command in your terminal:
 * node server.js
 *
 * You should see the message "Server running on port 5001".
 * The backend is now ready to receive requests from your Next.js frontend.
 *
 */