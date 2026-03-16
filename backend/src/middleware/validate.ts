import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidateSource = "body" | "query" | "params" | "headers";

export function validate(schema: ZodSchema, source: ValidateSource = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const value = req[source];
    const result = schema.safeParse(value);
    if (result.success) {
      (req as Request & { [k: string]: unknown })[source] = result.data;
      next();
      return;
    }
    next(result.error);
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return validate(schema, "body");
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return validate(schema, "query");
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return validate(schema, "params");
}
