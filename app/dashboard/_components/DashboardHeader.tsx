"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Bell,
    Search,
    Menu,
    BadgeCheck,
    ChevronDown,
    Settings,
    LogOut,
    User,
} from "lucide-react";
import { NGOProfile } from "../_lib/types";
import { useAuth } from "@/app/_lib/auth/useAuth";

interface DashboardHeaderProps {
    ngoProfile: NGOProfile;
    unreadNotifications: number;
    onMobileMenuToggle: () => void;
    isSidebarCollapsed: boolean;
}

export default function DashboardHeader({
    ngoProfile,
    unreadNotifications,
    onMobileMenuToggle,
    isSidebarCollapsed,
}: DashboardHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const router = useRouter();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
        router.push("/login");
    };

    return (
        <header
            className={`
                fixed top-20 right-0 left-0 z-30 h-16
                bg-white dark:bg-slate-900
                border-b border-slate-200 dark:border-slate-800
                transition-[margin-left] duration-300 ease-out
                ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}
            `}
        >
            <div className="flex items-center justify-between h-full px-4 lg:px-6">

                {/* Left — Mobile menu toggle + org name */}
                <div className="flex items-center gap-3 min-w-0">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                    >
                        <Menu size={20} />
                    </motion.button>

                    <div className="hidden sm:block min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                                {ngoProfile.orgName}
                            </h1>
                            {ngoProfile.isVerified && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 shrink-0">
                                    <BadgeCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                        Verified
                                    </span>
                                </div>
                            )}
                        </div>
                        {(ngoProfile.baseCity || ngoProfile.baseProvince) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {[ngoProfile.baseCity, ngoProfile.baseProvince].filter(Boolean).join(", ")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right — Search, Bell, Profile */}
                <div className="flex items-center gap-2">

                    {/* Search — hidden on mobile */}
                    <div className="hidden md:flex items-center relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search tasks, notifications..."
                            className="w-56 lg:w-64 pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                        />
                    </div>

                    {/* Notifications bell — routes to /dashboard/notifications */}
                    <Link href="/dashboard/notifications">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                            <Bell size={20} />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                                </span>
                            )}
                        </motion.div>
                    </Link>

                    {/* Profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                {ngoProfile.orgName.charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown
                                size={15}
                                className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                            />
                        </motion.button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
                                >
                                    {/* Profile info */}
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                            {ngoProfile.orgName}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {ngoProfile.email}
                                        </p>
                                    </div>

                                    <div className="p-1.5 space-y-0.5">
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                                        >
                                            <User size={15} />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                                        >
                                            <Settings size={15} />
                                            Settings
                                        </Link>
                                    </div>

                                    <div className="p-1.5 border-t border-slate-100 dark:border-slate-700">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm"
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
