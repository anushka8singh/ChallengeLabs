// ===========================================
// Redis Client Configuration
// Using ioredis for robust connection handling
// ===========================================

import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

const redisLogger = logger.child({ service: 'redis' });

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
  lazyConnect: false,
});

// Connection event handlers
redis.on('connect', () => {
  redisLogger.info('Redis connection established');
});

redis.on('ready', () => {
  redisLogger.info('Redis client ready to accept commands');
});

redis.on('error', (err) => {
  redisLogger.error({ err }, 'Redis connection error');
});

redis.on('close', () => {
  redisLogger.warn('Redis connection closed');
});

redis.on('reconnecting', (timeToReconnect: number) => {
  redisLogger.info({ timeToReconnect }, 'Reconnecting to Redis...');
});

// Graceful shutdown helper
export const closeRedis = async () => {
  await redis.quit();
  redisLogger.info('Redis connection closed gracefully');
};

export default redis;
