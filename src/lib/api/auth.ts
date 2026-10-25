import {
  loginUserServerAction,
  refreshAuthTokenServerAction,
  verifyAuthTokenServerAction,
} from "../actions/userActions";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  VerifyTokenResponse,
} from "../types/api";

/**
 * Authenticate user with username or email and password
 * POST /api/v1/auth/login
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  return await loginUserServerAction(credentials);
}

/**
 * Refresh JWT access and refresh token pair
 * POST /api/v1/auth/refresh
 */
export async function refreshAuthToken(refreshToken: string): Promise<RefreshResponse> {
  return await refreshAuthTokenServerAction(refreshToken);
}

/**
 * Verify JWT access token and return claims + user profile
 * GET /api/v1/auth/verify
 */
export async function verifyAuthToken(accessToken: string): Promise<VerifyTokenResponse> {
  return await verifyAuthTokenServerAction(accessToken);
}
