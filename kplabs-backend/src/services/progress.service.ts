// ===========================================
// Progress Service
// Calculates user progress for current active session (Phase 6)
// ===========================================

import { sessionRepository } from '../repositories/session.repository';
import { challengeRepository } from '../repositories/challenge.repository';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export interface ProgressData {
  sessionId: string;
  challengeId: string;
  challengeTitle: string;
  completedTasks: number;
  totalTasks: number;
  percentage: number;
  currentTask: { id: string; title: string; order: number } | null;
  lastValidatedAt: string | null;
}

export class ProgressService {
  async getCurrentProgress(userId: string): Promise<ProgressData | null> {
    const session = await sessionRepository.findActiveSessionByUser(userId);
    if (!session) return null;

    const challenge = session.challenge;
    if (!challenge) throw new AppError('Challenge not found for session', 404);

    const tasks = await challengeRepository.findTasksByChallengeId(challenge.id);
    const totalTasks = tasks.length;

    if (totalTasks === 0) {
      return {
        sessionId: session.id,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        completedTasks: 0,
        totalTasks: 0,
        percentage: 100,
        currentTask: null,
        lastValidatedAt: null,
      };
    }

    const passedValidations = await prisma.validationResult.findMany({
      where: { sessionId: session.id, passed: true },
      orderBy: { createdAt: 'desc' },
      select: { taskId: true, createdAt: true },
    });

    const completedTaskIds = new Set(passedValidations.map((v) => v.taskId));
    const completedTasks = completedTaskIds.size;
    const percentage = Math.round((completedTasks / totalTasks) * 100);

    const currentTask = tasks
      .sort((a, b) => a.order - b.order)
      .find((task) => !completedTaskIds.has(task.id)) || null;

    const lastValidatedAt = passedValidations.length > 0 
      ? passedValidations[0].createdAt.toISOString() 
      : null;

    return {
      sessionId: session.id,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      completedTasks,
      totalTasks,
      percentage,
      currentTask: currentTask ? { id: currentTask.id, title: currentTask.title, order: currentTask.order } : null,
      lastValidatedAt,
    };
  }
}

export const progressService = new ProgressService();