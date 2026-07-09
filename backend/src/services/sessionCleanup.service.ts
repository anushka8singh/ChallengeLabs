import { SessionStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { sessionService } from './session.service';
import { logger } from '../config/logger';

const cleanupLogger = logger.child({
  service: 'session-cleanup',
});

export class SessionCleanupService {
  private isCleanupRunning = false;

  async cleanupExpiredSessions() {
    if (this.isCleanupRunning) {
      cleanupLogger.warn(
        'Cleanup cycle skipped because the previous cycle is still running'
      );
      return;
    }

    this.isCleanupRunning = true;

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
        try {
          await sessionService.expireSession(session.id);
        } catch (error: any) {
          cleanupLogger.error(
            {
              sessionId: session.id,
              containerId: session.containerId,
              error: error.message,
            },
            'Failed cleaning individual expired session'
          );
        }
      }
    } catch (error: any) {
      cleanupLogger.error(
        {
          error: error.message,
        },
        'Failed cleaning expired sessions'
      );
    } finally {
      this.isCleanupRunning = false;
    }
  }
}

export const sessionCleanupService =
  new SessionCleanupService();