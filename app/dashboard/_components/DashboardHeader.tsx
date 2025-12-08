"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    Search,
    Menu,
    BadgeCheck,
    ChevronDown,
    Settings,
    LogOut,
} from "lucide-react";
import { NGOProfile } from "../_lib/types";

// ============================================
// DASHBOARD HEADER COMPONENT
// ============================================
// Top header bar for NGO Dashboard
// Features: NGO name with badge, search, notifications, mobile menu toggle

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

    return (
        <>
            {/* Dynamic CSS for header margin - desktop only */}
            <style jsx global>{`
                @media (min-width: 1024px) {
                    .dashboard-header-expanded {
                        margin-left: 280px !important;
                    }
                    .dashboard-header-collapsed {
                        margin-left: 80px !important;
                    }
                }
            `}</style>
            <motion.header
                initial={false}
                animate={{ opacity: 1 }}
                className={`
                    fixed top-20 right-0 left-0 z-30 h-16 
                    bg-white dark:bg-slate-900 
                    border-b border-slate-200 dark:border-slate-800 
                    transition-[margin-left] duration-300 ease-out
                    ${isSidebarCollapsed ? 'dashboard-header-collapsed' : 'dashboard-header-expanded'}
                `}
            >
                <div className="flex items-center justify-between h-full px-4 lg:px-6">
                    {/* Left Section - Mobile Menu & Welcome */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onMobileMenuToggle}
                            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Menu size={20} />
                        </motion.button>

                        {/* Welcome Message */}
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {ngoProfile.orgName}
                                </h1>
                                {ngoProfile.isVerified && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                                        <BadgeCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                            Verified
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {ngoProfile.baseCity}, {ngoProfile.baseProvince}
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Search, Notifications, Profile */}
                    <div className="flex items-center gap-3">
                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks, notifications..."
                                    className="w-64 pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Notifications Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Bell size={20} />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                                </span>
                            )}
                        </motion.button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {ngoProfile.orgName.charAt(0)}
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {ngoProfile.headOfOperations.split(" ")[0]}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </motion.button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
                                >
                                    <div className="p-2 space-y-1">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <Settings size={16} />
                                            <span className="text-sm">Settings</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                            <LogOut size={16} />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.header>
        </>
    );
}
