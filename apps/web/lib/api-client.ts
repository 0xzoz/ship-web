export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    let message = "Request failed";
    if (typeof data === "object" && data && "error" in data) {
      const errorValue = (data as { error?: string | { message?: string } }).error;
      if (typeof errorValue === "string") {
        message = errorValue;
      } else if (errorValue && typeof errorValue === "object" && "message" in errorValue) {
        message = String(errorValue.message ?? message);
      }
    }
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
