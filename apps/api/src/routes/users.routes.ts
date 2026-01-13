import { Router } from "express";
import {
  changePasswordSchema,
  updateUserSchema,
} from "@ship/shared";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { prisma } from "../config/database";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { hashPassword, verifyPassword } from "../utils/crypto";

const router = Router();
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return next(error);
  }
});

router.patch("/me", requireAuth, validate(updateUserSchema), async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    const { email, name } = req.body;

    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== req.auth.userId) {
        throw new BadRequestError("Email already in use");
      }
    }

    const user = await prisma.user.update({
      where: { id: req.auth.userId },
      data: {
        email: email ?? undefined,
        name: name ?? undefined,
      },
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new UnauthorizedError();
      }

      const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });
      if (!user || !user.passwordHash) {
        throw new UnauthorizedError("Invalid credentials");
      }

      const { currentPassword, newPassword } = req.body;
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) {
        throw new UnauthorizedError("Invalid credentials");
      }

      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      return res.json({ success: true });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    await prisma.user.delete({ where: { id: req.auth.userId } });
    res.clearCookie("ship_session", cookieOptions);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
