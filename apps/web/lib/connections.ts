import type {
  ConnectionService,
  ConnectKeyInput,
} from "@ship/shared";
import { apiFetch } from "./api-client";

export type ConnectionStatus = {
  id: string;
  service: ConnectionService;
  status: string;
  lastTestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchConnections() {
  const data = await apiFetch<{ connections: ConnectionStatus[] }>(
    "/api/connections"
  );
  return data.connections;
}

export async function connectService(
  service: ConnectionService,
  input: ConnectKeyInput
) {
  const data = await apiFetch<{ connection: ConnectionStatus }>(
    `/api/connections/${service}`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return data.connection;
}

export async function disconnectService(service: ConnectionService) {
  await apiFetch<{ success: true }>(`/api/connections/${service}`, {
    method: "DELETE",
  });
}

export async function testService(service: ConnectionService) {
  const data = await apiFetch<{ success: boolean }>(
    `/api/connections/${service}/test`,
    {
      method: "POST",
    }
  );
  return data.success;
}
