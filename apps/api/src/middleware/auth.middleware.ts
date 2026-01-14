import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";

const sessionCookieNames = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = sessionCookieNames
    .map((name) => req.cookies?.[name])
    .find(Boolean);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
  });

  if (!session || session.expires < new Date()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.auth = {
    userId: session.userId,
    sessionToken: token,
  };

  return next();
}
