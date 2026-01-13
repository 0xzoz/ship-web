import { Router } from "express";
import {
  connectKeySchema,
  connectionServiceSchema,
} from "@ship/shared";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { connectionService } from "../services/connection.service";
import { decryptSecret, encryptSecret } from "../services/credential-vault.service";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    const connections = await connectionService.list(req.auth.userId);
    return res.json({
      connections: connections.map(({ encryptedApiKey, ...rest }) => rest),
    });
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/:service",
  requireAuth,
  validate(connectKeySchema),
  async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new UnauthorizedError();
      }

      const parse = connectionServiceSchema.safeParse(req.params.service);
      if (!parse.success) {
        throw new BadRequestError("Unsupported service");
      }

      const encrypted = encryptSecret(req.body.apiKey);
      const connection = await connectionService.upsert(
        req.auth.userId,
        parse.data,
        encrypted
      );

      const { encryptedApiKey: _secret, ...safe } = connection;
      return res.status(201).json({ connection: safe });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete("/:service", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    const parse = connectionServiceSchema.safeParse(req.params.service);
    if (!parse.success) {
      throw new BadRequestError("Unsupported service");
    }

    await connectionService.remove(req.auth.userId, parse.data);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

router.post("/:service/test", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    const parse = connectionServiceSchema.safeParse(req.params.service);
    if (!parse.success) {
      throw new BadRequestError("Unsupported service");
    }

    const record = await connectionService.get(req.auth.userId, parse.data);
    if (!record) {
      throw new NotFoundError("Connection not found");
    }

    const apiKey = decryptSecret(record.encryptedApiKey);
    const success = await testConnection(parse.data, apiKey);
    await connectionService.updateStatus(
      req.auth.userId,
      parse.data,
      success ? "connected" : "error"
    );

    return res.json({ success });
  } catch (error) {
    return next(error);
  }
});

async function testConnection(service: "claude" | "codex", apiKey: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    if (service === "claude") {
      const response = await fetch("https://api.anthropic.com/v1/models", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
      });
      return response.ok;
    }

    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
    });
    return response.ok;
  } finally {
    clearTimeout(timeout);
  }
}

export default router;
