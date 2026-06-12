// ===========================================
// Prisma ORM Client Configuration
// Singleton pattern to avoid multiple instances
// ===========================================

import { Prisma, PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prismaClientOptions = {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
} satisfies Prisma.PrismaClientOptions;

type PrismaClientWithEvents = PrismaClient<
  Prisma.PrismaClientOptions,
  'query' | 'error' | 'info' | 'warn'
>;

declare global {
  // Allow global `prisma` variable in development to prevent
  // exhausting database connections during hot reloads
  var prisma: PrismaClientWithEvents | undefined;
}

const prismaClientSingleton = (): PrismaClientWithEvents => {
  return new PrismaClient(prismaClientOptions) as PrismaClientWithEvents;
};

// Use global instance in development, new instance in production
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Log database queries in development (optional but helpful)
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Prisma Query');
  });
}

export default prisma;
