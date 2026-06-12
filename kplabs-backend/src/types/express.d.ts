// ===========================================
// TypeScript Declaration for Express Request
// Extends Request interface with authenticated user
// ===========================================

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: 'USER' | 'ADMIN';
      };
    }
  }
}

export {};
