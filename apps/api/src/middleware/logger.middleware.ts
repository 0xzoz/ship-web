import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
    });
  });

  next();
}
