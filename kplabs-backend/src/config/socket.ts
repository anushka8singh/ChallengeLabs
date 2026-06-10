// ===========================================
// Socket.IO Server Configuration
// Phase 1: Basic initialization only
// Handlers and authentication will be added in later phases
// ===========================================

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './logger';

const socketLogger = logger.child({ service: 'socket.io' });

let io: Server;

export const initializeSocketIO = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'development' 
        ? ['http://localhost:3000', 'http://localhost:5173'] 
        : false, // Will be configured properly in production
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Connection settings
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
  });

  // Basic connection logging (will be expanded later)
  io.on('connection', (socket: Socket) => {
    socketLogger.info({ socketId: socket.id }, 'Client connected to Socket.IO');

    socket.on('disconnect', (reason) => {
      socketLogger.info({ socketId: socket.id, reason }, 'Client disconnected');
    });

    // Placeholder for future authentication middleware
    // socket.use(async (packet, next) => { ... });
  });

  socketLogger.info('Socket.IO server initialized successfully');
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initializeSocketIO first.');
  }
  return io;
};

export default { initializeSocketIO, getIO };
