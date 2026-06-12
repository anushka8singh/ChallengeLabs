// ===========================================
// Challenge Repository
// Data access layer for Challenge and ChallengeTask models (Phase 4)
// Handles CRUD with soft delete and published filters
// ===========================================

import { prisma } from '../config/prisma';
import { Challenge, ChallengeTask, Difficulty } from '@prisma/client';
import { CreateChallengeInput, CreateTaskInput, UpdateChallengeInput, UpdateTaskInput } from '../validators/challenge.validator';

type PublishedChallengeSummary = Pick<
  Challenge,
  'id' | 'title' | 'slug' | 'difficulty' | 'estimatedMinutes'
>;

export class ChallengeRepository {
  // ===========================================
  // CHALLENGE QUERIES (Student facing - published only)
  // ===========================================

  async findAllPublished(): Promise<PublishedChallengeSummary[]> {
    return prisma.challenge.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        estimatedMinutes: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findBySlugPublished(slug: string): Promise<Challenge | null> {
    return prisma.challenge.findFirst({
      where: {
        slug,
        isPublished: true,
        deletedAt: null,
      },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            hint: true,
            validationRule: true,
            expectedOutcome: true,
          },
        },
      },
    });
  }

  async findTasksByChallengeId(challengeId: string): Promise<ChallengeTask[]> {
    return prisma.challengeTask.findMany({
      where: { challengeId },
      orderBy: { order: 'asc' },
    });
  }

  // ===========================================
  // ADMIN QUERIES (all challenges, including unpublished)
  // ===========================================

  async findAllForAdmin(): Promise<Challenge[]> {
    return prisma.challenge.findMany({
      where: { deletedAt: null },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Challenge | null> {
    return prisma.challenge.findFirst({
      where: { id, deletedAt: null },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // ===========================================
  // CREATE / UPDATE / DELETE
  // ===========================================

  async create(data: CreateChallengeInput): Promise<Challenge> {
    return prisma.challenge.create({
      data: {
        ...data,
        difficulty: data.difficulty as Difficulty,
      },
    });
  }

  async update(id: string, data: UpdateChallengeInput): Promise<Challenge> {
    return prisma.challenge.update({
      where: { id },
      data: {
        ...data,
        ...(data.difficulty && { difficulty: data.difficulty as Difficulty }),
      },
    });
  }

  async softDelete(id: string): Promise<Challenge> {
    return prisma.challenge.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ===========================================
  // TASK OPERATIONS
  // ===========================================

  async createTask(challengeId: string, data: CreateTaskInput): Promise<ChallengeTask> {
    return prisma.challengeTask.create({
      data: {
        ...data,
        challengeId,
      },
    });
  }

  async updateTask(taskId: string, data: UpdateTaskInput): Promise<ChallengeTask> {
    return prisma.challengeTask.update({
      where: { id: taskId },
      data,
    });
  }

  async deleteTask(taskId: string): Promise<ChallengeTask> {
    return prisma.challengeTask.delete({
      where: { id: taskId },
    });
  }

  async findTaskById(taskId: string): Promise<ChallengeTask | null> {
    return prisma.challengeTask.findUnique({
      where: { id: taskId },
    });
  }
}

export const challengeRepository = new ChallengeRepository();
