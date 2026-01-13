import { Router } from "express";
import { createProjectSchema } from "@ship/shared";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { projectService } from "../services/project.service";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const projects = await projectService.list(req.auth.userId);
  return res.json({ projects });
});

router.post("/", requireAuth, validate(createProjectSchema), async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, description } = req.body;
  const project = await projectService.create(req.auth.userId, name, description);
  return res.status(201).json({ project });
});

router.delete("/:id", requireAuth, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const projectId = req.params.id;
  if (!projectId) {
    return res.status(400).json({ error: "Project id is required" });
  }

  const result = await projectService.remove(req.auth.userId, projectId);
  if (result.count === 0) {
    return res.status(404).json({ error: "Project not found" });
  }

  return res.status(204).send();
});

export default router;
