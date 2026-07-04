// ===========================================
// Challenge Service
// Business logic for Challenge Management (Phase 4)
// Handles authorization checks, validation, and data transformation
// ===========================================

import { challengeRepository } from '../repositories/challenge.repository';
import { AppError } from '../middleware/errorHandler';
import { CreateChallengeInput, CreateTaskInput, UpdateChallengeInput, UpdateTaskInput } from '../validators/challenge.validator';

export class ChallengeService {
  // ===========================================
  // STUDENT ENDPOINTS (Public access for viewing)
  // ===========================================

  async getAllChallenges() {
    return challengeRepository.findAllPublished();
  }

  async getChallengeBySlug(slug: string) {
    const challenge = await challengeRepository.findBySlugPublished(slug);
    if (!challenge) {
      throw new AppError('Challenge not found or not published', 404);
    }
    return challenge;
  }

  async getTasksForChallenge(challengeId: string) {
    // Verify challenge exists and is published
    const challenge = await challengeRepository.findById(challengeId);
    if (!challenge || !challenge.isPublished || challenge.deletedAt) {
      throw new AppError('Challenge not found or not published', 404);
    }
    return challengeRepository.findTasksByChallengeId(challengeId);
  }

  // Note: Hints are included in getChallengeBySlug and getTasks

  // ===========================================
  // ADMIN ENDPOINTS (Require ADMIN role)
  // ===========================================

  async getAllChallengesForAdmin() {
    return challengeRepository.findAllForAdmin();
  }

  
 async getChallengeByIdForAdmin(id: string) {
  const challenge =
    await challengeRepository.findById(id);

  if (!challenge) {
    throw new AppError(
      'Challenge not found',
      404
    );
  }

  return challenge;
}

  async createChallenge(data: CreateChallengeInput, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new AppError('Only admins can create challenges', 403);
    }
    return challengeRepository.create(data);
  }

  async updateChallenge(id: string, data: UpdateChallengeInput, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new AppError('Only admins can update challenges', 403);
    }

    const existing = await challengeRepository.findById(id);
    if (!existing) {
      throw new AppError('Challenge not found', 404);
    }

    return challengeRepository.update(id, data);
  }

  async deleteChallenge(id: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new AppError('Only admins can delete challenges', 403);
    }

    const existing = await challengeRepository.findById(id);
    if (!existing) {
      throw new AppError('Challenge not found', 404);
    }

    return challengeRepository.softDelete(id);
  }

  // Task management
  async createTask(
  challengeId: string,
  data: CreateTaskInput,
  userRole: string
) {
  if (userRole !== "ADMIN") {
    throw new AppError(
      "Only admins can create tasks",
      403
    );
  }

  const challenge =
    await challengeRepository.findById(
      challengeId
    );

  if (!challenge) {
    throw new AppError(
      "Challenge not found",
      404
    );
  }

  // Create ChallengeTask
  const task =
    await challengeRepository.createTask(
      challengeId,
      data
    );

  // Automatically create default COMMAND validation
  if (
    data.validationRule &&
    data.validationRule.trim() !== ""
  ) {
    await challengeRepository.createTaskValidation(
      task.id,
      data.validationRule,
      data.expectedOutcome
    );
  }

  return task;
}

async getTaskById(taskId: string) {
  const task =
    await challengeRepository.findTaskById(taskId);

  if (!task) {
    throw new AppError(
      'Task not found',
      404
    );
  }

  return task;
}
  async updateTask(
  taskId: string,
  data: UpdateTaskInput,
  userRole: string
) {
  if (userRole !== "ADMIN") {
    throw new AppError(
      "Only admins can update tasks",
      403
    );
  }

  const existingTask =
    await challengeRepository.findTaskById(taskId);

  if (!existingTask) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  // Update the task first
  const updatedTask =
    await challengeRepository.updateTask(
      taskId,
      data
    );

  // Keep COMMAND validation in sync
  if (
    data.validationRule !== undefined
  ) {

    const existingValidation =
      await challengeRepository.findCommandValidation(
        taskId
      );

    if (existingValidation) {

      await challengeRepository.updateTaskValidation(
        existingValidation.id,
        data.validationRule,
        data.expectedOutcome
      );

    } else if (
      data.validationRule.trim() !== ""
    ) {

      await challengeRepository.createTaskValidation(
        taskId,
        data.validationRule,
        data.expectedOutcome
      );

    }

  }

  return updatedTask;
}

  async deleteTask(taskId: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new AppError('Only admins can delete tasks', 403);
    }

    const task = await challengeRepository.findTaskById(taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return challengeRepository.deleteTask(taskId);
  }
}

export const challengeService = new ChallengeService();
