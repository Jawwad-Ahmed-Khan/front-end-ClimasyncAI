"use client";

/**
 * ClimaSync.AI — Password Strength Indicator
 *
 * Real-time visual feedback on password strength.
 * Shows a colour-coded bar and individual rule check marks.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "@/app/_lib/auth/authConstants";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const passedCount = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const total = PASSWORD_RULES.length;
  const percentage = (passedCount / total) * 100;

  const strengthLabel =
    passedCount <= 1
      ? "Weak"
      : passedCount <= 2
        ? "Fair"
        : passedCount <= 3
          ? "Good"
          : passedCount <= 4
            ? "Strong"
            : "Excellent";

  const strengthColor =
    passedCount <= 1
      ? "bg-red-500"
      : passedCount <= 2
        ? "bg-orange-500"
        : passedCount <= 3
          ? "bg-yellow-500"
          : passedCount <= 4
            ? "bg-emerald-500"
            : "bg-cyan-400";

  const labelColor =
    passedCount <= 1
      ? "text-red-400"
      : passedCount <= 2
        ? "text-orange-400"
        : passedCount <= 3
          ? "text-yellow-400"
          : passedCount <= 4
            ? "text-emerald-400"
            : "text-cyan-400";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-3 pt-1"
      >
        {/* Strength Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Password strength</span>
            <span className={`text-xs font-medium ${labelColor}`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full ${strengthColor}`}
            />
          </div>
        </div>

        {/* Individual Rules */}
        <div className="grid grid-cols-1 gap-1.5">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(password);
            return (
              <div key={rule.id} className="flex items-center gap-2">
                {passed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span
                  className={`text-xs ${passed ? "text-slate-300" : "text-slate-600"}`}
                >
                  {rule.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
