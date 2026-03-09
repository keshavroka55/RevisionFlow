import { api } from "./api";
import type { RegisterPayload, LoginPayload, AuthResponse } from "../types/auth.types";

const BASE = "/api/auth";

// Register
export const registerAPI = async (payload: RegisterPayload): Promise<AuthResponse> => {
  return api(`${BASE}/register`, {
    method: "POST",
    body: payload,
  });
};

// Login
export const loginAPI = async (payload: LoginPayload): Promise<AuthResponse> => {
  return api(`${BASE}/login`, {
    method: "POST",
    body: payload,
  });
};

// Refresh token
export const refreshTokenAPI = async (refreshToken: string) => {
  return api(`${BASE}/refresh`, {
    method: "POST",
    body: { refreshToken },
  });
};

// Logout
export const logoutAPI = async (token: string) => {
  return api(`${BASE}/logout`, {
    method: "POST",
    token,
  });
};

// Forgot password
export const forgotPasswordAPI = async (email: string) => {
  return api(`${BASE}/forgot-password`, {
    method: "POST",
    body: { email },
  });
};

// Reset password
export const resetPasswordAPI = async (token: string, password: string) => {
  return api(`${BASE}/reset-password`, {
    method: "POST",
    body: { token, password },
  });
};