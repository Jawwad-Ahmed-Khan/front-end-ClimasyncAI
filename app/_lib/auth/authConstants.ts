/**
 * ClimaSync.AI — Authentication Constants
 *
 * Central configuration for auth system. All magic strings,
 * storage keys, validation rules, and provider configs live here.
 */

import type { SocialProviderConfig } from "./authTypes";

// ---------------------------------------------------------------------------
// API Configuration
// ---------------------------------------------------------------------------

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  // Future endpoints (placeholders)
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  SOCIAL_LOGIN: (provider: string) => `/auth/social/${provider}`,
  SOCIAL_CALLBACK: (provider: string) => `/auth/social/${provider}/callback`,
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "climasync_access_token",
  REFRESH_TOKEN: "climasync_refresh_token",
  USER: "climasync_user",
} as const;

// ---------------------------------------------------------------------------
// Validation Rules
// ---------------------------------------------------------------------------

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 72,
  ORG_NAME_MIN_LENGTH: 1,
  ORG_NAME_MAX_LENGTH: 255,
  OTP_LENGTH: 6,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OTP_PATTERN: /^\d{6}$/,
} as const;

// ---------------------------------------------------------------------------
// Password Strength Rules
// ---------------------------------------------------------------------------

export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p: string) => /\d/.test(p) },
  { id: "special", label: "One special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
] as const;

// ---------------------------------------------------------------------------
// Social Login Providers (UI Placeholders — Future OAuth Integration)
// ---------------------------------------------------------------------------
// TODO: When backend implements OAuth, update these with actual client IDs
// and redirect URIs. The OAuth flow will be:
// 1. Frontend redirects to: GET /api/v1/auth/social/{provider}
// 2. Backend redirects to provider's OAuth consent screen
// 3. Provider redirects back to: GET /api/v1/auth/social/{provider}/callback
// 4. Backend processes tokens, creates/finds user, returns JWT
// 5. Frontend receives JWT via redirect query params or post-message

export const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    id: "google",
    label: "Google",
    icon: "google",
    color: "bg-white/5 border-white/10",
    hoverColor: "hover:bg-red-500/10 hover:border-red-500/30",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "facebook",
    color: "bg-white/5 border-white/10",
    hoverColor: "hover:bg-blue-600/10 hover:border-blue-600/30",
  },
  {
    id: "x",
    label: "X",
    icon: "x",
    color: "bg-white/5 border-white/10",
    hoverColor: "hover:bg-white/10 hover:border-white/30",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "github",
    color: "bg-white/5 border-white/10",
    hoverColor: "hover:bg-purple-500/10 hover:border-purple-500/30",
  },
  {
    id: "yahoo",
    label: "Yahoo",
    icon: "yahoo",
    color: "bg-white/5 border-white/10",
    hoverColor: "hover:bg-violet-500/10 hover:border-violet-500/30",
  },
];

// ---------------------------------------------------------------------------
// Error Messages (User-Facing)
// ---------------------------------------------------------------------------

export const AUTH_ERRORS: Record<string, string> = {
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  ACCOUNT_DISABLED: "Your account has been disabled. Please contact support.",
  EMAIL_NOT_VERIFIED: "Please verify your email address first. Check your inbox for the OTP.",
  EMAIL_ALREADY_REGISTERED: "An account with this email already exists.",
  OTP_EXPIRED: "Your OTP has expired. Please request a new one.",
  OTP_INVALID: "Invalid OTP code. Please check and try again.",
  OTP_MAX_ATTEMPTS: "Too many failed attempts. Please request a new OTP.",
  OTP_RATE_LIMIT: "Too many OTP requests. Please wait and try again later.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  NETWORK_ERROR: "Unable to connect to the server. Please check your connection.",
  UNKNOWN_ERROR: "Something went wrong. Please try again later.",
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  HOME: "/",
} as const;

// ---------------------------------------------------------------------------
// Protected Route Configuration
// ---------------------------------------------------------------------------

export const PROTECTED_ROUTES = [
  { path: "/dashboard", requiredRoles: ["ngo_user", "admin", "super_admin"] },
  { path: "/admin", requiredRoles: ["admin", "super_admin"] },
] as const;
