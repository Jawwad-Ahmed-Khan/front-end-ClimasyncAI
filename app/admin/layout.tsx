"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";
import { generateMockAdminProfile } from "./_lib/adminMockData";
import { AdminProfile } from "./_lib/adminTypes";

// ============================================
// ADMIN DASHBOARD LAYOUT
// ============================================
// Shared layout for all Admin Dashboard pages
// Features: Dark theme, collapsible sidebar, fixed header, responsive design

// Static default values to prevent hydration mismatch
const defaultAdminProfile: AdminProfile = {
    id: 'admin-001',
    name: 'Bilal Ahmed',
    email: 'bilal@climasync.ai',
    role: 'SUPER_ADMIN',
    phone: '+92 300 9876543',
    department: 'Operations Command',
    lastActiveAt: new Date(),
    createdAt: new Date('2024-01-15'),
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Use static values for SSR, dynamic values after mount
    const [adminProfile, setAdminProfile] = useState<AdminProfile>(defaultAdminProfile);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initialize dynamic data only on client side to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        const profile = generateMockAdminProfile();
        setAdminProfile(profile);
        setUnreadCount(5); // Mock unread notifications
    }, []);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                />
                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-linear-to-br from-red-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-cyan-500/5 via-blue-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                        />
                        {/* Mobile Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-20 bottom-0 left-0 z-50 lg:hidden"
                        >
                            <AdminSidebar
                                isCollapsed={false}
                                onToggle={() => setIsMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <AdminHeader
                adminProfile={adminProfile}
                unreadNotifications={unreadCount}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            {/* Main Content */}
            <main className="relative z-10 pt-36 min-h-screen transition-all duration-300 lg:ml-0">
                <div
                    className="hidden lg:block"
                    style={{ marginLeft: isSidebarCollapsed ? 80 : 280 }}
                />
                <div
                    className="lg:ml-0"
                    style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isSidebarCollapsed ? 80 : 280) : 0 }}
                >
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
