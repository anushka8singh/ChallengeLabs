// ===========================================
// Task Controller
// Handles task validation endpoint (Phase 6)
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { validationService } from '../services/validation.service';
import { StartValidationInput } from '../validators/task.validator';

export class TaskController {
  async validateTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { taskId } = req.params;
      const { sessionId } =
        req.body as StartValidationInput;

      const userId = req.user!.userId;

      const result =
        await validationService.validateTask(
          taskId,
          sessionId,
          userId
        );

      res.status(200).json({
        success: true,
        data: result,
        message: 'Task validation completed',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController =
  new TaskController();