import { API_BASE_URL } from "./config";
import { ApiError } from "./papers";
import type { LoginRequest, LoginResponse, ErrorModel } from "../types/api";

/**
 * Authenticate user with username or email and password
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const url = `${API_BASE_URL}/api/v1/auth/login`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    let errorModel: ErrorModel | undefined;
    try {
      errorModel = (await res.json()) as ErrorModel;
    } catch {
      // Non-JSON error payload
    }

    const message =
      errorModel?.detail || errorModel?.title || `Login failed with status: ${res.status}`;
    throw new ApiError(message, res.status, errorModel);
  }

  return (await res.json()) as LoginResponse;
}
