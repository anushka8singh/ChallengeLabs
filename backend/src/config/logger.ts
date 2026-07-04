// ===========================================
// Centralized Logging Configuration
// Using Pino for high-performance structured logging
// ===========================================

import pino from 'pino';
import { env } from './env';

const isDevelopment = env.NODE_ENV === 'development';

export const logger = pino({
  level: env.LOG_LEVEL,
  
  // Pretty printing only in development
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  // Production settings
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Create child loggers for different modules (recommended pattern)
export const createLogger = (module: string) => logger.child({ module });
