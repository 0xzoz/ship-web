import type { CreateProjectInput } from "@ship/shared";
import { apiFetch } from "./api-client";

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  currentPhase: string;
  status: string;
  deployUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
};

export async function fetchProjects() {
  const data = await apiFetch<{ projects: Project[] }>("/api/projects");
  return data.projects;
}

export async function createProject(input: CreateProjectInput) {
  const data = await apiFetch<{ project: Project }>("/api/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.project;
}

export async function deleteProject(projectId: string) {
  await apiFetch<void>(`/api/projects/${projectId}`, {
    method: "DELETE",
  });
}
