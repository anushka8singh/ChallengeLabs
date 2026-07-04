// ===========================================
// Authorization Middleware
// Protects routes by checking user role from JWT (Phase 4)
// Must be used AFTER authenticate middleware
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const authorizeRole = (requiredRoles: ('ADMIN' | 'USER')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    const userRole = req.user.role;

    if (!requiredRoles.includes(userRole)) {
      errorResponse(res, 'Insufficient permissions. Admin access required.', 403);
      return;
    }

    next();
  };
};
