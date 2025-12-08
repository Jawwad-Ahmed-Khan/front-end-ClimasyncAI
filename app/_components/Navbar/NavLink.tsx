"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
}

export default function NavLink({ href, label, isActive }: NavLinkProps) {
    return (
        <Link href={href} className="relative group">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 overflow-hidden ${isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                    }`}
            >
                {/* Active Background Gradient */}
                {isActive && (
                    <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}

                {/* Hover Background */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-all duration-300" />

                {/* Text */}
                <span className="relative z-10 text-sm font-medium tracking-wide">
                    {label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"
                    />
                )}
            </motion.div>
        </Link>
    );
}
