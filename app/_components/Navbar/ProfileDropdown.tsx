"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogIn, UserPlus, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";

export default function ProfileDropdown() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    // Get user initials for avatar
    const initials = user?.org_name
        ? user.org_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    const isAdmin = user?.role === "admin" || user?.role === "super_admin";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center gap-2 p-2 pr-3 rounded-xl border transition-all duration-300 group ${isOpen
                    ? "bg-white/10 border-cyan-500/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                aria-label="Profile menu"
            >
                {/* Avatar Circle */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isAuthenticated
                    ? "bg-linear-to-br from-cyan-500 to-blue-500"
                    : isOpen
                        ? "bg-linear-to-br from-cyan-500 to-blue-500"
                        : "bg-linear-to-br from-slate-700 to-slate-800 group-hover:from-cyan-500/50 group-hover:to-blue-500/50"
                    }`}>
                    {isAuthenticated ? (
                        <span className="text-xs font-bold text-white">{initials}</span>
                    ) : (
                        <User className="w-4 h-4 text-white" strokeWidth={1.5} />
                    )}
                </div>

                {/* Chevron */}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-64 overflow-hidden"
                    >
                        {/* Glassmorphism Container */}
                        <div
                            className="bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 12px 24px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                            }}
                        >
                            {/* Gradient Top Accent */}
                            <div className="h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

                            {/* Header */}
                            <div className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isAuthenticated
                                        ? "bg-linear-to-br from-cyan-500 to-blue-500 border-cyan-500/30"
                                        : "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/20"
                                        }`}>
                                        {isAuthenticated ? (
                                            <span className="text-sm font-bold text-white">{initials}</span>
                                        ) : (
                                            <User className="w-5 h-5 text-cyan-400" />
                                        )}
                                    </div>
                                    <div>
                                        {isAuthenticated ? (
                                            <>
                                                <p className="text-sm font-medium text-white truncate max-w-[150px]">
                                                    {user?.org_name || "Organization"}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate max-w-[150px]">
                                                    {user?.email}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-white">Welcome</p>
                                                <p className="text-xs text-slate-400">Sign in to continue</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5 mx-4" />

                            {/* Menu Items */}
                            <div className="p-3 space-y-1">
                                {isAuthenticated ? (
                                    <>
                                        {/* Dashboard Link */}
                                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                    hover:bg-white/5 text-slate-300 hover:text-white 
                                                    transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                                    <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                                </div>
                                                <span className="font-medium text-sm">Dashboard</span>
                                            </motion.div>
                                        </Link>

                                        {/* Admin Link (role-based) */}
                                        {isAdmin && (
                                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                        hover:bg-white/5 text-slate-300 hover:text-white 
                                                        transition-all duration-200 group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                                        <Shield className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                                                    </div>
                                                    <span className="font-medium text-sm">Admin Panel</span>
                                                </motion.div>
                                            </Link>
                                        )}

                                        {/* Divider */}
                                        <div className="h-px bg-white/5 mx-2 my-1" />

                                        {/* Logout */}
                                        <button onClick={handleLogout} className="w-full">
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                    hover:bg-red-500/10 text-slate-300 hover:text-red-400 
                                                    transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center transition-colors">
                                                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                                                </div>
                                                <span className="font-medium text-sm">Logout</span>
                                            </motion.div>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Login */}
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                    hover:bg-white/5 text-slate-300 hover:text-white 
                                                    transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                                    <LogIn className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                                </div>
                                                <span className="font-medium text-sm">Login</span>
                                            </motion.div>
                                        </Link>

                                        {/* Register */}
                                        <Link href="/register" onClick={() => setIsOpen(false)}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                    bg-linear-to-r from-cyan-500/10 to-blue-500/10 
                                                    hover:from-cyan-500/20 hover:to-blue-500/20
                                                    border border-cyan-500/20 hover:border-cyan-500/30
                                                    text-white transition-all duration-200 group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                                    <UserPlus className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <span className="font-medium text-sm">Create Account</span>
                                            </motion.div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
