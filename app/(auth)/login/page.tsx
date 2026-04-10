"use client";

/**
 * ClimaSync.AI — Login Page
 *
 * Full-featured login with email/password, social logins (placeholder),
 * and navigation to register/forgot password.
 */

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";
import { SocialLoginButton } from "@/app/_components/auth/SocialLoginButton";
import { AuthDivider } from "@/app/_components/auth/AuthDivider";
import { SOCIAL_PROVIDERS, VALIDATION } from "@/app/_lib/auth/authConstants";
import type { SocialProvider } from "@/app/_lib/auth/authTypes";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-white/5 rounded-lg" />
        <div className="h-5 w-72 bg-white/5 rounded-lg" />
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

function LoginContent() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath || "/dashboard");
    }
  }, [isAuthenticated, router, redirectPath]);

  // Sync context error to local form error
  useEffect(() => {
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setFormError("Please enter your email address");
      return false;
    }
    if (!VALIDATION.EMAIL_PATTERN.test(email)) {
      setFormError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setFormError("Please enter your password");
      return false;
    }
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setFormError(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      // Redirect happens via useEffect above
    } catch {
      // Error already handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    // TODO: Implement when backend OAuth is ready
    // For now, show placeholder feedback
    setFormError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon! Please use email/password for now.`);
    setTimeout(() => setFormError(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="text-slate-400">
          Sign in to access your disaster response dashboard
        </p>
      </div>

      {/* Error Display */}
      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{formError}</p>
        </motion.div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
              placeholder="you@organization.com"
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4.5 h-4.5 rounded border transition-all duration-200 flex items-center justify-center ${
              rememberMe
                ? "bg-cyan-500 border-cyan-500"
                : "bg-white/5 border-white/20 hover:border-white/40"
            }`}
            aria-label="Remember me"
          >
            {rememberMe && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className="text-sm text-slate-400">Remember me</span>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Social Login Divider */}
      <AuthDivider />

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {SOCIAL_PROVIDERS.map((provider) => (
          <SocialLoginButton
            key={provider.id}
            provider={provider.id}
            label={provider.label}
            onClick={handleSocialLogin}
          />
        ))}
      </div>

      {/* Register Link */}
      <div className="text-center pt-2">
        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
