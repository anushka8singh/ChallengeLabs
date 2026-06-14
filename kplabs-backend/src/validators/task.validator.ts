// ===========================================
// Task Validation Schemas (Phase 6)
// ===========================================

import { z } from 'zod';

export const validateTaskSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
});

export type StartValidationInput = z.infer<typeof validateTaskSchema>;