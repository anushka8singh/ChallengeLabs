// ===========================================
// TypeScript Declaration for Express Request
// Extends Request interface with authenticated user
// ===========================================

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export {};
