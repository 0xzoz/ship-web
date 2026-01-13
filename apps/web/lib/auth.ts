import type { LoginInput, SignupInput } from "@ship/shared";
import { apiFetch } from "./api-client";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
  lastLoginAt?: string | null;
};

export async function signup(input: SignupInput) {
  const data = await apiFetch<{ user: AuthUser }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function login(input: LoginInput) {
  const data = await apiFetch<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function logout() {
  await apiFetch<void>("/api/auth/logout", { method: "POST" });
}

export async function getMe() {
  const data = await apiFetch<{ user: AuthUser }>("/api/auth/me");
  return data.user;
}
