"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Download,
    RefreshCw,
    TrendingUp,
    Calendar,
    FileText,
    Users,
    ClipboardList,
    AlertTriangle,
} from "lucide-react";
import { generateMockReportData } from "../_lib/adminMockData";
import type { ReportData } from "../_lib/adminTypes";

// ============================================
// REPORTS PAGE
// ============================================

export default function ReportsPage() {
    const [data, setData] = useState<ReportData | null>(null);
    const [dateRange, setDateRange] = useState('30d');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setData(generateMockReportData());
        setIsLoading(false);
    }, []);

    if (isLoading || !data) {
        return <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                    <p className="text-slate-400 text-sm mt-1">Platform-wide performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800/50 text-white text-sm"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Disasters" value={data.totalDisasters} icon={AlertTriangle} color="red" />
                <StatCard title="Total Tasks" value={data.totalTasks} icon={ClipboardList} color="blue" />
                <StatCard title="Completion Rate" value={`${data.avgCompletionRate}%`} icon={TrendingUp} color="emerald" />
                <StatCard title="Active NGOs" value={data.ngoLeaderboard.length} icon={Users} color="purple" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Disasters by Type */}
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-slate-400" />
                        Disasters by Type
                    </h3>
                    <div className="space-y-3">
                        {data.disastersByType.map((item) => (
                            <div key={item.type} className="flex items-center gap-3">
                                <span className="w-24 text-xs text-slate-400">{item.type}</span>
                                <div className="flex-1 h-6 bg-slate-800 rounded-lg overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.count / Math.max(...data.disastersByType.map(d => d.count))) * 100}%` }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="h-full bg-linear-to-r from-red-500 to-orange-500"
                                    />
                                </div>
                                <span className="w-8 text-xs text-white font-medium">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks Over Time */}
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        Tasks Over Time
                    </h3>
                    <div className="h-40 flex items-end gap-2">
                        {data.tasksOverTime.slice(-8).map((item, index) => {
                            const maxVal = Math.max(...data.tasksOverTime.map(t => t.completed));
                            const height = (item.completed / maxVal) * 100;
                            return (
                                <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="w-full bg-linear-to-t from-emerald-500 to-cyan-500 rounded-t"
                                    />
                                    <span className="text-[10px] text-slate-500">{item.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* NGO Leaderboard */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    NGO Leaderboard
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                                <th className="pb-3 font-medium">Rank</th>
                                <th className="pb-3 font-medium">Organization</th>
                                <th className="pb-3 font-medium text-right">Tasks Completed</th>
                                <th className="pb-3 font-medium text-right">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.ngoLeaderboard.slice(0, 10).map((ngo, index) => (
                                <motion.tr
                                    key={ngo.ngoId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-slate-800/50"
                                >
                                    <td className="py-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                            ${index === 0 ? 'bg-amber-500 text-white' :
                                                index === 1 ? 'bg-slate-400 text-white' :
                                                    index === 2 ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-white">{ngo.orgName}</td>
                                    <td className="py-3 text-sm text-right text-emerald-400 font-medium">{ngo.tasksCompleted}</td>
                                    <td className="py-3 text-sm text-right text-amber-400">{ngo.rating}★</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Disaster Summary', desc: 'PDF/CSV' },
                    { label: 'Task Report', desc: 'PDF/CSV' },
                    { label: 'NGO Performance', desc: 'PDF/CSV' },
                    { label: 'Volunteer Activity', desc: 'PDF/CSV' },
                ].map((item) => (
                    <button
                        key={item.label}
                        className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50
                                  text-left transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
                            <div>
                                <p className="text-sm font-medium text-white">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
}) {
    const colors: Record<string, string> = {
        red: 'bg-red-500/10 border-red-500/20 text-red-400',
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border ${colors[color]}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs opacity-70">{title}</p>
                </div>
                <Icon className="w-6 h-6 opacity-50" />
            </div>
        </motion.div>
    );
}
