import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === "production";

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  logger.error({ err }, "Unhandled error");

  return res.status(500).json({
    error: {
      message: isProduction ? "Unexpected error" : err.message,
      code: "internal_error",
    },
  });
}
