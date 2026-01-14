import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "../config/database";
import { connectionService } from "../services/connection.service";
import { decryptSecret } from "../services/credential-vault.service";
import { createClaudeClient, defaultClaudeModel } from "../services/claude.service";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";

const router = Router();

router.get("/:projectId/messages", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }
    const projectId = req.params.projectId;
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.auth.userId },
    });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const messages = await prisma.chatMessage.findMany({
      where: { projectId, phase: "discovery" },
      orderBy: { createdAt: "asc" },
    });
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});

router.post("/:projectId/complete", requireAuth, async (req, res, next) => {
  try {
    if (!req.auth) {
      throw new UnauthorizedError();
    }
    const projectId = req.params.projectId;
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.auth.userId },
    });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const connection = await connectionService.get(req.auth.userId, "claude");
    if (!connection) {
      throw new BadRequestError("Claude connection required");
    }
    const apiKey = decryptSecret(connection.encryptedApiKey);
    const client = createClaudeClient(apiKey);

    const messages = await prisma.chatMessage.findMany({
      where: { projectId, phase: "discovery" },
      orderBy: { createdAt: "asc" },
    });

    const transcript = messages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n");

    const summary = await client.messages.create({
      model: defaultClaudeModel,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: `Summarize this discovery transcript into a DISCOVERY.md with sections: Overview, Goals, Users, Core Features, Open Questions.\n\nTranscript:\n${transcript}`,
        },
      ],
    });

    const discoveryContent =
      summary.content[0]?.type === "text" ? summary.content[0].text : "";

    const existing = await prisma.projectFile.findFirst({
      where: { projectId, filePath: "DISCOVERY.md" },
    });

    const file = existing
      ? await prisma.projectFile.update({
          where: { id: existing.id },
          data: { content: discoveryContent },
        })
      : await prisma.projectFile.create({
          data: {
            projectId,
            filePath: "DISCOVERY.md",
            fileType: "document",
            content: discoveryContent,
          },
        });

    return res.json({ success: true, file });
  } catch (error) {
    return next(error);
  }
});

export default router;
