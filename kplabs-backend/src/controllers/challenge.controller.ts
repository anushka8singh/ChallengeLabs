// ===========================================
// Challenge Controller
// Handles HTTP requests for Challenge APIs (Phase 4)
// Uses service layer for business logic
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { challengeService } from '../services/challenge.service';
import { successResponse } from '../utils/apiResponse';
import { CreateChallengeInput, CreateTaskInput, UpdateChallengeInput, UpdateTaskInput } from '../validators/challenge.validator';

export class ChallengeController {
  // ===========================================
  // STUDENT APIs (No auth required for viewing)
  // ===========================================

  async getAllChallenges(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const challenges = await challengeService.getAllChallenges();
      successResponse(res, challenges, 'Challenges retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getChallengeBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const challenge = await challengeService.getChallengeBySlug(slug);
      successResponse(res, challenge, 'Challenge retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getTasksForChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const tasks = await challengeService.getTasksForChallenge(id);
      successResponse(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // ===========================================
  // ADMIN APIs (Require ADMIN role)
  // ===========================================

  async getAllChallengesForAdmin(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const challenges = await challengeService.getAllChallengesForAdmin();
      successResponse(res, challenges, 'All challenges retrieved (admin view)');
    } catch (error) {
      next(error);
    }
  }

  async createChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as CreateChallengeInput;
      const userRole = req.user?.role || 'USER';

      const challenge = await challengeService.createChallenge(data, userRole);
      successResponse(res, challenge, 'Challenge created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body as UpdateChallengeInput;
      const userRole = req.user?.role || 'USER';

      const challenge = await challengeService.updateChallenge(id, data, userRole);
      successResponse(res, challenge, 'Challenge updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userRole = req.user?.role || 'USER';

      await challengeService.deleteChallenge(id, userRole);
      successResponse(res, { message: 'Challenge deleted successfully' }, 'Challenge soft deleted');
    } catch (error) {
      next(error);
    }
  }

  // Task management
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: challengeId } = req.params;
      const data = req.body as CreateTaskInput;
      const userRole = req.user?.role || 'USER';

      const task = await challengeService.createTask(challengeId, data, userRole);
      successResponse(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: taskId } = req.params;
      const data = req.body as UpdateTaskInput;
      const userRole = req.user?.role || 'USER';

      const task = await challengeService.updateTask(taskId, data, userRole);
      successResponse(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: taskId } = req.params;
      const userRole = req.user?.role || 'USER';

      await challengeService.deleteTask(taskId, userRole);
      successResponse(res, { message: 'Task deleted successfully' }, 'Task deleted');
    } catch (error) {
      next(error);
    }
  }
}

export const challengeController = new ChallengeController();
