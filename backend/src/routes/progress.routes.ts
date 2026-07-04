// ===========================================
// Progress Routes
// Current user progress endpoint (Phase 6)
// ===========================================

import { Router } from 'express';
import { progressController } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get(
  '/current',
  progressController.getCurrentProgress
);
router.get(
  '/completed',
  progressController.getCompletedChallenges
);

export default router;
