const { verifyToken } = require('@clerk/clerk-sdk-node');
const dotenv = require('dotenv');
dotenv.config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { sub } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    req.userId = sub; // Clerk’s unique userId
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
