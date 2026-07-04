import { SessionStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { sessionService } from './session.service';
import { logger } from '../config/logger';

const cleanupLogger = logger.child({
  service: 'session-cleanup',
});

export class SessionCleanupService {
  async cleanupExpiredSessions() {
    try {
      const expiredSessions = await prisma.session.findMany({
        where: {
          status: SessionStatus.RUNNING,
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (expiredSessions.length === 0) {
        return;
      }

      cleanupLogger.info(
        {
          count: expiredSessions.length,
        },
        'Found expired sessions'
      );

      for (const session of expiredSessions) {
        await sessionService.expireSession(session.id);
      }
    } catch (error: any) {
      cleanupLogger.error(
        {
          error: error.message,
        },
        'Failed cleaning expired sessions'
      );
    }
  }
}

export const sessionCleanupService =
  new SessionCleanupService();