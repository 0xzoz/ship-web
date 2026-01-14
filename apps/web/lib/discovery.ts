import { apiFetch } from "./api-client";

export type DiscoveryMessage = {
  id: string;
  projectId: string;
  phase: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export async function fetchDiscoveryMessages(projectId: string) {
  const data = await apiFetch<{ messages: DiscoveryMessage[] }>(
    `/api/discovery/${projectId}/messages`
  );
  return data.messages;
}

export async function completeDiscovery(projectId: string) {
  const data = await apiFetch<{ success: boolean }>(
    `/api/discovery/${projectId}/complete`,
    { method: "POST" }
  );
  return data.success;
}
