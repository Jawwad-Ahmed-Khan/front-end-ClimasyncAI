"use client";

/**
 * ClimaSync.AI — Auth Layout
 *
 * Dedicated layout for authentication pages (login, register, verify).
 * NO Navbar or Footer — clean, distraction-free experience.
 * Left panel: branding hero. Right panel: form content.
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* ---------------------------------------------------------------- */}
      {/* Left Panel — Branding Hero (hidden on mobile) */}
      {/* ---------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/home/slide1.webp"
            alt="Disaster Management"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-cyan-950/60" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-cyan-500/30 transition-all">
                <Image
                  src="/images/logos/climasync-logo.png"
                  alt="ClimasyncAI"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">Clima</span>
                <span className="text-2xl font-bold text-cyan-400">sync</span>
                <span className="text-2xl font-bold text-white">AI</span>
              </div>
            </Link>
          </motion.div>

          {/* Central Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Disaster Response
              </span>{" "}
              for Pakistan
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-md">
              Join the platform that verifies, analyzes, and coordinates
              disaster relief in real-time. Together, we save lives.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              {[
                { value: "24/7", label: "Monitoring" },
                { value: "50+", label: "NGOs" },
                { value: "Real-time", label: "Verification" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center gap-2 text-slate-500 text-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>System operational — All services active</span>
          </motion.div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Right Panel — Form Content */}
      {/* ---------------------------------------------------------------- */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />

        {/* Top Bar — Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 p-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Form Container */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>

        {/* Decorative accents */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
