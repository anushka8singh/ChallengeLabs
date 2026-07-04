// ===========================================
// Socket.IO Authentication Middleware (Phase 7)
// Reusable JWT authentication for Socket.IO
// ===========================================

import { Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt.utils';
import { logger } from '../config/logger';
import { prisma } from '../config/prisma';

const socketAuthLogger = logger.child({ service: 'socket.auth' });

export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket, 
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token || typeof token !== 'string') {
      socketAuthLogger.warn({ socketId: socket.id }, 'Socket rejected: No authentication token');
      return next(new Error('Authentication token is required'));
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      socketAuthLogger.warn({ socketId: socket.id }, 'Socket rejected: User not found');
      return next(new Error('User not found'));
    }

    socket.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    socketAuthLogger.info({ socketId: socket.id, userId: user.id }, 'Socket authenticated');
    next();
  } catch (error: any) {
    socketAuthLogger.warn({ socketId: socket.id, error: error.message }, 'Socket authentication failed');
    next(new Error('Invalid or expired authentication token'));
  }
};