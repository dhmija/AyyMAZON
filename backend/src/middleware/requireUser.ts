import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { BadRequestError } from "../utils/errors";
import { prisma } from "../lib/prisma";

const USER_ID_HEADER = "x-user-id";

export function getUserId(req: Request): string | undefined {
  const id = req.headers[USER_ID_HEADER];
  return typeof id === "string" && id.trim() ? id.trim() : undefined;
}

export async function requireUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = getUserId(req);
  if (!userId) {
    next(new BadRequestError(`Missing required header: ${USER_ID_HEADER}`));
    return;
  }

  try {
    // Lazily ensure the user exists in the DB so that foreign key constraints don't fail
    await prisma.user.upsert({
      where: { id: userId },
      create: { 
        id: userId, 
        email: `${userId}@guest.example.com`, 
        name: "Guest User" 
      },
      update: {},
    });
    
    (req as Request & { userId: string }).userId = userId;
    next();
  } catch (error) {
    next(error);
  }
}
