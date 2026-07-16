import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorize.middleware";
import { userController } from "../controllers/user.controller";

const router = Router();

router.use(authenticate);
router.use(authorizeRole(["ADMIN"]));

router.get(
  "/",
  userController.getAllUsers
);

router.patch(
  "/:id/premium",
  userController.updatePremiumAccess
);

router.patch(
  "/:id/role",
  userController.updateRole
);

export default router;