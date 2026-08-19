"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X, LogIn, UserPlus, Zap, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/app/_lib/auth/useAuth";

interface MobileMenuProps {
    navLinks: { href: string; label: string }[];
    pathname: string;
    onClose: () => void;
}

export default function MobileMenu({ navLinks, pathname, onClose }: MobileMenuProps) {
    const { user, isAuthenticated, logout } = useAuth();
    const isAdmin = user?.role === "admin" || user?.role === "super_admin";

    const handleLogout = () => {
        onClose();
        logout();
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] overflow-hidden"
            >
                {/* Glassmorphism Background */}
                <div
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
                    style={{
                        boxShadow: "-20px 0 50px -10px rgba(0, 0, 0, 0.5)"
                    }}
                />

                {/* Gradient Side Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-cyan-500/50 via-blue-500/30 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white">Menu</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </motion.button>
                    </div>

                    {/* User Info (when logged in) */}
                    {isAuthenticated && user && (
                        <div className="px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {user.org_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-white truncate">{user.org_name}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${pathname === link.href
                                        ? "bg-linear-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/20"
                                        : "hover:bg-white/5"
                                        }`}
                                >
                                    <span className={`font-medium text-base ${pathname === link.href ? "text-white" : "text-slate-300 group-hover:text-white"
                                        }`}>
                                        {link.label}
                                    </span>
                                    {pathname === link.href && (
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
                                    )}
                                </Link>
                            </motion.div>
                        ))}

                        {/* Dashboard link when authenticated */}
                        {isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.05 + 0.1, duration: 0.3 }}
                            >
                                <Link
                                    href="/dashboard"
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${pathname.startsWith("/dashboard")
                                        ? "bg-linear-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/20"
                                        : "hover:bg-white/5"
                                        }`}
                                >
                                    <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                                    <span className="font-medium text-base text-slate-300 group-hover:text-white">Dashboard</span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Admin link when admin */}
                        {isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (navLinks.length + 1) * 0.05 + 0.1, duration: 0.3 }}
                            >
                                <Link
                                    href="/admin"
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${pathname.startsWith("/admin")
                                        ? "bg-linear-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20"
                                        : "hover:bg-white/5"
                                        }`}
                                >
                                    <Shield className="w-4 h-4 text-slate-400 group-hover:text-orange-400" />
                                    <span className="font-medium text-base text-slate-300 group-hover:text-white">Admin Panel</span>
                                </Link>
                            </motion.div>
                        )}
                    </nav>

                    {/* Bottom Section - Auth Buttons */}
                    <div className="p-4 border-t border-white/5 space-y-3">
                        {isAuthenticated ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                            >
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-medium
                                        bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30
                                        text-red-400 hover:text-red-300 transition-all duration-300 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                >
                                    <Link
                                        href="/login"
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-medium
                                            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                                            text-slate-300 hover:text-white transition-all duration-300"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                >
                                    <Link
                                        href="/register"
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl font-medium
                                            bg-linear-to-r from-cyan-500 to-blue-500 text-white
                                            hover:from-cyan-400 hover:to-blue-400
                                            shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40
                                            transition-all duration-300"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Create Account
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
