"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    MapPinned,
    Search,
    RefreshCw,
    AlertTriangle,
    ChevronRight,
    ClipboardList,
    Users,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { generateMockDisasters, formatTimeAgo, getStatusColor } from "../_lib/adminMockData";
import type { DisasterEvent } from "../_lib/adminTypes";

// ============================================
// DISASTERS PAGE
// ============================================

export default function DisastersPage() {
    const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setDisasters(generateMockDisasters(12));
        setIsLoading(false);
    }, []);

    const filtered = searchQuery
        ? disasters.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.locationName.toLowerCase().includes(searchQuery.toLowerCase()))
        : disasters;

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
        </div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Disasters</h1>
                <p className="text-slate-400 text-sm mt-1">All verified disaster events</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search disasters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50
                              text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                />
            </div>

            {/* Disaster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((disaster, index) => (
                    <motion.div
                        key={disaster.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={`/admin/disasters/${disaster.id}`}
                            className="block p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 
                                      hover:border-slate-700/50 transition-all group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(disaster.status)}`}>
                                    {disaster.status}
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                                {disaster.title}
                            </h3>

                            {/* Location */}
                            <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                                <MapPinned className="w-3 h-3" />
                                {disaster.locationName}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                                    <p className="text-lg font-bold text-red-400">{disaster.severityScore}</p>
                                    <p className="text-[10px] text-slate-500">Severity</p>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                                    <p className="text-lg font-bold text-blue-400">{disaster.totalTasks}</p>
                                    <p className="text-[10px] text-slate-500">Tasks</p>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                                    <p className="text-lg font-bold text-emerald-400">{disaster.completedTasks}</p>
                                    <p className="text-[10px] text-slate-500">Done</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {disaster.affectedPopulation.toLocaleString()} affected
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeAgo(disaster.detectedAt)}
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
