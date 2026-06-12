// ===========================================
// Challenge and Task Validation Schemas
// Using Zod for request validation (Phase 4)
// ===========================================

import { z } from 'zod';

export const createChallengeSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string()
    .min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  dockerImage: z.string()
    .min(5, "Docker image is required"),
  estimatedMinutes: z.number()
    .int("Estimated minutes must be an integer")
    .min(5, "Estimated time must be at least 5 minutes")
    .max(300, "Estimated time cannot exceed 300 minutes"),
  isPublished: z.boolean().optional().default(false),
});

export const updateChallengeSchema = createChallengeSchema.partial();

export const createTaskSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters"),
  order: z.number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1"),
  hint: z.string().optional(),
  validationRule: z.string().optional(),
  expectedOutcome: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
