// UserService.ts
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../constants/prisma';
import {ApiError} from "./ApiError"


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRY: string;
      REFRESH_TOKEN_SECRET: string;
      REFRESH_TOKEN_EXPIRY: string;
    }
  }
}

export class UserService {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  generateAccessToken(): string {
    return jwt.sign(
      {
        id: this.user.id,
        email: this.user.email,
        name: this.user.name,
       
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  }

  generateRefreshToken(): string {
    return jwt.sign(
      {
        id: this.user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  }

  async saveRefreshToken(refreshToken:string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: this.user.id },
        data: { 
          refreshToken
        },
      });
    } catch (error) {
      throw new ApiError(500, 'Error saving refresh token');
    }
  }

  static async findUserById(userId: string): Promise<UserService | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return new UserService(user);
  }
}
