"use client";

/**
 * ClimaSync.AI — OTP Verification Page
 *
 * Step 2 of registration flow: user enters the 6-digit OTP
 * sent to their email after POST /auth/register.
 * On success, JWT tokens are stored and user is redirected to dashboard.
 */

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 animate-pulse text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto" />
        <div className="h-8 w-56 bg-white/5 rounded-lg mx-auto" />
        <div className="flex justify-center gap-3">
          {Array(6).fill(0).map((_, i) => <div key={i} className="w-12 h-14 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}

function VerifyOtpContent() {
  const { verifyOtp, resendOtp, isAuthenticated, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const orgName = searchParams.get("org") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Redirect if no email param
  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  // Sync context error
  useEffect(() => {
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [error, clearError]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last char
    setOtp(newOtp);
    setFormError(null);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === OTP_LENGTH - 1) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === OTP_LENGTH) {
        handleSubmit(fullOtp);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus last filled input or the next empty one
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if full OTP pasted
    if (pasted.length === OTP_LENGTH) {
      handleSubmit(pasted);
    }
  };

  // Submit OTP
  const handleSubmit = useCallback(
    async (otpString?: string) => {
      const code = otpString || otp.join("");
      if (code.length !== OTP_LENGTH) {
        setFormError("Please enter the complete 6-digit code");
        return;
      }

      setIsSubmitting(true);
      setFormError(null);
      try {
        await verifyOtp({
          email,
          otp: code,
          org_name: orgName,
        });
        // Redirect happens via useEffect
      } catch {
        // Reset OTP inputs on failure
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setIsSubmitting(false);
      }
    },
    [otp, email, orgName, verifyOtp]
  );

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setFormError(null);
    setResendMessage(null);
    try {
      const response = await resendOtp(email);
      setResendMessage(response.message || "New OTP sent to your email");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendMessage(null), 5000);
    } catch {
      // Error handled by context
    } finally {
      setIsResending(false);
    }
  };

  // Mask email for display
  const maskedEmail = email
    ? email.replace(/^(.)(.*)(@.+)$/, (_, first, middle, domain) =>
        first + middle.replace(/./g, "•") + domain
      )
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20 mx-auto"
        >
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white">Verify Your Email</h2>
        <p className="text-slate-400 text-sm">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-cyan-400 font-medium text-sm">{maskedEmail}</p>
      </div>

      {/* Success Message */}
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
          className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{formError}</p>
        </motion.div>
      )}

      {/* OTP Input Grid */}
      <div className="flex items-center justify-center gap-3">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isSubmitting}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border bg-white/5 text-white outline-none transition-all duration-200 ${
              digit
                ? "border-cyan-500/50 bg-cyan-500/5"
                : "border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            } disabled:opacity-50`}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Verify Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => handleSubmit()}
        disabled={isSubmitting || otp.join("").length !== OTP_LENGTH}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Verify & Continue</span>
          </>
        )}
      </motion.button>

      {/* Resend OTP */}
      <div className="text-center space-y-3">
        <p className="text-sm text-slate-400">
          Didn&apos;t receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
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

      {/* Back to Register */}
      <div className="text-center pt-2">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registration</span>
        </Link>
      </div>
    </div>
  );
}
