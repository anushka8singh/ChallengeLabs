// ===========================================
// Session Controller
// HTTP handlers for lab session endpoints (Phase 5)
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';
import { successResponse } from '../utils/apiResponse';
import { StartSessionInput } from '../validators/session.validator';

export class SessionController {
  async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { challengeId } = req.body as StartSessionInput;
      const userId = req.user!.userId;

      const result = await sessionService.startSession(userId, challengeId);

      successResponse(res, result, 'Lab session started successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const session = await sessionService.getCurrentSession(userId);

      if (!session) {
        successResponse(res, null, 'No active session');
        return;
      }

      successResponse(res, session, 'Current session retrieved');
    } catch (error) {
      next(error);
    }
  }

  async stopSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const session = await sessionService.stopSession(userId);

      successResponse(res, session, 'Session stopped successfully');
    } catch (error) {
      next(error);
    }
  }

  async resetSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      const result = await sessionService.resetSession(userId);

      successResponse(res, result, 'Session reset successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const session = await sessionService.getSessionById(id, userId);

      successResponse(res, session, 'Session details retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const sessionController = new SessionController();
