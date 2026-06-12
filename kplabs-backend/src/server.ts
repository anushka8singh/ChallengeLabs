// ===========================================
// KPLabs Backend Server Entry Point
// Phase 1: Foundation
// ===========================================

import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';
import { redis, closeRedis } from './config/redis';
import { initializeSocketIO } from './config/socket';
import { dockerService } from './services/docker.service';

const serverLogger = logger.child({ service: 'server' });

const startServer = async () => {
  try {
    // ===========================================
    // 1. Verify Database Connection
    // ===========================================
    await prisma.$connect();
    serverLogger.info('✅ Connected to PostgreSQL database');

    // ===========================================
    // 2. Verify Redis Connection
    // ===========================================
    await redis.ping();
    serverLogger.info('✅ Connected to Redis');

    // ===========================================
    // 3. Verify Docker Connection
    // ===========================================
    const dockerAvailable = await dockerService.startupHealthCheck();
    if (!dockerAvailable) {
      serverLogger.warn(
        dockerService.getConnectionInfo(),
        'Docker is unavailable at startup; session container creation will fail until Docker is reachable'
      );
    }

    // ===========================================
    // 4. Create HTTP Server
    // ===========================================
    const httpServer = http.createServer(app);

    // ===========================================
    // 5. Initialize Socket.IO
    // ===========================================
    initializeSocketIO(httpServer);
    serverLogger.info('✅ Socket.IO initialized');

    // ===========================================
    // 6. Start HTTP Server
    // ===========================================
    const PORT = env.PORT;
    
    httpServer.listen(PORT, () => {
      serverLogger.info(
        `🚀 KPLabs Backend (Phase 1) running on port ${PORT}`
      );
      serverLogger.info(`   Environment: ${env.NODE_ENV}`);
      serverLogger.info(`   Health check: http://localhost:${PORT}/health`);
      serverLogger.info(`   API Health:   http://localhost:${PORT}/api/health`);
    });

    // ===========================================
    // Graceful Shutdown Handling
    // ===========================================
    const gracefulShutdown = async (signal: string) => {
      serverLogger.warn(`Received ${signal}. Starting graceful shutdown...`);

      httpServer.close(async () => {
        serverLogger.info('HTTP server closed');

        try {
          await prisma.$disconnect();
          serverLogger.info('Prisma disconnected');

          await closeRedis();
          serverLogger.info('Redis disconnected');

          process.exit(0);
        } catch (err) {
          serverLogger.error({ err }, 'Error during shutdown');
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    serverLogger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Start the application
startServer();
