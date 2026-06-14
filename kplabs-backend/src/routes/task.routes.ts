// ===========================================
// Task Routes
// Task validation endpoint (Phase 6)
// ===========================================

import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import { validateTaskSchema } from '../validators/task.validator';

const router = Router();

router.use(authenticate);

router.post(
  '/:taskId/validate',
  validateRequest(validateTaskSchema),
  taskController.validateTask
);

export default router;
