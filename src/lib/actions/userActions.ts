"use server";

import { API_BASE_URL } from "@/lib/api/config";
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  VerifyTokenResponse,
  UserProfileResponse,
  PublicUserProfileResponse,
  UpdateProfileRequest,
  ExplanationResponse,
  CreateExplanationRequest,
  GetPendingExplanationsOutputBody,
  ReviewExplanationRequest,
  ErrorModel,
} from "@/lib/types/api";

async function extractErrorMessage(res: Response, fallbackMessage: string): Promise<string> {
  try {
    const errorModel = (await res.json()) as ErrorModel;
    const fieldError = errorModel?.errors?.[0]?.message;
    return (
      fieldError || errorModel?.detail || errorModel?.title || `${fallbackMessage} (${res.status})`
    );
  } catch {
    return `${fallbackMessage} (${res.status})`;
  }
}

export async function registerUserServerAction(payload: RegisterRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Registration failed"));
  }

  return (await res.json()) as LoginResponse;
}

export async function loginUserServerAction(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Login failed"));
  }

  return (await res.json()) as LoginResponse;
}

export async function refreshAuthTokenServerAction(refreshToken: string): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Token refresh failed"));
  }

  return (await res.json()) as RefreshResponse;
}

export async function verifyAuthTokenServerAction(
  accessToken: string
): Promise<VerifyTokenResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Token verification failed"));
  }

  return (await res.json()) as VerifyTokenResponse;
}

export async function fetchMyProfileServerAction(
  accessToken: string
): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to load user profile"));
  }

  return (await res.json()) as UserProfileResponse;
}

export async function updateMyProfileServerAction(
  accessToken: string,
  payload: UpdateProfileRequest
): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to update user profile"));
  }

  return (await res.json()) as UserProfileResponse;
}

export async function fetchPublicUserProfileServerAction(
  userId: string
): Promise<PublicUserProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/users/${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to load public user profile"));
  }

  return (await res.json()) as PublicUserProfileResponse;
}

export async function fetchMyExplanationsServerAction(
  accessToken: string,
  status?: string
): Promise<ExplanationResponse[]> {
  const query = status && status !== "ALL" ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${API_BASE_URL}/api/v1/users/me/explanations${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to load submitted explanations"));
  }

  const data = (await res.json()) as ExplanationResponse[] | null;
  return data || [];
}

export async function fetchQuestionExplanationsServerAction(
  questionId: string,
  accessToken?: string | null
): Promise<ExplanationResponse[]> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(
    `${API_BASE_URL}/api/v1/questions/${encodeURIComponent(questionId)}/explanations`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to load question explanations"));
  }

  const data = (await res.json()) as ExplanationResponse[] | null;
  return data || [];
}

export async function submitQuestionExplanationServerAction(
  questionId: string,
  payload: CreateExplanationRequest,
  accessToken: string
): Promise<ExplanationResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/questions/${encodeURIComponent(questionId)}/explanations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to submit explanation"));
  }

  return (await res.json()) as ExplanationResponse;
}

export async function fetchPendingExplanationsServerAction(
  accessToken: string,
  page = 1,
  limit = 20
): Promise<GetPendingExplanationsOutputBody> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(
    `${API_BASE_URL}/api/v1/admin/explanations/pending?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to fetch pending explanations"));
  }

  return (await res.json()) as GetPendingExplanationsOutputBody;
}

export async function reviewExplanationServerAction(
  explanationId: string,
  payload: ReviewExplanationRequest,
  accessToken: string
): Promise<ExplanationResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/admin/explanations/${encodeURIComponent(explanationId)}/review`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Failed to submit explanation review"));
  }

  return (await res.json()) as ExplanationResponse;
}
