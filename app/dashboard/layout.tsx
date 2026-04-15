"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./_components/Sidebar";
import DashboardHeader from "./_components/DashboardHeader";
import { generateMockNGOProfile } from "./_lib/mockData";
import { NGOProfile, Notification } from "./_lib/types";
import { ProtectedRoute } from "@/app/_lib/auth/authGuard";
import { useAuth } from "@/app/_lib/auth/useAuth";
import { getUnreadCount } from "@/app/_lib/notifications/notificationService";

// ============================================
// DASHBOARD LAYOUT
// ============================================
// Shared layout for all NGO Dashboard pages
// Features: Collapsible sidebar, fixed header, responsive design
// This layout EXCLUDES the main Navbar/Footer from app/layout.tsx

// Static default values to prevent hydration mismatch
const defaultProfile: NGOProfile = {
    id: 'ngo-001',
    orgName: 'Loading...',
    registrationNumber: '',
    headOfOperations: '',
    phone: '',
    email: '',
    baseCity: '',
    baseDistrict: '',
    baseProvince: '',
    baseLocation: { lat: 24.8607, lng: 67.0011 },
    serviceRadiusKm: 150,
    isVerified: false,
    createdAt: new Date(),
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useAuth();

    // Use static values for SSR, dynamic values after mount
    const [ngoProfile, setNgoProfile] = useState<NGOProfile>(defaultProfile);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load real data from auth context and notification API
    useEffect(() => {
        setIsMounted(true);

        // Build profile from auth user data
        if (user) {
            setNgoProfile({
                id: user.user_id,
                orgName: user.org_name || 'My Organization',
                registrationNumber: '',
                headOfOperations: '',
                phone: '',
                email: user.email,
                baseCity: '',
                baseDistrict: '',
                baseProvince: '',
                baseLocation: { lat: 24.8607, lng: 67.0011 },
                serviceRadiusKm: 150,
                isVerified: user.verification_status === 'verified',
                createdAt: new Date(),
            });
        }

        // Load real unread count
        getUnreadCount()
            .then((count) => setUnreadCount(count))
            .catch(() => setUnreadCount(0));
    }, [user]);

    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar
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
                            className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        />
                        {/* Mobile Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-20 bottom-0 left-0 z-50 lg:hidden"
                        >
                            <Sidebar
                                isCollapsed={false}
                                onToggle={() => setIsMobileMenuOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <DashboardHeader
                ngoProfile={ngoProfile}
                unreadNotifications={unreadCount}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            {/* Main Content */}
            <main
                className={`
                    pt-36 min-h-screen transition-all duration-300
                    ml-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}
                `}
            >
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
        </ProtectedRoute>
    );
}
