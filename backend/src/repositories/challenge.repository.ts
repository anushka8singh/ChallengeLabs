// ===========================================
// Challenge Repository
// Data access layer for Challenge and ChallengeTask models (Phase 4)
// Handles CRUD with soft delete and published filters
// ===========================================

import { prisma } from '../config/prisma';
import {
  Challenge,
  ChallengeTask,
  Difficulty,
  Prisma,
  ValidationType as PrismaValidationType,
} from '@prisma/client';
import { CreateChallengeInput, CreateTaskInput, UpdateChallengeInput, UpdateTaskInput } from '../validators/challenge.validator';
import { ValidationTask } from "../validation/types/ValidationTask";
import { ValidationType } from "../validation/types/ValidationType";



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
  orderBy: { order: "asc" },
  select: {
    id: true,
    title: true,
    description: true,
    order: true,
    hint: true,

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

  async createTask(
  challengeId: string,
  data: CreateTaskInput
): Promise<ChallengeTask> {
  const {
    validationType,
    validationConfig,
    ...taskData
  } = data;

  return prisma.challengeTask.create({
    data: {
      ...taskData,
      challengeId,
    },
  });
}


async createStructuredTaskValidation(
  taskId: string,
  type: PrismaValidationType,
  config: Prisma.InputJsonValue
) {
  return prisma.taskValidation.create({
    data: {
      taskId,
      type,
      config,
      order: 1,
      isRequired: true,
    },
  });
}

async updateStructuredTaskValidation(
  validationId: string,
  type: PrismaValidationType,
  config: Prisma.InputJsonValue
) {
  return prisma.taskValidation.update({
    where: {
      id: validationId,
    },
    data: {
      type,
      config,
    },
  });
}

  async updateTask(
  taskId: string,
  data: UpdateTaskInput
): Promise<ChallengeTask> {
  const {
    validationType,
    validationConfig,
    ...taskData
  } = data;

  return prisma.challengeTask.update({
    where: {
      id: taskId,
    },
    data: taskData,
  });
}

  async deleteTask(taskId: string): Promise<ChallengeTask> {
    return prisma.challengeTask.delete({
      where: { id: taskId },
    });
  }

  async findTaskById(taskId: string) {
  return prisma.challengeTask.findUnique({
    where: {
      id: taskId,
    },
    include: {
      validations: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

async findTaskValidations(
  taskId: string
): Promise<ValidationTask[]> {

  const validations =
    await prisma.taskValidation.findMany({
      where: {
        taskId,
      },
      orderBy: {
        order: "asc",
      },
    });

  return validations.map((validation) => ({
    type: validation.type as unknown as ValidationType,
    config: validation.config,
    required: validation.isRequired,
    order: validation.order,
    description: validation.description ?? undefined,
  }));
}

}

export const challengeRepository = new ChallengeRepository();
