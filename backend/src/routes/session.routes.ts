// ===========================================
// Session Routes
// Lab session management endpoints (Phase 5)
// All routes require authentication
// ===========================================

import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import { startSessionSchema } from '../validators/session.validator';

const router = Router();

// All session routes require authentication
router.use(authenticate);

// Start new lab session
router.post(
  '/start',
  validateRequest(startSessionSchema),
  sessionController.startSession
);

// Get current active session for user
router.get('/current', sessionController.getCurrentSession);

// Stop current session
router.post('/stop', sessionController.stopSession);

// Reset current session (fresh container)
router.post('/reset', sessionController.resetSession);

// Get session details by ID
router.get('/:id', sessionController.getSessionById);

export default router;
