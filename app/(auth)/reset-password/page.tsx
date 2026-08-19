"use client";

/**
 * ClimaSync.AI — Reset Password Page
 */

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CheckSquare, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";
import { PasswordStrengthIndicator } from "@/app/_components/auth/PasswordStrengthIndicator";
import { VALIDATION } from "@/app/_lib/auth/authConstants";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-white/5 rounded-lg" />
        <div className="h-5 w-72 bg-white/5 rounded-lg" />
      </div>
      <div className="space-y-4 pt-4">
        <div className="flex gap-2 justify-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-14 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-12 bg-white/5 rounded-xl pt-4" />
        <div className="h-12 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

function ResetPasswordContent() {
  const { resetPassword, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Try to grab email from URL
  const urlEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(urlEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Sync context error to local form error
  useEffect(() => {
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [error, clearError]);

  // OTP Input Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    setFormError(null);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    
    if (!/^\d+$/.test(pastedData.join(""))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    setFormError(null);

    // Focus last filled input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const validateForm = (): boolean => {
    if (!email.trim() || !VALIDATION.EMAIL_PATTERN.test(email)) {
      setFormError("Valid email is required. Please go back and request a new OTP if needed.");
      return false;
    }
    const otpValue = otp.join("");
    if (otpValue.length !== 6 || !VALIDATION.OTP_PATTERN.test(otpValue)) {
      setFormError("Please enter the 6-digit OTP");
      return false;
    }
    if (!newPassword) {
      setFormError("Please enter a new password");
      return false;
    }
    if (newPassword.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setFormError(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
      return false;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Provide generic error if missing email instead of validation blocking immediately
    if (!email) {
      setFormError("Email is required. Please restart the password reset process.");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.join(""),
        new_password: newPassword,
      });
      // Success
      setSuccess(true);
    } catch {
      // Error already handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const { forgotPassword } = useAuth();
  const handleResend = async () => {
    if (!email || resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setFormError(null);
    setResendMessage(null);
    try {
      const response = await forgotPassword(email.trim());
      setResendMessage(response.message || "New OTP sent to your email");
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendMessage(null), 5000);
    } catch {
      // Error handled by context
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white">Password Reset!</h2>
        <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">
          Your password has been successfully updated. You can now use your new password to sign in.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Set New Password</h2>
        <p className="text-slate-400 leading-relaxed">
          Enter the 6-digit OTP sent to <span className="text-cyan-400">{email || "your email"}</span> and choose a new password.
        </p>
      </div>

      {/* Success Message for Resend */}
      {resendMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-300">{resendMessage}</p>
        </motion.div>
      )}

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
        {/* Email Field (auto-filled, read-only if present in URL, otherwise editable) */}
        {!urlEmail && (
          <div className="space-y-2">
            <label htmlFor="reset-email" className="text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.com"
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200 text-sm outline-none"
            />
          </div>
        )}

        {/* OTP Input */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium text-slate-300 text-center block">
            Reset OTP Code
          </label>
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                // @ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-white/5 border border-white/10 text-center text-2xl font-bold text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/50 transition-all outline-none"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2 pt-4">
          <label htmlFor="reg-password" className="text-sm font-medium text-slate-300">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setFormError(null); }}
              placeholder="Create a strong password"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthIndicator password={newPassword} />
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <label htmlFor="reg-confirm" className="text-sm font-medium text-slate-300">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="reg-confirm"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFormError(null); }}
              placeholder="Confirm your new password"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
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
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4" />
              <span>Set New Password</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Resend OTP Section */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-sm text-slate-400">
          Didn&apos;t receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending || !email}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isResending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend Code"}
        </button>
      </div>
    </div>
  );
}
