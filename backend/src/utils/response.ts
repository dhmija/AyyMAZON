import { Response } from "express";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page?: number; limit?: number; total?: number };
};

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendSuccessWithMeta<T>(
  res: Response,
  data: T,
  meta: ApiResponse["meta"],
  status = 200
): void {
  const body: ApiResponse<T> = { success: true, data, meta };
  res.status(status).json(body);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  status = 400
): void {
  const body: ApiResponse = {
    success: false,
    error: { code, message },
  };
  res.status(status).json(body);
}
