"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./_components/Sidebar";
import DashboardHeader from "./_components/DashboardHeader";
import { generateMockNGOProfile, generateMockNotifications } from "./_lib/mockData";
import { NGOProfile, Notification } from "./_lib/types";
import { ProtectedRoute } from "@/app/_lib/auth/authGuard";

// ============================================
// DASHBOARD LAYOUT
// ============================================
// Shared layout for all NGO Dashboard pages
// Features: Collapsible sidebar, fixed header, responsive design
// This layout EXCLUDES the main Navbar/Footer from app/layout.tsx

// Static default values to prevent hydration mismatch
const defaultProfile: NGOProfile = {
    id: 'ngo-001',
    orgName: 'Pakistan Relief Foundation',
    registrationNumber: 'PRF-2019-0847',
    headOfOperations: 'Ahmed Khan',
    phone: '+92 300 1234567',
    email: 'operations@pakistanrelief.org',
    baseCity: 'Karachi',
    baseDistrict: 'Karachi South',
    baseProvince: 'Sindh',
    baseLocation: { lat: 24.8607, lng: 67.0011 },
    serviceRadiusKm: 150,
    isVerified: true,
    createdAt: new Date('2019-03-15'),
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Use static values for SSR, dynamic values after mount
    const [ngoProfile, setNgoProfile] = useState<NGOProfile>(defaultProfile);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initialize dynamic data only on client side to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        const profile = generateMockNGOProfile();
        const notifications = generateMockNotifications(10);
        setNgoProfile(profile);
        setUnreadCount(notifications.filter((n) => !n.isRead).length);
    }, []);

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
                className="pt-36 min-h-screen transition-all duration-300"
                style={{
                    marginLeft: isSidebarCollapsed ? 80 : 280,
                }}
            >
                {/* Hide margin on mobile */}
                <style jsx>{`
          @media (max-width: 1023px) {
            main {
              margin-left: 0 !important;
            }
          }
        `}</style>

                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>
        </div>
        </ProtectedRoute>
    );
}
