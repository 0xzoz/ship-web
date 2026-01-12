import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { hashToken, verifyToken } from "../utils/crypto";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.ship_session;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token, env.JWT_SECRET) as { sub?: string };
    if (!payload?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.auth = {
      userId: payload.sub,
      token,
      tokenHash: hashToken(token),
    };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
