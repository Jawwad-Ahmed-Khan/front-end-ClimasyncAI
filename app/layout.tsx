import type { Metadata } from "next";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";

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

        <Navbar />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

