"use client";

/**
 * ClimaSync.AI — useAuth Hook
 *
 * Convenience hook for consuming the AuthContext.
 * Throws if used outside of AuthProvider (fail-fast).
 */

import { useContext } from "react";
import { AuthContext } from "./authContext";
import type { AuthContextValue } from "./authTypes";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
