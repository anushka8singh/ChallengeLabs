// ===========================================
// Authentication Middleware
// Protects routes by verifying JWT tokens
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { errorResponse } from '../utils/apiResponse';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Authorization token is required', 401);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      errorResponse(res, 'Invalid authorization format', 401);
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request (including role for Phase 4 authorization)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    errorResponse(res, 'Invalid or expired token', 401);
  }
};
