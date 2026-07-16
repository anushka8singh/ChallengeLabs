// ===========================================
// Challenge Routes
// Defines all challenge-related endpoints (Phase 4)
// Student routes: Public for viewing
// Admin routes: Protected with authenticate + authorizeRole
// ===========================================

import { Router } from 'express';
import { challengeController } from '../controllers/challenge.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/authorize.middleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  createChallengeSchema,
  updateChallengeSchema,
  createTaskSchema,
  updateTaskSchema,
} from '../validators/challenge.validator';

const router = Router();

// ===========================================
// STUDENT ROUTES (Public - No authentication required)
// ===========================================
router.use(authenticate);
// GET all published challenges
router.get('/', challengeController.getAllChallenges);

// GET single challenge by slug (with tasks)
router.get('/:slug', challengeController.getChallengeBySlug);

// GET tasks for a challenge by ID
router.get('/id/:id/tasks', challengeController.getTasksForChallenge);

// ===========================================
// ADMIN ROUTES (Protected - Require ADMIN role)
// ===========================================

// All admin routes require authentication and ADMIN role
const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(authorizeRole(['ADMIN']));

// GET all challenges (admin view - includes unpublished)
adminRouter.get('/', challengeController.getAllChallengesForAdmin);

adminRouter.get(
  '/:id',
  challengeController.getChallengeByIdForAdmin
);

// Create challenge
adminRouter.post(
  '/',
  validateRequest(createChallengeSchema),
  challengeController.createChallenge
);

// Update challenge
adminRouter.put(
  '/:id',
  validateRequest(updateChallengeSchema),
  challengeController.updateChallenge
);

// Soft delete challenge
adminRouter.delete('/:id', challengeController.deleteChallenge);

// Create task for challenge
adminRouter.post(
  '/:id/tasks',
  validateRequest(createTaskSchema),
  challengeController.createTask
);
adminRouter.get(
  '/tasks/:id',
  challengeController.getTaskById
);
// Update task
adminRouter.put(
  '/tasks/:id',
  validateRequest(updateTaskSchema),
  challengeController.updateTask
);

// Delete task
adminRouter.delete('/tasks/:id', challengeController.deleteTask);

// Mount admin routes under /admin prefix in app.ts
export { adminRouter as adminChallengeRoutes };
export default router;
