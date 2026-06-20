// ===========================================
// Validation Service
// Task Validation Engine + Analytics + Progress support (Phase 6)
// Pluggable architecture for future Docker exec improvements
// ===========================================

import { prisma } from '../config/prisma';
import { dockerService } from './docker.service';
import { sessionRepository } from '../repositories/session.repository';
import { challengeRepository } from '../repositories/challenge.repository';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import { SessionStatus } from '@prisma/client';

const validationLogger = logger.child({ service: 'validation' });

export interface ValidationResult {
  passed: boolean;
  feedback: string;
  exitCode?: number;
  output?: string;
}

export interface IValidationStrategy {
  validate(
    validationRule: string,
    expectedOutcome: string | null,
    containerId: string
  ): Promise<ValidationResult>;
}

/**
 * Default strategy: Run validationRule as shell command inside container.
 * If exitCode === 0 → passed
 */
export class CommandValidationStrategy implements IValidationStrategy {
  async validate(
    validationRule: string,
    expectedOutcome: string | null,
    containerId: string
  ): Promise<ValidationResult> {
    if (!validationRule) {
      return {
        passed: false,
        feedback: 'No validation rule defined for this task',
      };
    }

    try {
      const result = await dockerService.execInContainer(containerId, validationRule);
      const passed = result.exitCode === 0;

      let feedback = expectedOutcome || `Command executed: ${validationRule}`;
      if (!passed) {
        feedback = `Validation failed (exit code ${result.exitCode}). Output: ${result.output || 'No output'}`;
        if (expectedOutcome) feedback += ` | Expected: ${expectedOutcome}`;
      } else {
        feedback = expectedOutcome || `Validation passed successfully`;
      }

      return {
        passed,
        feedback,
        exitCode: result.exitCode,
        output: result.output,
      };
    } catch (error: any) {
      return {
        passed: false,
        feedback: `Validation execution error: ${error.message}`,
      };
    }
  }
}

export class ValidationService {
  private strategy: IValidationStrategy;

  constructor(strategy: IValidationStrategy = new CommandValidationStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IValidationStrategy) {
    this.strategy = strategy;
  }

  async validateTask(taskId: string, sessionId: string, userId: string): Promise<any> {
    const task = await challengeRepository.findTaskById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new AppError('Session not found', 404);
    if (session.userId !== userId) throw new AppError('Unauthorized access to this session', 403);
    if (session.status !== SessionStatus.RUNNING) throw new AppError('Session is not active', 400);
    if (!session.containerId) throw new AppError('No container associated with this session', 400);

    const validationResult = await this.strategy.validate(
      task.validationRule || '',
      task.expectedOutcome || null,
      session.containerId

      
    );

    const savedResult = await prisma.validationResult.create({
      data: {
        sessionId,
        taskId,
        passed: validationResult.passed,
        feedback: validationResult.feedback,
      },
    });

    const eventType = validationResult.passed ? 'VALIDATION_PASSED' : 'VALIDATION_FAILED';
    await prisma.analyticsEvent.create({
      data: {
        userId,
        challengeId: session.challengeId,
        sessionId,
        eventType: eventType as any,
        metadata: {
          taskId,
          taskTitle: task.title,
          exitCode: validationResult.exitCode,
          output: validationResult.output?.substring(0, 500),
        },
      },
    });

    if (validationResult.passed) {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          challengeId: session.challengeId,
          sessionId,
          eventType: 'TASK_COMPLETED' as any,
          metadata: { taskId, taskTitle: task.title },
        },
      });
      await this.checkAndCompleteChallenge(sessionId, userId, session.challengeId);
    }

    validationLogger.info({ taskId, sessionId, userId, passed: validationResult.passed }, 'Task validation completed');

    return {
      validationResult: savedResult,
      passed: validationResult.passed,
      feedback: validationResult.feedback,
      task: { id: task.id, title: task.title },
    };
  }

  private async checkAndCompleteChallenge(sessionId: string, userId: string, challengeId: string): Promise<void> {
    const tasks = await challengeRepository.findTasksByChallengeId(challengeId);
    const totalTasks = tasks.length;
    if (totalTasks === 0) return;

    const passedResults = await prisma.validationResult.findMany({
      where: { sessionId, passed: true },
      select: { taskId: true },
    });

    const uniquePassedTaskIds = new Set(passedResults.map((r) => r.taskId));
    const completedTasks = uniquePassedTaskIds.size;

    if (completedTasks >= totalTasks) {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          challengeId,
          sessionId,
          eventType: 'CHALLENGE_COMPLETED' as any,
          metadata: { completedTasks, totalTasks, completedAt: new Date().toISOString() },
        },
      });
      validationLogger.info({ sessionId, challengeId, userId }, 'Challenge completed');
    }
  }
}

export const validationService = new ValidationService();