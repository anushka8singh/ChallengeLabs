// ===========================================
// Terminal Socket Handlers (Phase 7)
// ===========================================

import { Server } from 'socket.io';
import { AuthenticatedSocket } from './socketAuth';
import { terminalService } from '../services/terminal.service';
import { logger } from '../config/logger';

const terminalSocketLogger = logger.child({ service: 'terminal.socket' });

export const setupTerminalHandlers = (io: Server) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.user) {
      socket.disconnect(true);
      return;
    }

    const userId = socket.user.userId;

    socket.on('terminal:connect', async (payload: { sessionId: string }) => {
      try {
        if (!payload?.sessionId) {
          socket.emit('terminal:error', { message: 'sessionId is required' });
          return;
        }

        await terminalService.connectTerminal(socket, payload.sessionId, userId);
      } catch (error: any) {
        terminalSocketLogger.error({ userId, error: error.message }, 'terminal:connect failed');
        socket.emit('terminal:error', { message: error.message || 'Failed to connect terminal' });
      }
    });

    socket.on('terminal:input', async (data: string) => {
      try {
        const sessionId = (socket as any).currentSessionId;
        if (!sessionId) {
          socket.emit('terminal:error', { message: 'No active terminal session' });
          return;
        }
        await terminalService.handleInput(sessionId, data);
      } catch (error: any) {
        socket.emit('terminal:error', { message: error.message || 'Failed to process input' });
      }
    });

    socket.on('terminal:resize', async (payload: { cols: number; rows: number }) => {
      try {
        const sessionId = (socket as any).currentSessionId;
        if (!sessionId) {
          socket.emit('terminal:error', { message: 'No active terminal session' });
          return;
        }
        if (typeof payload.cols !== 'number' || typeof payload.rows !== 'number') {
          socket.emit('terminal:error', { message: 'Invalid resize dimensions' });
          return;
        }
        await terminalService.handleResize(sessionId, payload.cols, payload.rows);
      } catch (error: any) {
        socket.emit('terminal:error', { message: error.message || 'Resize failed' });
      }
    });

    socket.on('terminal:disconnect', async () => {
      try {
        const sessionId = (socket as any).currentSessionId;
        if (sessionId) {
          await terminalService.disconnectTerminal(sessionId);
          delete (socket as any).currentSessionId;
        }
      } catch (error: any) {
        terminalSocketLogger.warn({ error: error.message }, 'Error on explicit terminal disconnect');
      }
    });

    socket.on('disconnect', async (reason) => {
      try {
        const sessionId = (socket as any).currentSessionId;
        if (sessionId) {
          await terminalService.disconnectTerminal(sessionId);
          delete (socket as any).currentSessionId;
        }
        terminalSocketLogger.info({ socketId: socket.id, userId, reason }, 'Socket disconnected');
      } catch (error: any) {
        terminalSocketLogger.warn({ error: error.message }, 'Error during disconnect cleanup');
      }
    });
  });
};