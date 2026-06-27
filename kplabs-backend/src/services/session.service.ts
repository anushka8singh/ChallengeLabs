// ===========================================
// Session Service
// Core business logic for lab session + Docker container lifecycle (Phase 5)
// Integrates with existing Challenge and Session models
// ===========================================

import { SessionStatus } from '@prisma/client';
import { dockerService } from './docker.service';
import { sessionRepository } from '../repositories/session.repository';
import { challengeRepository } from '../repositories/challenge.repository';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

const sessionLogger = logger.child({ service: 'session' });

export class SessionService {
  private readonly SESSION_DURATION_MINUTES = 60;

  /**
   * Start a new lab session for a user on a challenge
   */
  async startSession(userId: string, challengeId: string) {
    // 1. Verify challenge exists and is published
    const challenge = await challengeRepository.findById(challengeId);
    if (!challenge || !challenge.isPublished || challenge.deletedAt) {
      throw new AppError('Challenge not found or not available', 404);
    }

    
    // 2. Check if user already has an active session for this challenge
    // 2. Check for any active session
const activeSession =
  await sessionRepository.findActiveSessionByUser(
    userId
  );

// User already has an active session
if (activeSession) {

  // Same challenge -> resume
  if (
    activeSession.challengeId ===
    challengeId
  ) {
    return {
      session: activeSession,
      containerId: activeSession.containerId,
      expiresAt: activeSession.expiresAt,
      resumed: true,
    };
  }

  // Different challenge -> ask frontend
  throw new AppError(
    JSON.stringify({
      code: 'SESSION_CONFLICT',
      currentSessionId: activeSession.id,
      currentChallengeId:
        activeSession.challengeId,
      currentChallengeTitle:
        activeSession.challenge.title,
    }),
    409
  );
}

    // 3. Check Docker availability
    const dockerAvailable = await dockerService.isDockerAvailable();
    if (!dockerAvailable) {
      throw new AppError('Docker service is currently unavailable', 503);
    }

    let containerId: string | null = null;
    let newSession: any = null;

    try {
      // 4. Pull image if missing
      await dockerService.pullImage(challenge.dockerImage);

      // 5. Create container
      const { containerId: newContainerId } = await dockerService.createContainer(
        challenge.dockerImage,
        userId,
        challengeId
      );
      containerId = newContainerId;

      // 6. Start container
      await dockerService.startContainer(containerId);

      // 7. Calculate expiration
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION_MINUTES * 60 * 1000);

      // 8. Create Session record in DB
      newSession = await sessionRepository.createSession({
        userId,
        challengeId,
        containerId,
        status: SessionStatus.RUNNING,
        expiresAt,
      });

      sessionLogger.info(
        {
          sessionId: newSession.id,
          userId,
          challengeId,
          containerId,
        },
        'Lab session started successfully'
      );

      return {
        session: newSession,
        containerId,
        expiresAt: newSession.expiresAt,
      };
    } catch (error: any) {
      sessionLogger.error(
        { userId, challengeId, error: error.message },
        'Failed to start lab session'
      );

      // Cleanup: stop and remove container if it was created
      if (containerId) {
        try {
          await dockerService.stopContainer(containerId);
          await dockerService.removeContainer(containerId);
        } catch (cleanupError) {
          sessionLogger.warn({ containerId, error: cleanupError }, 'Cleanup failed');
        }
      }

      // Mark as failed if session was created
      if (newSession) {
        await sessionRepository.failSession(newSession.id);
      }

      throw new AppError(`Failed to start lab session: ${error.message}`, 500);
    }
  }

  
  /**
   * Get current active session for user
   */
  async getCurrentSession(userId: string) {
    const session = await sessionRepository.findActiveSessionByUser(userId);
    if (!session) {
      return null;
    }

    // Check if expired
    if (session.expiresAt < new Date() && session.status === SessionStatus.RUNNING) {
      await this.expireSession(session.id);
      return null;
    }

    return session;
  }

  /**
   * Stop current session (manual stop by user)
   */
  async stopSession(userId: string) {
    const session = await sessionRepository.findActiveSessionByUser(userId);
    if (!session) {
      throw new AppError('No active session found', 404);
    }

    if (session.containerId) {
      try {
        await dockerService.stopContainer(session.containerId);
        await dockerService.removeContainer(session.containerId);
      } catch (error: any) {
        sessionLogger.warn(
          { sessionId: session.id, containerId: session.containerId, error: error.message },
          'Error stopping container (may already be stopped)'
        );
      }
    }

    const updatedSession = await sessionRepository.stopSession(session.id);

    sessionLogger.info({ sessionId: session.id, userId }, 'Session stopped by user');

    return updatedSession;
  }

  /**
   * Reset session: stop old container, create fresh one
   */
  async resetSession(userId: string) {
    const currentSession = await sessionRepository.findActiveSessionByUser(userId);
    if (!currentSession) {
      throw new AppError('No active session to reset', 404);
    }

    const challengeId = currentSession.challengeId;

    // Stop and remove current container
    if (currentSession.containerId) {
      try {
        await dockerService.stopContainer(currentSession.containerId);
        await dockerService.removeContainer(currentSession.containerId);
      } catch (error) {
        sessionLogger.warn({ error }, 'Error cleaning up old container during reset');
      }
    }

    // Mark old session as stopped
    await sessionRepository.stopSession(currentSession.id);

    // Start fresh session
    return this.startSession(userId, challengeId);
  }

  /**
   * Expire a session (called when time runs out)
   */
  async expireSession(sessionId: string) {
    const session = await sessionRepository.findById(sessionId);
    if (!session || session.status !== SessionStatus.RUNNING) {
      return;
    }

    if (session.containerId) {
      try {
        await dockerService.stopContainer(session.containerId);
        await dockerService.removeContainer(session.containerId);
      } catch (error) {
        sessionLogger.warn({ sessionId, error }, 'Error cleaning up expired container');
      }
    }

    await sessionRepository.expireSession(sessionId);
    sessionLogger.info({ sessionId }, 'Session expired and cleaned up');
  }

  /**
   * Get session details by ID (with authorization check)
   */
  async getSessionById(sessionId: string, userId: string) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new AppError('Session not found', 404);
    }

    if (session.userId !== userId) {
      throw new AppError('Unauthorized access to session', 403);
    }

    return session;
  }
}

export const sessionService = new SessionService();
