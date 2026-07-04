import { Request, Response, NextFunction } from 'express';
import { progressService } from '../services/progress.service';
import { successResponse } from '../utils/apiResponse';

export class ProgressController {
  async getCurrentProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const progress =
        await progressService.getCurrentProgress(
          userId
        );

      if (!progress) {
        successResponse(
          res,
          null,
          'No active session found'
        );
        return;
      }

      successResponse(
        res,
        progress,
        'Current progress retrieved'
      );
    } catch (error) {
      next(error);
    }
  }

  async getCompletedChallenges(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;

    const completed =
      await progressService.getCompletedChallenges(
        userId
      );

    successResponse(
      res,
      completed,
      'Completed challenges retrieved'
    );
  } catch (error) {
    next(error);
  }
}
}

export const progressController =
  new ProgressController();