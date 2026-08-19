"use client";

/**
 * ClimaSync.AI — Protected Route Guard
 *
 * Wraps protected layouts to enforce authentication.
 * Redirects unauthenticated users to /login?redirect=<current_path>.
 * Optionally enforces role-based access.
 */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "./useAuth";
import { AUTH_ROUTES } from "./authConstants";
import type { UserRole } from "./authTypes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required roles for access. If empty/undefined, any authenticated user can access. */
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const redirectParam = encodeURIComponent(pathname);
      router.replace(`${AUTH_ROUTES.LOGIN}?redirect=${redirectParam}`);
      return;
    }

    // Role-based access check
    if (requiredRoles && requiredRoles.length > 0 && user) {
      if (!requiredRoles.includes(user.role)) {
        if (user.role === "admin" || user.role === "super_admin") {
          router.replace("/admin");
        } else {
          router.replace(AUTH_ROUTES.DASHBOARD);
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router, pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 text-cyan-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Verifying access...</p>
            <p className="text-slate-400 text-sm mt-1">Please wait</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Not authenticated — show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Role check failed — show nothing while redirecting
  if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
