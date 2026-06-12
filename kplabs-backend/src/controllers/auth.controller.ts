// ===========================================
// Authentication Controller
// Handles HTTP requests for auth endpoints
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body as RegisterInput;

      const user = await authService.register(name, email, password);

      successResponse(res, user, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as LoginInput;

      const result = await authService.login(email, password);

      successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        errorResponse(res, 'Unauthorized', 401);
        return;
      }

      const user = await authService.getCurrentUser(req.user.userId);

      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
