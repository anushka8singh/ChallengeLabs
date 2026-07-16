import { Role } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";
import { userRepository } from "../repositories/user.repository";

export class UserService {

  async getAllUsers(adminRole: string) {
    if (adminRole !== "ADMIN") {
      throw new AppError(
        "Only admins can view users",
        403
      );
    }

    return userRepository.findAll();
  }

  async updatePremiumAccess(
    adminRole: string,
    userId: string,
    hasPremiumAccess: boolean
  ) {
    if (adminRole !== "ADMIN") {
      throw new AppError(
        "Only admins can update users",
        403
      );
    }

    const user =
      await userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    return userRepository.updatePremiumAccess(
      userId,
      hasPremiumAccess
    );
  }

  async updateRole(
    adminRole: string,
    userId: string,
    role: Role
  ) {
    if (adminRole !== "ADMIN") {
      throw new AppError(
        "Only admins can update users",
        403
      );
    }

    const user =
      await userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    return userRepository.updateRole(
      userId,
      role
    );
  }
}

export const userService =
  new UserService();