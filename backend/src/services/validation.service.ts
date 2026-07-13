
// ===========================================
// Validation Service
// Task Validation Engine + Analytics + Progress support (Phase 6/7)
// // Structured Task Validation Engine
// ===========================================

import { prisma } from '../config/prisma';
import { sessionRepository } from '../repositories/session.repository';
import { challengeRepository } from '../repositories/challenge.repository';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import {
  SessionStatus,
  ChallengeTask,
  Session,
} from "@prisma/client";
import {
  ValidationExecutor,
  ValidationResult,
  ValidationTask,
} from "../validation";

const validationLogger = logger.child({ service: 'validation' });

function sanitizeOutput(output?: string): string {
  if (!output) return '';

  return output
    .replace(/\0/g, '')
    .replace(/[^\x20-\x7E\r\n\t]/g, '')
    .substring(0, 500);
}

export class ValidationService {
  private validationExecutor: ValidationExecutor;

  constructor() {
    this.validationExecutor = new ValidationExecutor();
  }

  async validateTask(taskId: string, sessionId: string, userId: string): Promise<any> {
    const task = await challengeRepository.findTaskById(taskId);
    if (!task) throw new AppError('Task not found', 404);

    // ===========================================
    // Prevent duplicate successful validations
    // ===========================================
    const existingPassedValidation = await prisma.validationResult.findFirst({
      where: {
        sessionId,
        taskId,
        passed: true,
      },
    });

    if (existingPassedValidation) {
      return {
        validationResult: existingPassedValidation,
        passed: true,
        feedback: 'Task already completed.',
        task: {
          id: task.id,
          title: task.title,
        },
        alreadyCompleted: true,
      };
    }

    const session = await sessionRepository.findById(sessionId);
    if (!session) throw new AppError('Session not found', 404);
    if (session.userId !== userId) throw new AppError('Unauthorized access to this session', 403);
    if (session.status !== SessionStatus.RUNNING) throw new AppError('Session is not active', 400);
    if (!session.containerId) throw new AppError('No container associated with this session', 400);

    // Decide between legacy and new engine
   const taskValidations =
  await challengeRepository.findTaskValidations(
    task.id
  );

if (taskValidations.length === 0) {
  throw new AppError(
    "This task does not require validation. Please use 'Mark Complete'.",
    400
  );
}

return this.validateWithExecutor(
  task,
  session,
  taskValidations,
  userId
);
  }



 private async validateWithExecutor(
  task: ChallengeTask,
  session: Session,
  taskValidations: ValidationTask[],
  userId: string
): Promise<any> {

  const aggregatedResult =
    await this.validationExecutor.executeAndAggregate(
      session.containerId!,
      taskValidations
    );

  return this.processValidationResult(
    task,
    session,
    userId,
   {
  validationType: taskValidations[0].type,
  passed: aggregatedResult.passed,
  feedback: aggregatedResult.feedback,
  output: aggregatedResult.results
    .map((r) => r.output ?? "")
    .join("\n"),
  exitCode: aggregatedResult.passed ? 0 : 1,
  metadata: {
    validationCount: aggregatedResult.results.length,
  },
  executedAt: new Date(),
  durationMs: aggregatedResult.results.reduce(
    (sum, r) => sum + (r.durationMs ?? 0),
    0
  ),
}
  );

}


async markTaskComplete(
  taskId: string,
  sessionId: string,
  userId: string
): Promise<any> {

  const task = await challengeRepository.findTaskById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const session = await sessionRepository.findById(sessionId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.userId !== userId) {
    throw new AppError(
      "Unauthorized access to this session",
      403
    );
  }

  if (session.status !== SessionStatus.RUNNING) {
    throw new AppError(
      "Session is not active",
      400
    );
  }

  const validations =
    await challengeRepository.findTaskValidations(
      task.id
    );

  if (validations.length > 0) {
    throw new AppError(
      "This task requires validation.",
      400
    );
  }

  const existing =
    await prisma.validationResult.findFirst({
      where: {
        sessionId,
        taskId,
        passed: true,
      },
    });

  if (existing) {
    return {
      validationResult: existing,
      passed: true,
      feedback: "Task already completed.",
      task: {
        id: task.id,
        title: task.title,
      },
      alreadyCompleted: true,
    };
  }

  const savedResult =
    await prisma.validationResult.create({
      data: {
        sessionId,
        taskId,
        passed: true,
        feedback: "Task completed manually.",
      },
    });

  await prisma.analyticsEvent.create({
    data: {
      userId,
      challengeId: session.challengeId,
      sessionId: session.id,
      eventType: "TASK_COMPLETED" as any,
      metadata: {
        taskId: task.id,
        taskTitle: task.title,
      },
    },
  });

  await this.checkAndCompleteChallenge(
    session.id,
    userId,
    session.challengeId
  );

  return {
    validationResult: savedResult,
    passed: true,
    feedback: "Task completed.",
    task: {
      id: task.id,
      title: task.title,
    },
  };
}

  private async processValidationResult(
    task: ChallengeTask,
    session: Session,
    userId: string,
    validationResult: ValidationResult
  ): Promise<any> {
    const savedResult = await prisma.validationResult.create({
      data: {
        sessionId: session.id,
        taskId: task.id,
        passed: validationResult.passed,
        feedback: validationResult.feedback,
      },
    });

    const eventType = validationResult.passed ? 'VALIDATION_PASSED' : 'VALIDATION_FAILED';
    await prisma.analyticsEvent.create({
      data: {
        userId,
        challengeId: session.challengeId,
        sessionId: session.id,
        eventType: eventType as any,
        metadata: {
          taskId: task.id,
          taskTitle: task.title,
          exitCode: validationResult.exitCode,
          output: sanitizeOutput(validationResult.output),
        },
      },
    });

    if (validationResult.passed) {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          challengeId: session.challengeId,
          sessionId: session.id,
          eventType: 'TASK_COMPLETED' as any,
          metadata: { taskId: task.id, taskTitle: task.title },
        },
      });
      await this.checkAndCompleteChallenge(session.id, userId, session.challengeId);
    }

    validationLogger.info(
      { taskId: task.id, sessionId: session.id, userId, passed: validationResult.passed },
      'Task validation completed'
    );

    return {
      validationResult: savedResult,
      passed: validationResult.passed,
      feedback: validationResult.feedback,
      task: { id: task.id, title: task.title },
    };
  }

  private async checkAndCompleteChallenge(
    sessionId: string,
    userId: string,
    challengeId: string
  ): Promise<void> {
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
