import { prisma } from "../config/database";
import { env } from "../config/env";
import { hashPassword, hashToken, signToken, verifyPassword } from "../utils/crypto";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const authService = {
  async getUser(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  },
  async signup(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email already in use" } as const;
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    const token = signToken({ sub: user.id, email: user.email }, env.JWT_SECRET);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return { user, token, expiresAt } as const;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return { error: "Invalid email or password" } as const;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { error: "Invalid email or password" } as const;
    }

    const token = signToken({ sub: user.id, email: user.email }, env.JWT_SECRET);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return { user: updatedUser, token, expiresAt } as const;
  },

  async logout(tokenHash: string) {
    await prisma.session.deleteMany({ where: { tokenHash } });
  },
};
