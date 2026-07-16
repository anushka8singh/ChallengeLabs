// ===========================================
// User Repository
// Data access layer for User model
// ===========================================

import { prisma } from '../config/prisma';
import { User } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}


async updatePremiumAccess(
  userId: string,
  hasPremiumAccess: boolean
): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hasPremiumAccess,
    },
  });
}

async updateRole(
  userId: string,
  role: 'USER' | 'ADMIN'
): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
}



  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
