// ===========================================
// Progress Routes
// Current user progress endpoint (Phase 6)
// ===========================================

import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/current', taskController.getCurrentProgress);

export default router;
