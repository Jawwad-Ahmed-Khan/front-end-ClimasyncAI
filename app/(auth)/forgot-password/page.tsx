"use client";

/**
 * ClimaSync.AI — Forgot Password Page
 */

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";
import { VALIDATION } from "@/app/_lib/auth/authConstants";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

function ForgotPasswordSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-white/5 rounded-lg" />
        <div className="h-5 w-72 bg-white/5 rounded-lg" />
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-white/5 rounded-xl" />
        <div className="h-12 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

function ForgotPasswordContent() {
  const { forgotPassword, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      // On success, redirect to reset-password page with email param
      const params = new URLSearchParams({ email: email.trim() });
      router.push(`/reset-password?${params.toString()}`);
    } catch {
      // Error already handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back to Login Link */}
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Reset Password</h2>
        <p className="text-slate-400 leading-relaxed">
          Enter your registered email address and we'll send you an OTP to reset your password.
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-sm font-medium text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
              placeholder="you@organization.com"
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
          </div>
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
              <span>Sending OTP...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Reset OTP</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
