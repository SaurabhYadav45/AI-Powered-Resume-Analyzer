/**
 * @description 
 * The entry point for the backend application.
 * Now includes the logic to connect to the MongoDB database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5001;

// --- Database Connection ---
// We connect to the database before starting the server to ensure
// the application doesn't run without its data source.
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
    
    // Start the Express server only after a successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server is running and listening on port ${PORT}`);
      console.log(`You can access it at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:');
    console.error(error);
    process.exit(1); // Exit the process with an error code
  });
