"use client";

/**
 * ClimaSync.AI — Layout Shell
 *
 * Client component that conditionally renders the Navbar and Footer.
 * Auth pages (login, register, verify) render their own layout without
 * the global Navbar/Footer for a distraction-free experience.
 */

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/** Routes that should NOT show the global Navbar/Footer */
const AUTH_ROUTES = ["/login", "/register", "/verify", "/forgot-password", "/reset-password"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
