import { Router } from "express";
import { loginSchema, signupSchema } from "@ship/shared";
import { authService } from "../services/auth.service";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

router.post("/signup", validate(signupSchema), async (req, res) => {
  const { email, password, name } = req.body;
  const result = await authService.signup(email, password, name);

  if ("error" in result) {
    return res.status(400).json({ error: result.error });
  }

  res.cookie("ship_session", result.token, {
    ...cookieOptions,
    expires: result.expiresAt,
  });

  const { passwordHash: _passwordHash, ...user } = result.user;
  return res.status(201).json({ user });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if ("error" in result) {
    return res.status(401).json({ error: result.error });
  }

  res.cookie("ship_session", result.token, {
    ...cookieOptions,
    expires: result.expiresAt,
  });

  const { passwordHash: _passwordHash, ...user } = result.user;
  return res.json({ user });
});

router.post("/logout", requireAuth, async (req, res) => {
  if (req.auth) {
    await authService.logout(req.auth.tokenHash);
  }
  res.clearCookie("ship_session", cookieOptions);
  return res.json({ success: true });
});

router.get("/me", requireAuth, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await authService.getUser(req.auth.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

export default router;
