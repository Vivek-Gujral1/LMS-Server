import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import prisma from "../constants/prisma";

interface loggedInUser {
  avatar: string | null;
  createdAt: Date;
  email: string;
  id: string;
  isVerified: Boolean;
  name: string;
}

declare module "express" {
  interface Request {
    user?: loggedInUser; // Define user property with User type from Prisma
  }
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res
          .json(new ApiResponse(false, "unauthorized request"))
          .status(401);
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as { id: string };

      const user = await prisma.user.findFirst({
        where: {
          id: decodedToken.id,
        },
        select: {
          avatar: true,
          createdAt: true,
          email: true,
          id: true,
          isVerified: true,
          name: true,
        },
      });
      if (!user) {
        return res.json(new ApiResponse(false, "User not found")).status(500);
      }
      req.user = user;
      next();
    } catch (error) {
      return res.json(new ApiResponse(false, "error while varifying token"));
    }
  }
);
