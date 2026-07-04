// ===========================================
// Session Validation Schemas (Phase 5)
// ===========================================

import { z } from 'zod';

export const startSessionSchema = z.object({
  challengeId: z.string().min(1, 'challengeId is required'),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
