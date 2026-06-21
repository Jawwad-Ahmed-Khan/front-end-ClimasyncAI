"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    ClipboardList,
    CheckCircle,
    Building2,
    Users,
    TrendingUp,
    Clock,
    ArrowRight,
    RefreshCw,
    Filter,
} from "lucide-react";
import Link from "next/link";
import AlertCard from "./_components/AlertCard";
import StatCard from "./_components/StatCard";
import LiveMap from "./_components/LiveMap";
import RiskAssessmentModal from "./_components/RiskAssessmentModal";
import { fetchNGOs } from "./_lib/adminService";
import { getAdminGlobalReport } from "@/app/_lib/admin/adminService";
import { getLiveAlerts, getActiveDisasters } from "@/app/_lib/disasters/disasterService";
import { useAlertWebsocket } from "@/app/_hooks/useAlertWebsocket";
import { triggerRiskAnalysis } from "./_lib/adminService";
import type { AdminReportResponse } from "@/app/_lib/admin/adminTypes";
import type { Alert, DisasterEvent, NGOWithPerformance, AlertSource, AlertStatus, RiskLevel } from "./_lib/adminTypes";

// ============================================
// COMMAND CENTER PAGE (Admin Home)
// ============================================
// Real-time overview of platform operations
// Features: Alert feed, stats, live map, online NGOs, quick actions

