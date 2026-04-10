"use client";

/**
 * ClimaSync.AI — Social Login Button (Placeholder)
 *
 * Reusable glass-style button for social login providers.
 * Currently shows a "Coming Soon" tooltip on hover.
 *
 * TODO: When backend OAuth is implemented:
 * 1. Remove the tooltip/placeholder behaviour
 * 2. Wire onClick to redirect to: GET /api/v1/auth/social/{provider}
 * 3. Handle callback at: /auth/social/{provider}/callback
 */

import { motion } from "framer-motion";
import { Github, Chrome, Facebook, Twitter } from "lucide-react";
import type { SocialProvider } from "@/app/_lib/auth/authTypes";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  label: string;
  /** Called when user clicks social button. Currently shows placeholder toast. */
  onClick?: (provider: SocialProvider) => void;
}

const PROVIDER_ICONS: Record<SocialProvider, React.ReactNode> = {
  google: <Chrome className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  x: <Twitter className="w-5 h-5" />,
  github: <Github className="w-5 h-5" />,
  yahoo: (
    <span className="text-base font-bold leading-none" style={{ fontFamily: "serif" }}>
      Y!
    </span>
  ),
};

const PROVIDER_HOVER_COLORS: Record<SocialProvider, string> = {
  google: "hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400",
  facebook: "hover:bg-blue-600/10 hover:border-blue-500/30 hover:text-blue-400",
  x: "hover:bg-white/10 hover:border-white/30 hover:text-white",
  github: "hover:bg-purple-500/10 hover:border-purple-400/30 hover:text-purple-400",
  yahoo: "hover:bg-violet-500/10 hover:border-violet-400/30 hover:text-violet-400",
};

export function SocialLoginButton({ provider, label, onClick }: SocialLoginButtonProps) {
  const handleClick = () => {
    // TODO: Replace with actual OAuth redirect when backend supports it
    // window.location.href = `${API_BASE_URL}/auth/social/${provider}`;
    if (onClick) {
      onClick(provider);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        relative flex items-center justify-center gap-2.5 
        w-full px-4 py-3 rounded-xl 
        bg-white/5 border border-white/10 
        text-slate-300 text-sm font-medium
        transition-all duration-300
        ${PROVIDER_HOVER_COLORS[provider]}
        group cursor-pointer
      `}
      title={`Sign in with ${label} — Coming Soon`}
    >
      <span className="transition-colors duration-300">
        {PROVIDER_ICONS[provider]}
      </span>
      <span>{label}</span>

      {/* Coming Soon Badge */}
      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Soon
      </span>
    </motion.button>
  );
}
