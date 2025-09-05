// middleware/auth.js
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check authentication using cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Check if user still exists
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is no longer valid'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }
    
    // Add user info to request object
    req.user = {
      userId: user._id,
      role: user.role,
      email: user.email
    };
    
    next();  // Continue to next middleware/controller
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error verifying token'
    });
  }
};

// Middleware to check if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized.`
      });
    }
    
    next();
  };
};