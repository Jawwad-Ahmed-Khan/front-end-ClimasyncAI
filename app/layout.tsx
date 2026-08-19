import type { Metadata } from "next";
import { AuthProvider } from "./_lib/auth/authContext";
import LayoutShell from "./_components/LayoutShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "ClimasyncAI - Climate Intelligence Platform",
  description: "Advanced climate monitoring and disaster management powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}



