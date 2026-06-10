// ===========================================
// Authentication Service
// Contains core business logic for auth operations
// ===========================================

import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt.utils';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  async register(name: string, email: string, password: string) {
    // Check if email already exists
    const emailExists = await userRepository.existsByEmail(email);
    if (emailExists) {
      throw new AppError('Email is already registered', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      name,
      email,
      passwordHash,
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return token and user info (without password)
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
