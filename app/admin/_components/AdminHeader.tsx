"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Bell,
    Menu,
    Settings,
    LogOut,
    User,
    ChevronDown,
    AlertTriangle,
    CheckCircle,
    Clock,
    X,
    Zap,
} from "lucide-react";
import { AdminProfile } from "../_lib/adminTypes";

// ============================================
// ADMIN HEADER COMPONENT
// ============================================
// Professional dark-themed header for Admin Dashboard
// Features: Search, notifications, profile dropdown, mobile menu toggle

interface AdminHeaderProps {
    adminProfile: AdminProfile;
    unreadNotifications: number;
    isSidebarCollapsed: boolean;
    onMobileMenuToggle: () => void;
}

interface QuickNotification {
    id: string;
    title: string;
    message: string;
    type: 'alert' | 'success' | 'info';
    time: string;
}

const mockQuickNotifications: QuickNotification[] = [
    { id: '1', title: 'New Alert', message: 'Flood warning detected in Sindh', type: 'alert', time: '2m ago' },
    { id: '2', title: 'Task Completed', message: 'Evacuation task finished by PRF', type: 'success', time: '15m ago' },
    { id: '3', title: 'NGO Request', message: 'Al-Khidmat requesting verification', type: 'info', time: '1h ago' },
];

export default function AdminHeader({
    adminProfile,
    unreadNotifications,
    isSidebarCollapsed,
    onMobileMenuToggle,
}: AdminHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsProfileOpen(false);
            setIsNotificationsOpen(false);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const getNotificationIcon = (type: QuickNotification['type']) => {
        switch (type) {
            case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'info': return <Clock className="w-4 h-4 text-blue-400" />;
        }
    };

    if (!mounted) return null;

    return (
        <header
            className="fixed top-20 right-0 z-30 h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 transition-all duration-300 left-0 lg:left-auto"
            style={{
                left: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isSidebarCollapsed ? 80 : 280) : 0,
            }}
        >

            <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                {/* Left Section: Mobile Menu + Search */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white 
                                  hover:bg-slate-800/50 transition-all"
                    >
                        <Menu size={22} />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden sm:flex items-center flex-1 max-w-md relative">
                        <Search className="absolute left-3 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search disasters, tasks, NGOs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl
                                      bg-slate-900/50 border border-slate-800/50
                                      text-white placeholder-slate-500
                                      focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20
                                      transition-all duration-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 p-1 rounded-full hover:bg-slate-700"
                            >
                                <X size={14} className="text-slate-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Section: Actions + Profile */}
                <div className="flex items-center gap-2">
                    {/* Live Status Indicator */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg 
                                   bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">Live</span>
                    </div>

                    {/* AI Status */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg
                                   bg-cyan-500/10 border border-cyan-500/20">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-medium text-cyan-400">AI Active</span>
                    </div>

                    {/* Notifications */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => {
                                setIsNotificationsOpen(!isNotificationsOpen);
                                setIsProfileOpen(false);
                            }}
                            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white
                                      hover:bg-slate-800/50 transition-all duration-200"
                        >
                            <Bell size={20} />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center
                                               text-[10px] font-bold text-white
                                               bg-red-500 rounded-full border-2 border-slate-950">
                                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-80
                                              bg-slate-900 border border-slate-800 rounded-xl
                                              shadow-2xl shadow-black/50 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                                        <span className="font-semibold text-white">Notifications</span>
                                        <Link
                                            href="/admin/incidents"
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {mockQuickNotifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className="p-3 border-b border-slate-800/50 hover:bg-slate-800/30 
                                                          cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 rounded-lg bg-slate-800">
                                                        {getNotificationIcon(notif.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">
                                                            {notif.title}
                                                        </p>
                                                        <p className="text-xs text-slate-400 truncate">
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                                        {notif.time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-slate-800" />

                    {/* Profile Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => {
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotificationsOpen(false);
                            }}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl
                                      hover:bg-slate-800/50 transition-all duration-200"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-red-500 to-orange-500
                                               flex items-center justify-center text-white font-bold text-sm">
                                    {adminProfile.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 
                                               bg-emerald-500 rounded-full border-2 border-slate-950" />
                            </div>

                            {/* Name & Role */}
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-white leading-tight">
                                    {adminProfile.name}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                                    {adminProfile.role.replace('_', ' ')}
                                </p>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`hidden md:block text-slate-400 transition-transform duration-200
                                           ${isProfileOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Profile Dropdown Menu */}
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-56
                                              bg-slate-900 border border-slate-800 rounded-xl
                                              shadow-2xl shadow-black/50 overflow-hidden"
                                >
                                    {/* Profile Info */}
                                    <div className="p-4 border-b border-slate-800">
                                        <p className="font-semibold text-white">{adminProfile.name}</p>
                                        <p className="text-xs text-slate-400">{adminProfile.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2">
                                        <Link
                                            href="/admin/profile"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                                      text-slate-300 hover:text-white hover:bg-slate-800
                                                      transition-colors"
                                        >
                                            <User size={16} />
                                            <span className="text-sm">Profile Settings</span>
                                        </Link>
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                                      text-slate-300 hover:text-white hover:bg-slate-800
                                                      transition-colors"
                                        >
                                            <Settings size={16} />
                                            <span className="text-sm">System Settings</span>
                                        </Link>
                                    </div>

                                    {/* Logout */}
                                    <div className="p-2 border-t border-slate-800">
                                        <button
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                                                      text-red-400 hover:text-red-300 hover:bg-red-500/10
                                                      transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span className="text-sm">Log Out</span>
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
