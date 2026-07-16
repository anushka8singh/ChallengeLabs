import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse";
import { userService } from "../services/user.service";

export class UserController {

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users =
        await userService.getAllUsers(
          req.user!.role
        );

      successResponse(
        res,
        users,
        "Users retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async updatePremiumAccess(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { hasPremiumAccess } = req.body;

      const user =
        await userService.updatePremiumAccess(
          req.user!.role,
          id,
          hasPremiumAccess
        );

      successResponse(
        res,
        user,
        "Premium access updated"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user =
        await userService.updateRole(
          req.user!.role,
          id,
          role
        );

      successResponse(
        res,
        user,
        "Role updated"
      );
    } catch (error) {
      next(error);
    }
  }
}

export const userController =
  new UserController();