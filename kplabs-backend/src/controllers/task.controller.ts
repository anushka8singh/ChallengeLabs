// ===========================================
// Task Controller
// Handles task validation endpoint (Phase 6)
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { validationService } from '../services/validation.service';
import { progressService } from '../services/progress.service';
import { successResponse } from '../utils/apiResponse';
import { StartValidationInput } from '../validators/task.validator';

export class TaskController {
  async validateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { taskId } = req.params;
      const { sessionId } = req.body as StartValidationInput;
      const userId = req.user!.userId;

      const result = await validationService.validateTask(taskId, sessionId, userId);
      successResponse(res, result, 'Task validation completed');
    } catch (error) {
      next(error);
    }
  }

  async getCurrentProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const progress = await progressService.getCurrentProgress(userId);

      if (!progress) {
        successResponse(res, null, 'No active session found');
        return;
      }
      successResponse(res, progress, 'Current progress retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
