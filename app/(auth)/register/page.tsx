"use client";

/**
 * ClimaSync.AI — Register Page
 *
 * NGO registration form with OTP verification flow.
 * Step 1: Collect org_name, email, password → POST /auth/register
 * Step 2: Redirect to /verify for OTP entry
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";
import { SocialLoginButton } from "@/app/_components/auth/SocialLoginButton";
import { AuthDivider } from "@/app/_components/auth/AuthDivider";
import { PasswordStrengthIndicator } from "@/app/_components/auth/PasswordStrengthIndicator";
import { SOCIAL_PROVIDERS, VALIDATION } from "@/app/_lib/auth/authConstants";
import type { SocialProvider } from "@/app/_lib/auth/authTypes";

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Sync context error
  useEffect(() => {
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    if (!orgName.trim()) {
      setFormError("Please enter your organization name");
      return false;
    }
    if (orgName.trim().length > VALIDATION.ORG_NAME_MAX_LENGTH) {
      setFormError(`Organization name must not exceed ${VALIDATION.ORG_NAME_MAX_LENGTH} characters`);
      return false;
    }
    if (!email.trim()) {
      setFormError("Please enter your email address");
      return false;
    }
    if (!VALIDATION.EMAIL_PATTERN.test(email)) {
      setFormError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setFormError("Please enter a password");
      return false;
    }
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setFormError(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
      return false;
    }
    if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
      setFormError(`Password must not exceed ${VALIDATION.PASSWORD_MAX_LENGTH} characters`);
      return false;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }
    if (!acceptTerms) {
      setFormError("Please accept the Terms of Service and Privacy Policy");
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
      const response = await register({
        org_name: orgName.trim(),
        email: email.trim(),
        password,
      });

      // Registration successful — redirect to OTP verification
      // Pass email and org_name as search params for the verify page
      const params = new URLSearchParams({
        email: response.email,
        org: orgName.trim(),
      });
      router.push(`/verify?${params.toString()}`);
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    setFormError(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} signup coming soon! Please use email registration for now.`
    );
    setTimeout(() => setFormError(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Create Account</h2>
        <p className="text-slate-400">
          Register your NGO to join the disaster response network
        </p>
      </div>

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

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization Name */}
        <div className="space-y-2">
          <label htmlFor="reg-org" className="text-sm font-medium text-slate-300">
            Organization Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="reg-org"
              type="text"
              value={orgName}
              onChange={(e) => { setOrgName(e.target.value); setFormError(null); }}
              placeholder="e.g. Pakistan Relief Foundation"
              autoComplete="organization"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="reg-email" className="text-sm font-medium text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
              placeholder="admin@your-ngo.org"
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="reg-password" className="text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
              placeholder="Create a strong password"
              autoComplete="new-password"
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
          <PasswordStrengthIndicator password={password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="reg-confirm" className="text-sm font-medium text-slate-300">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="reg-confirm"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFormError(null); }}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/[0.07] transition-all duration-200 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Match indicator */}
          {confirmPassword && (
            <div className="flex items-center gap-2">
              {password === confirmPassword ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-red-400">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start gap-3 pt-1">
          <button
            type="button"
            onClick={() => setAcceptTerms(!acceptTerms)}
            className={`mt-0.5 w-4.5 h-4.5 rounded border transition-all duration-200 flex items-center justify-center shrink-0 ${
              acceptTerms
                ? "bg-cyan-500 border-cyan-500"
                : "bg-white/5 border-white/20 hover:border-white/40"
            }`}
            aria-label="Accept terms"
          >
            {acceptTerms && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className="text-xs text-slate-400 leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
              Privacy Policy
            </Link>
          </span>
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Social Login Divider */}
      <AuthDivider text="or sign up with" />

      {/* Social Signup Buttons */}
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

      {/* Login Link */}
      <div className="text-center pt-1">
        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
