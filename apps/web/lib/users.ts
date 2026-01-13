import type {
  ChangePasswordInput,
  UpdateUserInput,
} from "@ship/shared";
import { apiFetch } from "./api-client";
import type { AuthUser } from "./auth";

export async function fetchUserProfile() {
  const data = await apiFetch<{ user: AuthUser }>("/api/users/me");
  return data.user;
}

export async function updateUserProfile(input: UpdateUserInput) {
  const data = await apiFetch<{ user: AuthUser }>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function changePassword(input: ChangePasswordInput) {
  await apiFetch<{ success: true }>("/api/users/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteAccount() {
  await apiFetch<{ success: true }>("/api/users/me", {
    method: "DELETE",
  });
}
