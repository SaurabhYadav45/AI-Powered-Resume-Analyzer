/**
 * auth.middleware.js
 * @description Middleware to protect routes by verifying a JWT.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for the token in the Authorization header
  // The header should be in the format: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database using the ID from the token
      // We attach the user object to the request, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found.' });
      }

      // 5. If everything is valid, call the next middleware/controller
      next();
    } catch (error) {
      console.error('--- [Auth Middleware Error] ---', error);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };
