/**
 * ClimaSync.AI — Authentication Type Definitions
 *
 * Central type definitions for the entire auth system.
 * All auth components, services, and contexts import from here.
 */

// ---------------------------------------------------------------------------
// User & Profile
// ---------------------------------------------------------------------------

export type UserRole = "ngo_user" | "admin" | "super_admin";

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";

export interface User {
  user_id: string;
  email: string;
  role: UserRole;
  org_name: string;
  is_active: boolean;
  email_verified: boolean;
  verification_status: VerificationStatus;
}

// ---------------------------------------------------------------------------
// Auth Tokens
// ---------------------------------------------------------------------------

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ---------------------------------------------------------------------------
// Request Payloads
// ---------------------------------------------------------------------------

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  org_name: string;
  email: string;
  password: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
  org_name: string;
}

export interface ResendOtpData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  new_password: string;
}

// ---------------------------------------------------------------------------
// API Response Shapes
// ---------------------------------------------------------------------------

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface VerifyOtpResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface MessageResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Auth State (Context)
// ---------------------------------------------------------------------------

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Auth Error
// ---------------------------------------------------------------------------

export interface AuthError {
  status: number;
  detail: string;
}

// ---------------------------------------------------------------------------
// Social Login
// ---------------------------------------------------------------------------

export type SocialProvider = "google" | "facebook" | "x" | "github" | "yahoo";

export interface SocialProviderConfig {
  id: SocialProvider;
  label: string;
  icon: string;
  color: string;
  hoverColor: string;
}

// ---------------------------------------------------------------------------
// Auth Context Actions
// ---------------------------------------------------------------------------

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<RegisterResponse>;
  verifyOtp: (data: VerifyOtpData) => Promise<void>;
  resendOtp: (email: string) => Promise<MessageResponse>;
  forgotPassword: (email: string) => Promise<MessageResponse>;
  resetPassword: (data: ResetPasswordData) => Promise<MessageResponse>;
  logout: () => void;
  clearError: () => void;
}
