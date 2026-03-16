import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/response";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    sendError(res, "VALIDATION_ERROR", message, 400);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      sendError(res, "NOT_FOUND", "Record not found", 404);
      return;
    }
    if (err.code === "P2002") {
      sendError(res, "CONFLICT", "A record with this value already exists", 409);
      return;
    }
    if (err.code === "P2003") {
      sendError(res, "BAD_REQUEST", "Invalid reference (foreign key constraint)", 400);
      return;
    }
  }

  console.error(err);
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error" : (err as Error).message;
  sendError(res, "INTERNAL_ERROR", message, 500);
}
