"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { registerUser, loginUser, refreshAuthToken, verifyAuthToken } from "@/lib/api/auth";
import type { RegisterRequest, LoginRequest, UserResponse } from "@/lib/types/api";

interface AuthContextValue {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isModeratorOrAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<UserResponse>;
  register: (payload: RegisterRequest) => Promise<UserResponse>;
  logout: () => void;
  updateUserState: (updated: Partial<UserResponse>) => void;
  refreshSession: () => Promise<string | null>;
}

const ACCESS_TOKEN_KEY = "op_access_token";
const REFRESH_TOKEN_KEY = "op_refresh_token";
const USER_STORAGE_KEY = "op_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback(
    (nextAccess: string, nextRefresh: string, nextUser: UserResponse) => {
      setAccessToken(nextAccess);
      setRefreshToken(nextRefresh);
      setUser(nextUser);
      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, nextAccess);
        localStorage.setItem(REFRESH_TOKEN_KEY, nextRefresh);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      } catch {
        // Ignore storage errors in private mode
      }
    },
    []
  );

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<string | null> => {
    let storedRefresh = refreshToken;
    if (!storedRefresh && typeof window !== "undefined") {
      storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    if (!storedRefresh) {
      clearSession();
      return null;
    }

    try {
      const refreshed = await refreshAuthToken(storedRefresh);
      persistSession(refreshed.access_token, refreshed.refresh_token, refreshed.user);
      return refreshed.access_token;
    } catch {
      clearSession();
      return null;
    }
  }, [refreshToken, persistSession, clearSession]);

  // Hydrate and verify session on mount
  useEffect(() => {
    let isMounted = true;

    async function hydrateAuth() {
      try {
        const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);

        if (!storedAccess && !storedRefresh) {
          if (isMounted) setIsLoading(false);
          return;
        }

        if (storedUserJson) {
          try {
            const parsedUser = JSON.parse(storedUserJson) as UserResponse;
            if (isMounted) {
              setUser(parsedUser);
              setAccessToken(storedAccess);
              setRefreshToken(storedRefresh);
            }
          } catch {
            // Invalid stored JSON
          }
        }

        if (storedAccess) {
          try {
            const verified = await verifyAuthToken(storedAccess);
            if (verified.valid && isMounted) {
              setAccessToken(storedAccess);
              setRefreshToken(storedRefresh);
              setUser(verified.user);
              localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verified.user));
              setIsLoading(false);
              return;
            }
          } catch {
            // Access token expired or invalid; fall through to refresh token
          }
        }

        if (storedRefresh) {
          try {
            const refreshed = await refreshAuthToken(storedRefresh);
            if (isMounted) {
              persistSession(refreshed.access_token, refreshed.refresh_token, refreshed.user);
            }
          } catch {
            if (isMounted) clearSession();
          }
        } else if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, [persistSession, clearSession]);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<UserResponse> => {
      const res = await loginUser(credentials);
      persistSession(res.access_token, res.refresh_token, res.user);
      return res.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload: RegisterRequest): Promise<UserResponse> => {
      const res = await registerUser(payload);
      persistSession(res.access_token, res.refresh_token, res.user);
      return res.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const updateUserState = useCallback((updated: Partial<UserResponse>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updated };
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore storage error
      }
      return merged;
    });
  }, []);

  const roleUpper = user?.role?.toUpperCase() || "";
  const isModeratorOrAdmin = roleUpper === "MODERATOR" || roleUpper === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated: Boolean(user && accessToken),
        isModeratorOrAdmin,
        login,
        register,
        logout,
        updateUserState,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
