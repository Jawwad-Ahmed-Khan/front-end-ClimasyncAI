/**
 * ClimaSync.AI — Authentication API Service Layer
 *
 * All backend communication for authentication flows.
 * This is the ONLY file that makes HTTP calls for auth.
 * Components never call APIs directly — they go through AuthContext.
 */

import { AxiosError } from "axios";
import { apiClient } from "../apiClient";
import {
  AUTH_ENDPOINTS,
  AUTH_ERRORS,
  STORAGE_KEYS,
} from "./authConstants";
import type {
  AuthError,
  AuthTokens,
  LoginCredentials,
  LoginResponse,
  MessageResponse,
  RegisterData,
  RegisterResponse,
  ResendOtpData,
  User,
  VerifyOtpData,
  VerifyOtpResponse,
  ForgotPasswordData,
  ResetPasswordData,
} from "./authTypes";

// ---------------------------------------------------------------------------
// Error Parser
// ---------------------------------------------------------------------------

function parseApiError(error: unknown): AuthError {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail || "";

    // Map specific backend error messages to user-friendly messages
    const errorMap: Record<string, string> = {
      "Invalid email or password": AUTH_ERRORS.INVALID_CREDENTIALS,
      "Account is disabled. Please contact support.": AUTH_ERRORS.ACCOUNT_DISABLED,
      "Email address is not verified": AUTH_ERRORS.EMAIL_NOT_VERIFIED,
      "already registered": AUTH_ERRORS.EMAIL_ALREADY_REGISTERED,
      "OTP has expired": AUTH_ERRORS.OTP_EXPIRED,
      "Invalid OTP code": AUTH_ERRORS.OTP_INVALID,
      "Too many failed attempts": AUTH_ERRORS.OTP_MAX_ATTEMPTS,
      "OTP rate limit exceeded": AUTH_ERRORS.OTP_RATE_LIMIT,
    };

    // Find matching error message
    for (const [key, message] of Object.entries(errorMap)) {
      if (detail.includes(key)) {
        return { status, detail: message };
      }
    }

    // Rate limit
    if (status === 429) {
      return { status, detail: AUTH_ERRORS.RATE_LIMIT };
    }

    return { status, detail: detail || AUTH_ERRORS.UNKNOWN_ERROR };
  }

  if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
    return { status: 0, detail: AUTH_ERRORS.NETWORK_ERROR };
  }

  return { status: 500, detail: AUTH_ERRORS.UNKNOWN_ERROR };
}

// ---------------------------------------------------------------------------
// Token Storage Helpers
// ---------------------------------------------------------------------------

export function storeTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
}

export function storeUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const access = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!access || !refresh) return null;
  return { access_token: access, refresh_token: refresh, token_type: "bearer" };
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * POST /auth/login
 * Authenticates a verified user and returns JWT tokens + user profile.
 */
export async function loginAPI(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * POST /auth/register
 * Initiates NGO registration and triggers OTP email.
 * Returns confirmation message — user must then verify OTP.
 */
export async function registerAPI(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await apiClient.post<RegisterResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * POST /auth/verify-otp
 * Verifies the 6-digit OTP and completes registration.
 * Returns JWT tokens + user profile on success.
 */
export async function verifyOtpAPI(data: VerifyOtpData): Promise<VerifyOtpResponse> {
  try {
    const response = await apiClient.post<VerifyOtpResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      data
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * POST /auth/resend-otp
 * Resends OTP to unverified user's email. Rate limited.
 */
export async function resendOtpAPI(email: string): Promise<MessageResponse> {
  try {
    const payload: ResendOtpData = { email };
    const response = await apiClient.post<MessageResponse>(
      AUTH_ENDPOINTS.RESEND_OTP,
      payload
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * POST /auth/forgot-password
 * Requests a password reset OTP to email.
 */
export async function forgotPasswordAPI(email: string): Promise<MessageResponse> {
  try {
    const payload: ForgotPasswordData = { email };
    const response = await apiClient.post<MessageResponse>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * POST /auth/reset-password
 * Resets the password using OTP and new password.
 */
export async function resetPasswordAPI(data: ResetPasswordData): Promise<MessageResponse> {
  try {
    const response = await apiClient.post<MessageResponse>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      data
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Protected API Functions
// ---------------------------------------------------------------------------

export async function logoutAPI(): Promise<MessageResponse> {
  try {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null;
    const response = await apiClient.post<MessageResponse>(
      AUTH_ENDPOINTS.LOGOUT,
      { refresh_token: refreshToken }
    );
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function logoutAllAPI(): Promise<MessageResponse> {
  try {
    const response = await apiClient.post<MessageResponse>("/auth/logout-all");
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function getMeAPI(): Promise<User> {
  try {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.ME);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

// TODO: Implement when backend adds OAuth endpoints
// export async function socialLoginRedirectAPI(provider: SocialProvider): Promise<string> { ... }
