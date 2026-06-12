// ===========================================
// Express Application Configuration
// Phase 1 Foundation - Clean & Modular Setup
// ===========================================

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import challengeRoutes, { adminChallengeRoutes } from './routes/challenge.routes';
import sessionRoutes from './routes/session.routes';

const app: Application = express();

// ===========================================
// Security Middleware
// ===========================================
app.use(helmet());

// ===========================================
// CORS Configuration
// ===========================================
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'] 
    : false, // Configure properly in production
  credentials: true,
}));

// ===========================================
// Body Parsing
// ===========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// HTTP Request Logging (Pino)
// ===========================================
app.use(pinoHttp({ 
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url === '/api/health',
  }
}));

// ===========================================
// Health Check Route (Critical for monitoring)
// ===========================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'kplabs-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    phase: '1 - Foundation',
    message: 'Backend foundation is running successfully',
  });
});
// ===========================================
// Mount API Routes
// ===========================================
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/admin/challenges', adminChallengeRoutes);
app.use('/api/sessions', sessionRoutes);

// ===========================================
// API Routes Placeholder

// Routes will be mounted here in later phases
// Example: app.use('/api/v1/challenges', challengeRoutes);
// ===========================================

// ===========================================
// 404 Handler (must come after routes)
// ===========================================
app.use(notFoundHandler);

// ===========================================
// Global Error Handler (must be last)
// ===========================================
app.use(errorHandler);

export default app;
