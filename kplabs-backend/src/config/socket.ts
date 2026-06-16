// ===========================================
// Socket.IO Server Configuration (Phase 7)
// ===========================================

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { logger } from './logger';
import { socketAuthMiddleware, AuthenticatedSocket } from '../socket/socketAuth';
import { setupTerminalHandlers } from '../socket/terminal.socket';

const socketLogger = logger.child({ service: 'socket.io' });

let io: Server;

export const initializeSocketIO = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'development' 
        ? ['http://localhost:3000', 'http://localhost:5173'] 
        : false,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  });

  // Apply authentication middleware to all socket connections
  io.use(socketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    socketLogger.info(
      { socketId: socket.id, userId: socket.user?.userId }, 
      'Client connected to Socket.IO'
    );

    socket.on('disconnect', (reason) => {
      socketLogger.info(
        { socketId: socket.id, userId: socket.user?.userId, reason }, 
        'Client disconnected'
      );
    });
  });

  // Setup terminal handlers
  setupTerminalHandlers(io);

  socketLogger.info('Socket.IO server initialized with authentication and terminal support');
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initializeSocketIO first.');
  }
  return io;
};

export default { initializeSocketIO, getIO };
