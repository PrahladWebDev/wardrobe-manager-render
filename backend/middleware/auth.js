import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("Incoming Authorization header:", authHeader); // 👈 Debug

  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded); // 👈 Debug
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message); // 👈 Debug
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
