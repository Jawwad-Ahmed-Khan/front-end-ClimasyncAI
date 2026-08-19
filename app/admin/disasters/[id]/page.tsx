"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MapPinned,
    AlertTriangle,
    Users,
    Clock,
    ClipboardList,
    CheckCircle,
    RefreshCw,
    Building2,
} from "lucide-react";
import Link from "next/link";
import { fetchDisasterById, fetchTasksByEvent } from "../../_lib/adminService";
import { generateMockTimelineEvents } from "../../_lib/adminMockData";
import { formatTimeAgo, getStatusColor, getPriorityColor } from "../../_lib/adminUtils";
import type { DisasterEvent, AdminTask, TimelineEvent } from "../../_lib/adminTypes";

// ============================================
// DISASTER DETAILS PAGE
// ============================================

export default function DisasterDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [disaster, setDisaster] = useState<DisasterEvent | null>(null);
    const [tasks, setTasks] = useState<AdminTask[]>([]);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'allocated' | 'unallocated' | 'completed'>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [dData, tData] = await Promise.all([
                    fetchDisasterById(resolvedParams.id),
                    fetchTasksByEvent(resolvedParams.id),
                ]);
                setDisaster(dData);
                setTasks(tData);
                setTimeline(generateMockTimelineEvents(resolvedParams.id));
            } catch (e) {
                console.error("Failed to load disaster details", e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [resolvedParams.id]);

    if (isLoading || !disaster) {
        return <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
        </div>;
    }

    const filteredTasks = tasks.filter(t => {
        if (activeTab === 'allocated') return t.assignedNgoId;
        if (activeTab === 'unallocated') return !t.assignedNgoId && t.status !== 'COMPLETED';
        if (activeTab === 'completed') return t.status === 'COMPLETED';
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link href="/admin/disasters" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Disasters</span>
            </Link>

            {/* Header */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(disaster.status)}`}>
                                {disaster.status}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium bg-red-500/20 text-red-400`}>
                                Severity: {disaster.severityScore}/10
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{disaster.title}</h1>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                            <MapPinned className="w-4 h-4" />
                            {disaster.locationName}
                            <span className="text-slate-600">•</span>
                            <Users className="w-4 h-4" />
                            {disaster.affectedPopulation.toLocaleString()} affected
                        </p>
                    </div>

                    {/* Task Summary */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 rounded-xl bg-slate-800/30">
                            <p className="text-2xl font-bold text-white">{disaster.totalTasks}</p>
                            <p className="text-xs text-slate-500">Total</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-emerald-500/10">
                            <p className="text-2xl font-bold text-emerald-400">{disaster.completedTasks}</p>
                            <p className="text-xs text-slate-500">Done</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-blue-500/10">
                            <p className="text-2xl font-bold text-blue-400">{disaster.inProgressTasks}</p>
                            <p className="text-xs text-slate-500">Active</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-red-500/10">
                            <p className="text-2xl font-bold text-red-400">{disaster.unallocatedTasks}</p>
                            <p className="text-xs text-slate-500">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks Section */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Task Tabs */}
                    <div className="flex gap-2">
                        {(['all', 'allocated', 'unallocated', 'completed'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                                    ${activeTab === tab
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'text-slate-400 hover:bg-slate-800/50'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Task List */}
                    <div className="space-y-3">
                        {filteredTasks.map((task, index) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ClipboardList className="w-4 h-4 text-slate-500" />
                                        <div>
                                            <p className="text-sm font-medium text-white">{task.label}</p>
                                            <p className="text-xs text-slate-400">{task.targetLocationName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        {task.assignedNgoName ? (
                                            <span className="flex items-center gap-1 text-xs text-blue-400">
                                                <Building2 className="w-3 h-3" />
                                                {task.assignedNgoName}
                                            </span>
                                        ) : (
                                            <button className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs">
                                                Assign
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 h-fit">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Timeline
                    </h3>
                    <div className="space-y-4">
                        {timeline.map((event, index) => (
                            <div key={event.id} className="relative pl-6">
                                {index < timeline.length - 1 && (
                                    <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-slate-800" />
                                )}
                                <div className="absolute left-0 top-1 w-[18px] h-[18px] rounded-full bg-slate-800 
                                               flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{event.title}</p>
                                    <p className="text-xs text-slate-500">{event.description}</p>
                                    <p className="text-[10px] text-slate-600 mt-1">
                                        {formatTimeAgo(event.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
