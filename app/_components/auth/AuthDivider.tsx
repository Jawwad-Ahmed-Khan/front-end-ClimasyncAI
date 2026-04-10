"use client";

/**
 * ClimaSync.AI — Auth Divider
 *
 * Styled "or continue with" separator used between
 * the main login/register form and social login buttons.
 */

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or continue with" }: AuthDividerProps) {
  return (
    <div className="relative flex items-center py-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="px-4 text-xs text-slate-500 uppercase tracking-wider font-medium">
        {text}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
