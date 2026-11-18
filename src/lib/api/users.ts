import {
  fetchMyProfileServerAction,
  updateMyProfileServerAction,
  fetchPublicUserProfileServerAction,
  fetchMyExplanationsServerAction,
} from "../actions/userActions";
import type {
  UserProfileResponse,
  PublicUserProfileResponse,
  UpdateProfileRequest,
  ExplanationResponse,
} from "../types/api";

/**
 * Retrieve authenticated user's profile with reputation and contribution statistics
 * GET /api/v1/users/me
 */
export async function fetchMyProfile(accessToken: string): Promise<UserProfileResponse> {
  return await fetchMyProfileServerAction(accessToken);
}

/**
 * Update authenticated user's username or password
 * PATCH /api/v1/users/me
 */
export async function updateMyProfile(
  accessToken: string,
  payload: UpdateProfileRequest
): Promise<UserProfileResponse> {
  return await updateMyProfileServerAction(accessToken, payload);
}

/**
 * Retrieve public user profile (email omitted)
 * GET /api/v1/users/{id}
 */
export async function fetchPublicUserProfile(userId: string): Promise<PublicUserProfileResponse> {
  return await fetchPublicUserProfileServerAction(userId);
}

/**
 * Retrieve explanations submitted by the authenticated user with optional status filter
 * GET /api/v1/users/me/explanations
 */
export async function fetchMyExplanations(
  accessToken: string,
  status?: string
): Promise<ExplanationResponse[]> {
  return await fetchMyExplanationsServerAction(accessToken, status);
}