export default function CommandCenterPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [stats, setStats] = useState<AdminReportResponse | null>(null);
    const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
    const [onlineNGOs, setOnlineNGOs] = useState<NGOWithPerformance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReport, setCurrentReport] = useState<any>(null);
    const [reports, setReports] = useState<Record<string, any>>({});

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 
        (process.env.NEXT_PUBLIC_API_BASE_URL 
            ? process.env.NEXT_PUBLIC_API_BASE_URL.replace('http', 'ws').replace('/api/v1', '') 
            : 'ws://localhost:8000');
            
    const { realtimeAlerts, isConnected } = useAlertWebsocket(wsUrl);

    // Load mock data
    useEffect(() => {
        const loadData = async () => {
            try {
                const report = await getAdminGlobalReport();
                setStats(report);
            } catch (error) {
                console.error("Failed to load global report", error);
                // Keep UI from breaking if backend lacks data
                setStats({
                    total_users: 0, total_ngos: 0, pending_ngos: 0,
                    total_alerts: 0, active_disasters: 0,
                    system_health: "ok", generated_at: new Date().toISOString()
                } as AdminReportResponse);
            }

            try {
                const liveAlerts = await getLiveAlerts();
                setAlerts(liveAlerts.map(a => ({
                    id: a.alert_id,
                    type: a.severity === 'CRITICAL' ? 'EARTHQUAKE' : 'FLOOD',
                    title: 'Disaster Alert', // AlertData lacks title, using generic or derived fallback
                    description: a.description,
                    severity: 8, // numeric 0-10
                    source: a.source as AlertSource,
                    status: (a.status === 'NEW' ? 'NEW' : 'VERIFIED') as AlertStatus,
                    location: { lat: a.latitude, lng: a.longitude },
                    locationName: 'Pakistan',
                    province: 'Punjab',
                    confidence: 90,
                    detectedAt: new Date(a.timestamp)
                } as Alert)));
            } catch (e) { console.error(e); }

            try {
                const liveDisasters = await getActiveDisasters();
                setDisasters(liveDisasters.map(d => ({
                    id: d.event_id,
                    alertId: d.event_id, // assuming same for now
                    title: d.title,
                    description: d.title,
                    type: d.severity === 'CRITICAL' ? 'EARTHQUAKE' : 'FLOOD',
                    status: (d.status === 'ACTIVE' ? 'ACTIVE' : 'RESOLVED') as AlertStatus,
                    location: { lat: d.latitude, lng: d.longitude },
                    locationName: 'Pakistan',
                    province: 'Punjab',
                    severityScore: d.severity === 'CRITICAL' ? 9 : 7,
                    riskLevel: (d.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH') as RiskLevel,
                    affectedPopulation: 0,
                    precautions: [],
                    totalTasks: 0,
                    completedTasks: 0,
                    inProgressTasks: 0,
                    unallocatedTasks: 0,
                    detectedAt: new Date(d.start_time)
                } as DisasterEvent)));
            } catch (e) { console.error(e); }

            try {
                const allNGOs = await fetchNGOs("verified");
                setOnlineNGOs(allNGOs.slice(0, 8));
            } catch (e) { console.error("Failed to load NGOs", e); }
            setIsLoading(false);
            setLastRefresh(new Date());
        };
        loadData();
    }, []);

    // Handle verify action
    const handleVerify = async (alert: Alert) => {
        try {
            console.log('Initiating risk analysis for:', alert.id);
            const report = await triggerRiskAnalysis(alert);
            setReports(prev => ({ ...prev, [alert.id]: report }));
            setCurrentReport(report);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to trigger risk analysis:", error);
            // Optionally, show a toast notification here
            window.alert("Failed to analyze risk. Check console for details.");
        }
    };

    const handleViewAnalysis = (alert: Alert) => {
        setCurrentReport(reports[alert.id]);
        setIsModalOpen(true);
    };

    // Refresh data
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const report = await getAdminGlobalReport();
            setStats(report);
        } catch (error) {
            console.error(error);
        }
        setTimeout(() => {
            setLastRefresh(new Date());
            setIsLoading(false);
            window.location.reload(); // Simple refresh for now
        }, 500);
    };

    // Combine static/mock alerts with realtime alerts, giving realtime priority
    const combinedAlerts = [...realtimeAlerts, ...alerts];

    if (isLoading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading command center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Command Center</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Real-time disaster monitoring and response coordination
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                        Last updated: {lastRefresh.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl
                                  bg-slate-800/50 border border-slate-700/50
                                  text-slate-300 hover:text-white hover:bg-slate-800
                                  transition-all duration-200"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Disasters"
                    value={stats.active_disasters}
                    subtitle="Currently tracked"
                    icon={AlertTriangle}
                    color="red"
                    index={0}
                />
                <StatCard
                    title="Total Alerts"
                    value={stats.total_alerts}
                    subtitle="Platform ingestion"
                    icon={ClipboardList}
                    trend={{ value: 12, isPositive: false }}
                    color="amber"
                    index={1}
                />
                <StatCard
                    title="Platform Users"
                    value={stats.total_users}
                    subtitle="Registered globally"
                    icon={Users}
                    trend={{ value: 18, isPositive: true }}
                    color="emerald"
                    index={2}
                />
                <StatCard
                    title="Total NGOs"
                    value={stats.total_ngos}
                    subtitle={`${stats.pending_ngos} pending verification`}
                    icon={Building2}
                    color="blue"
                    index={3}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Alert Feed - Left Column */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Alert Feed Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Real-time Alerts</h2>
                                <p className="text-xs text-slate-400">
                                    {combinedAlerts.filter(a => a.status === 'NEW').length} new alerts awaiting review
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg text-slate-400 hover:text-white 
                                             hover:bg-slate-800/50 transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                            <Link
                                href="/admin/incidents"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                          text-xs font-medium text-red-400 hover:text-red-300
                                          hover:bg-red-500/10 transition-colors"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Alert Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {combinedAlerts.slice(0, 6).map((alert, index) => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onVerify={handleVerify}
                                onViewAnalysis={handleViewAnalysis}
                                hasReport={!!reports[alert.id]}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column - Map & NGOs */}
                <div className="space-y-6">
                    {/* Live Map */}
                    <LiveMap
                        alerts={combinedAlerts}
                        disasters={disasters}
                        className="h-[350px]"
                    />

                    {/* Online NGOs */}
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-400" />
                                <h3 className="text-sm font-semibold text-white">NGOs Online</h3>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium
                                               bg-emerald-500/20 text-emerald-400">
                                    {onlineNGOs.length}
                                </span>
                            </div>
                            <Link
                                href="/admin/ngos"
                                className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {onlineNGOs.slice(0, 5).map((ngo, index) => (
                                <motion.div
                                    key={ngo.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-2.5 rounded-xl
                                              bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                                {(ngo.orgName || 'N').charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white truncate max-w-[140px]">
                                                {ngo.orgName || 'Unknown NGO'}
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                {ngo.tasksInProgress} active task{ngo.tasksInProgress !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span>Now</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                    title="Review Incidents"
                    count={combinedAlerts.filter(a => a.status === 'NEW').length}
                    href="/admin/incidents"
                    color="red"
                    index={0}
                />
                <QuickActionCard
                    title="Verify NGOs"
                    count={stats.pending_ngos}
                    href="/admin/ngos"
                    color="amber"
                    index={1}
                />
                <QuickActionCard
                    title="Verify NGOs"
                    count={3}
                    href="/admin/ngos"
                    color="blue"
                    index={2}
                />
                <QuickActionCard
                    title="View Reports"
                    href="/admin/reports"
                    color="purple"
                    index={3}
                />
            </div>

            {/* Risk Assessment Modal */}
            <RiskAssessmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                report={currentReport} 
            />
        </div>
    );
}

// Quick Action Card Component
interface QuickActionCardProps {
    title: string;
    count?: number;
    href: string;
    color: 'red' | 'amber' | 'blue' | 'purple';
    index?: number;
}

function QuickActionCard({ title, count, href, color, index = 0 }: QuickActionCardProps) {
    const colorClasses = {
        red: 'from-red-500/20 to-orange-500/10 border-red-500/20 hover:border-red-500/40',
        amber: 'from-amber-500/20 to-yellow-500/10 border-amber-500/20 hover:border-amber-500/40',
        blue: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40',
        purple: 'from-purple-500/20 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40',
    };

    const textColors = {
        red: 'text-red-400',
        amber: 'text-amber-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
        >
            <Link
                href={href}
                className={`
                    block p-4 rounded-xl border backdrop-blur-sm
                    bg-linear-to-br ${colorClasses[color]}
                    transition-all duration-300 group hover:scale-[1.02]
                `}
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{title}</span>
                    {count !== undefined && (
                        <span className={`
                            px-2 py-0.5 rounded-full text-xs font-bold
                            bg-slate-900/50 ${textColors[color]}
                        `}>
                            {count}
                        </span>
                    )}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400 group-hover:text-white transition-colors">
                    <span>Go to {title.toLowerCase()}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </motion.div>
    );
}
