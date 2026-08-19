"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    Bell,
    Package,
    MapPin,
    History,
    User,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Shield,
    Loader2,
} from "lucide-react";

// ============================================
// SIDEBAR COMPONENT (Optimized with Loading States)
// ============================================
// Features: Click feedback, loading spinner, CSS transitions

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: <LayoutDashboard size={20} /> },
    { href: "/dashboard/tasks", label: "Tasks", icon: <ClipboardList size={20} /> },
    { href: "/dashboard/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { href: "/dashboard/resources", label: "Resources", icon: <Package size={20} /> },
    { href: "/dashboard/areas", label: "Areas", icon: <MapPin size={20} /> },
    { href: "/dashboard/history", label: "History", icon: <History size={20} /> },
    { href: "/dashboard/profile", label: "Profile", icon: <User size={20} /> },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loadingHref, setLoadingHref] = useState<string | null>(null);

    // Reset loading state when route changes
    useEffect(() => {
        setLoadingHref(null);
    }, [pathname]);

    // Handle navigation with loading state
    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();

        // Don't navigate if already on this page
        if (pathname === href) return;

        setLoadingHref(href);
        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <aside
            className={`
                fixed left-0 top-20 bottom-0 z-40 
                flex flex-col bg-slate-900 border-r border-slate-800
                transition-[width] duration-300 ease-out
                ${isCollapsed ? 'w-20' : 'w-[280px]'}
            `}
        >
            {/* Logo Section */}
            <div className="flex items-center h-16 px-4 border-b border-slate-800">
                <Link href="/dashboard" className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                    </div>

                    {/* Brand Name - Hidden when collapsed */}
                    <div
                        className={`
                            flex items-baseline overflow-hidden
                            transition-all duration-300 ease-out
                            ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                        `}
                    >
                        <span className="text-lg font-bold text-white whitespace-nowrap">Clima</span>
                        <span className="text-lg font-bold text-cyan-400 whitespace-nowrap">sync</span>
                        <span className="text-sm font-semibold text-slate-400 ml-1 whitespace-nowrap">NGO</span>
                    </div>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    const isLoading = loadingHref === item.href;

                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(item.href, e)}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-xl 
                                transition-all duration-200 cursor-pointer
                                ${isLoading ? 'scale-[0.98] opacity-80' : 'hover:translate-x-1'}
                                ${isActive
                                    ? "bg-linear-to-r from-cyan-500/20 to-blue-500/10 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                }
                                ${isLoading ? 'bg-slate-800/70' : ''}
                            `}
                        >
                            {/* Active Indicator */}
                            {isActive && !isLoading && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-linear-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                            )}

                            {/* Icon or Loading Spinner */}
                            <span className={`shrink-0 ${isActive ? "text-cyan-400" : ""}`}>
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin text-cyan-400" />
                                ) : (
                                    item.icon
                                )}
                            </span>

                            {/* Label - Hidden when collapsed */}
                            <span
                                className={`
                                    text-sm font-medium whitespace-nowrap
                                    transition-all duration-300 ease-out
                                    ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
                                `}
                            >
                                {isLoading ? 'Loading...' : item.label}
                            </span>
                        </a>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-slate-800 space-y-2">
                {/* Collapse Toggle */}
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 active:scale-95"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    <span
                        className={`
                            text-sm font-medium
                            transition-all duration-300 ease-out
                            ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
                        `}
                    >
                        Collapse
                    </span>
                </button>

                {/* Logout Button */}
                <Link href="/">
                    <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 active:scale-95">
                        <LogOut size={20} />
                        <span
                            className={`
                                text-sm font-medium
                                transition-all duration-300 ease-out
                                ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
                            `}
                        >
                            Exit Dashboard
                        </span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
