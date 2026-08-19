"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    CheckCircle,
    Eye,
    XCircle,
    Filter,
    Search,
    RefreshCw,
} from "lucide-react";
import AlertCard from "../_components/AlertCard";
import PipelineModal from "../_components/PipelineModal";
import { fetchAlerts } from "../_lib/adminService";
import type { Alert, AlertStatus } from "../_lib/adminTypes";

// ============================================
// INCIDENTS PAGE
// ============================================
// Manage and verify incoming disaster alerts
// Features: Status tabs, filters, verification workflow

const statusTabs: { label: string; status: AlertStatus | 'ALL' }[] = [
    { label: 'All', status: 'ALL' },
    { label: 'New Alerts', status: 'NEW' },
    { label: 'Under Review', status: 'VERIFIED' },
    { label: 'Analyzing', status: 'ANALYZING' },
    { label: 'Active', status: 'ACTIVE' },
    { label: 'Monitoring', status: 'MONITORING' },
    { label: 'Resolved', status: 'RESOLVED' },
];

export default function IncidentsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
    const [activeTab, setActiveTab] = useState<AlertStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Pipeline Modal state
    const [isPipelineOpen, setIsPipelineOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    // Load data
    useEffect(() => {
        const loadData = async () => {
            try {
                const liveAlerts = await fetchAlerts();
                setAlerts(liveAlerts);
                setFilteredAlerts(liveAlerts);
            } catch (e) {
                console.error("Failed to load alerts", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter alerts
    useEffect(() => {
        let filtered = alerts;

        // Status filter
        if (activeTab !== 'ALL') {
            filtered = filtered.filter(a => a.status === activeTab);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(query) ||
                a.locationName.toLowerCase().includes(query) ||
                a.province.toLowerCase().includes(query)
            );
        }

        setFilteredAlerts(filtered);
    }, [alerts, activeTab, searchQuery]);

    // Handle verify action
    const handleVerify = (alertId: string) => {
        const alert = alerts.find(a => a.id === alertId);
        if (alert) {
            setSelectedAlert(alert);
            setIsPipelineOpen(true);
        }
    };

    // Get count for each status
    const getStatusCount = (status: AlertStatus | 'ALL') => {
        if (status === 'ALL') return alerts.length;
        return alerts.filter(a => a.status === status).length;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading incidents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Incidents</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Review and verify incoming disaster alerts
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                        <span className="text-xs font-medium text-red-400">
                            {getStatusCount('NEW')} pending verification
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {statusTabs.map((tab) => {
                    const count = getStatusCount(tab.status);
                    const isActive = activeTab === tab.status;

                    return (
                        <button
                            key={tab.status}
                            onClick={() => setActiveTab(tab.status)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                whitespace-nowrap transition-all duration-200
                                ${isActive
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                                }
                            `}
                        >
                            <span>{tab.label}</span>
                            {count > 0 && (
                                <span className={`
                                    px-1.5 py-0.5 rounded text-[10px] font-bold
                                    ${isActive ? 'bg-red-500/30' : 'bg-slate-700'}
                                `}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by title, location, or province..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl
                                  bg-slate-900/50 border border-slate-800/50
                                  text-white placeholder-slate-500
                                  focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20
                                  transition-all duration-200"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                  bg-slate-800/50 border border-slate-700/50
                                  text-slate-300 hover:text-white hover:bg-slate-800
                                  transition-all duration-200">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                </button>
            </div>

            {/* Alerts Grid */}
            {filteredAlerts.length === 0 ? (
                <div className="text-center py-16">
                    <AlertTriangle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400">No incidents found</p>
                    <p className="text-sm text-slate-500 mt-1">
                        Try adjusting your filters or search query
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredAlerts.map((alert, index) => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onVerify={handleVerify}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <SummaryCard
                    label="New Alerts"
                    count={getStatusCount('NEW')}
                    icon={AlertTriangle}
                    color="red"
                />
                <SummaryCard
                    label="Under Review"
                    count={getStatusCount('VERIFIED') + getStatusCount('ANALYZING')}
                    icon={Eye}
                    color="amber"
                />
                <SummaryCard
                    label="Active"
                    count={getStatusCount('ACTIVE')}
                    icon={CheckCircle}
                    color="emerald"
                />
                <SummaryCard
                    label="Resolved"
                    count={getStatusCount('RESOLVED')}
                    icon={XCircle}
                    color="slate"
                />
            </div>

            {/* Pipeline Modal */}
            <PipelineModal
                isOpen={isPipelineOpen}
                onClose={() => {
                    setIsPipelineOpen(false);
                    setSelectedAlert(null);
                }}
                alertId={selectedAlert?.id || ''}
                alertTitle={selectedAlert?.title || ''}
            />
        </div>
    );
}

// Summary Card Component
interface SummaryCardProps {
    label: string;
    count: number;
    icon: React.ElementType;
    color: 'red' | 'amber' | 'emerald' | 'slate';
}

function SummaryCard({ label, count, icon: Icon, color }: SummaryCardProps) {
    const colors = {
        red: 'bg-red-500/10 border-red-500/20 text-red-400',
        amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        slate: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                p-4 rounded-xl border ${colors[color]}
            `}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs opacity-70">{label}</p>
                </div>
                <Icon className="w-6 h-6 opacity-50" />
            </div>
        </motion.div>
    );
}
