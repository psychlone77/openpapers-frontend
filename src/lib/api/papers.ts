import { API_BASE_URL } from "./config";
import type { Paper, HealthResponse, ErrorModel } from "../types/api";

export class ApiError extends Error {
  public status: number;
  public errorModel?: ErrorModel;

  constructor(message: string, status: number, errorModel?: ErrorModel) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorModel = errorModel;
  }
}

/**
 * Fetch health status of backend API
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const url = `${API_BASE_URL}/health`;
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiError(`Health check failed with status: ${res.status}`, res.status);
  }

  return (await res.json()) as HealthResponse;
}

/**
 * Fetch exam paper by UUID identifier from /api/v1/papers/{id}
 * Supports optional language filter query param (en, si, ta)
 */
export async function fetchPaperById(
  id: string,
  lang?: string,
  options?: RequestInit
): Promise<Paper> {
  const query = lang ? `?lang=${encodeURIComponent(lang)}` : "";
  const url = `${API_BASE_URL}/api/v1/papers/${encodeURIComponent(id)}${query}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
    // Revalidate after 60s or dynamic based on caller
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    let errorModel: ErrorModel | undefined;
    try {
      errorModel = (await res.json()) as ErrorModel;
    } catch {
      // Non-JSON error payload
    }

    const message =
      errorModel?.detail || errorModel?.title || `Failed to fetch paper: HTTP ${res.status}`;
    throw new ApiError(message, res.status, errorModel);
  }

  return (await res.json()) as Paper;
}
