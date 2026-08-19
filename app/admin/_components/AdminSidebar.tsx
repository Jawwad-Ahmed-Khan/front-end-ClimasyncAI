"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    AlertTriangle,
    MapPinned,
    ClipboardList,
    Building2,
    Users,
    MessageSquare,
    Share2,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Shield,
    Zap,
} from "lucide-react";

// ============================================
// ADMIN SIDEBAR COMPONENT
// ============================================
// Professional dark-themed navigation for Admin Dashboard
// Features: Collapsible, loading states, active indicators, animations

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

const navItems: NavItem[] = [
    { href: "/admin", label: "Command Center", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/incidents", label: "Incidents", icon: <AlertTriangle size={20} /> },
    { href: "/admin/disasters", label: "Disasters", icon: <MapPinned size={20} /> },
    { href: "/admin/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
    { href: "/admin/ngos", label: "NGOs", icon: <Building2 size={20} /> },
    { href: "/admin/volunteers", label: "Volunteers", icon: <Users size={20} /> },
    { href: "/admin/messages", label: "Messages", icon: <MessageSquare size={20} /> },
    { href: "/admin/social", label: "Social Posts", icon: <Share2 size={20} /> },
    { href: "/admin/reports", label: "Reports", icon: <BarChart3 size={20} /> },
];

export default function AdminSidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loadingPath, setLoadingPath] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle navigation with loading state
    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (href === pathname) return;

        setLoadingPath(href);
        startTransition(() => {
            router.push(href);
        });
    };

    // Clear loading state when navigation completes
    useEffect(() => {
        if (!isPending && loadingPath) {
            setLoadingPath(null);
        }
    }, [isPending, loadingPath]);

    // Check if path is active
    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    if (!mounted) return null;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-20 bottom-0 z-40 flex flex-col bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/50"
        >
            {/* Logo/Brand Area */}
            <div className="h-16 flex items-center justify-center border-b border-slate-800/50 px-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        {/* Pulse indicator */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-950" />
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col"
                        >
                            <span className="text-sm font-bold text-white tracking-wide">
                                ADMIN CONTROL
                            </span>
                            <span className="text-xs text-slate-500">
                                ClimaSync.AI
                            </span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const loading = loadingPath === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(item.href, e)}
                            className={`
                                relative flex items-center gap-3 px-3 py-3 rounded-xl
                                transition-all duration-200 group
                                ${active
                                    ? "bg-linear-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                }
                                ${loading ? "pointer-events-none" : ""}
                            `}
                        >
                            {/* Active indicator line */}
                            {active && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-red-500 to-orange-500 rounded-r-full"
                                />
                            )}

                            {/* Icon with loading state */}
                            <div className={`
                                flex items-center justify-center w-8 h-8 rounded-lg
                                transition-all duration-200
                                ${active
                                    ? "bg-linear-to-br from-red-500/20 to-orange-500/20 text-red-400"
                                    : "text-slate-400 group-hover:text-white group-hover:bg-slate-700/50"
                                }
                            `}>
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin text-red-400" />
                                ) : (
                                    item.icon
                                )}
                            </div>

                            {/* Label */}
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium text-sm flex-1"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {/* Badge */}
                            {!isCollapsed && item.badge && (
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full
                                                bg-red-500/20 text-red-400 border border-red-500/30">
                                    {item.badge}
                                </span>
                            )}

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-red-500/0 to-orange-500/0 group-hover:from-red-500/5 group-hover:to-orange-500/5 transition-all duration-300" />
                        </Link>
                    );
                })}
            </nav>

            {/* System Status */}
            {!isCollapsed && (
                <div className="p-4 border-t border-slate-800/50">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span>AI Pipeline Active</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-linear-to-r from-emerald-500 to-cyan-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-xs text-emerald-400 font-mono">85%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapse Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-r-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 group"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? (
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                ) : (
                    <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                )}
            </button>
        </motion.aside>
    );
}
