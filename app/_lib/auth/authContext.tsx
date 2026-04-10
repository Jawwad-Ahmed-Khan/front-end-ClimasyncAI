"use client";

/**
 * ClimaSync.AI — Authentication Context Provider
 *
 * Global auth state management. Wraps the entire app in app/layout.tsx.
 * Provides: user, tokens, isAuthenticated, isLoading, error,
 *           login(), register(), verifyOtp(), resendOtp(), logout(), clearError()
 */

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type {
  AuthContextValue,
  AuthTokens,
  LoginCredentials,
  MessageResponse,
  RegisterData,
  RegisterResponse,
  User,
  VerifyOtpData,
  AuthError,
  ResetPasswordData,
} from "./authTypes";
import {
  clearStoredAuth,
  getStoredTokens,
  getStoredUser,
  loginAPI,
  registerAPI,
  storeTokens,
  storeUser,
  verifyOtpAPI,
  resendOtpAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
  getMeAPI,
  logoutAPI,
} from "./authService";
import { AUTH_ROUTES } from "./authConstants";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!tokens;

  // -----------------------------------------------------------------------
  // Hydrate auth state from localStorage on mount & listen to force logouts
  // -----------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    
    // Force logout triggered by apiClient if refresh token dies
    const handleGlobalLogout = () => {
      if (isMounted) {
        clearStoredAuth();
        setUser(null);
        setTokens(null);
        router.push(AUTH_ROUTES.LOGIN);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("climasync:auth_logout", handleGlobalLogout);
    }

    const hydrate = async () => {
      const storedTokens = getStoredTokens();
      if (storedTokens) {
        setTokens(storedTokens);
        try {
          // Always fetch freshest user data
          const freshUser = await getMeAPI();
          if (isMounted) {
            setUser(freshUser);
            storeUser(freshUser);
          }
        } catch {
          // Token might be fully invalid and failed to refresh
          if (isMounted) {
            clearStoredAuth();
            setTokens(null);
            setUser(null);
          }
        }
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };

    hydrate();

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("climasync:auth_logout", handleGlobalLogout);
      }
    };
  }, [router]);

  // -----------------------------------------------------------------------
  // Login
  // -----------------------------------------------------------------------
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await loginAPI(credentials);

        const authTokens: AuthTokens = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          token_type: response.token_type,
        };

        storeTokens(authTokens);
        storeUser(response.user);
        setTokens(authTokens);
        setUser(response.user);
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.detail);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // Register (Step 1 — triggers OTP email, does NOT log in)
  // -----------------------------------------------------------------------
  const register = useCallback(
    async (data: RegisterData): Promise<RegisterResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await registerAPI(data);
        return response;
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.detail);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // Verify OTP (Step 2 — completes registration & logs in)
  // -----------------------------------------------------------------------
  const verifyOtp = useCallback(
    async (data: VerifyOtpData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await verifyOtpAPI(data);

        const authTokens: AuthTokens = {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          token_type: response.token_type,
        };

        storeTokens(authTokens);
        storeUser(response.user);
        setTokens(authTokens);
        setUser(response.user);
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.detail);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // Resend OTP
  // -----------------------------------------------------------------------
  const resendOtp = useCallback(
    async (email: string): Promise<MessageResponse> => {
      setError(null);
      try {
        return await resendOtpAPI(email);
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.detail);
        throw err;
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // Forgot Password
  // -----------------------------------------------------------------------
  const forgotPassword = useCallback(
    async (email: string): Promise<MessageResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await forgotPasswordAPI(email);
        return response;
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.detail);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // Reset Password
  // -----------------------------------------------------------------------
  const resetPassword = useCallback(
    async (data: ResetPasswordData): Promise<MessageResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await resetPasswordAPI(data);
        return response;
      } catch (err) {
        const authError = err as AuthError;
        setError(authError.detail);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // Logout
  // -----------------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      // Only call via backend if we have tokens attempting validity
      if (getStoredTokens()) {
        await logoutAPI();
      }
    } catch {
      // Ignore API errors, force local logout regardless
    } finally {
      clearStoredAuth();
      setUser(null);
      setTokens(null);
      setError(null);
      router.push(AUTH_ROUTES.HOME);
    }
  }, [router]);

  // -----------------------------------------------------------------------
  // Clear Error
  // -----------------------------------------------------------------------
  const clearError = useCallback(() => setError(null), []);

  // -----------------------------------------------------------------------
  // Context Value (memoised to prevent unnecessary re-renders)
  // -----------------------------------------------------------------------
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      tokens,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
      logout,
      clearError,
    }),
    [user, tokens, isAuthenticated, isLoading, error, login, register, verifyOtp, resendOtp, forgotPassword, resetPassword, logout, clearError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
