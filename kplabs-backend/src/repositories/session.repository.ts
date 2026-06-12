// ===========================================
// Session Repository
// Data access layer for Session model (Phase 5)
// Uses existing Prisma Session model - no new models created
// ===========================================

import { prisma } from '../config/prisma';
import { Session, SessionStatus } from '@prisma/client';

export class SessionRepository {
  async createSession(data: {
    userId: string;
    challengeId: string;
    containerId: string;
    status: SessionStatus;
    expiresAt: Date;
  }): Promise<Session> {
    return prisma.session.create({
      data,
    });
  }

  async findActiveSessionByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<Session | null> {
    return prisma.session.findFirst({
      where: {
        userId,
        challengeId,
        status: {
          in: [SessionStatus.CREATING, SessionStatus.RUNNING],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActiveSessionByUser(userId: string): Promise<Session | null> {
    return prisma.session.findFirst({
      where: {
        userId,
        status: {
          in: [SessionStatus.CREATING, SessionStatus.RUNNING],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        challenge: true,
      },
    });
  }

  async findById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id },
      include: {
        challenge: true,
      },
    });
  }

  async updateSessionStatus(
    id: string,
    status: SessionStatus,
    containerId?: string
  ): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        status,
        ...(containerId && { containerId }),
        lastActivityAt: new Date(),
      },
    });
  }

  async updateLastActivity(id: string): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { lastActivityAt: new Date() },
    });
  }

  async expireSession(id: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.EXPIRED,
        lastActivityAt: new Date(),
      },
    });
  }

  async stopSession(id: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.STOPPED,
        lastActivityAt: new Date(),
      },
    });
  }

  async failSession(id: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.FAILED,
        lastActivityAt: new Date(),
      },
    });
  }
}

export const sessionRepository = new SessionRepository();
