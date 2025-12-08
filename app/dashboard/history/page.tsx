"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    History,
    Download,
    Filter,
    ChevronDown,
    ChevronUp,
    Calendar,
    FileText,
    BarChart3,
} from "lucide-react";
import { generateMockTasks } from "../_lib/mockData";
import { formatTimeAgo, formatStatusLabel, getStatusColor, getPriorityColor } from "../_lib/utils";
import { Task, TaskStatus, DisasterType } from "../_lib/types";

// ============================================
// HISTORY PAGE
// ============================================
// View task history, performance statistics, and export data
// Used as: /dashboard/history

const statusOptions: { value: TaskStatus | ""; label: string }[] = [
    { value: "", label: "All Status" },
    { value: "COMPLETED", label: "Completed" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "PENDING_ACCEPTANCE", label: "Pending" },
];

export default function HistoryPage() {
    const allTasks = useMemo(() => generateMockTasks(50), []);
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
    const [sortField, setSortField] = useState<"assignedAt" | "status">("assignedAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Filter and sort tasks
    const filteredTasks = useMemo(() => {
        let tasks = [...allTasks];

        if (statusFilter) {
            tasks = tasks.filter((t) => t.status === statusFilter);
        }

        tasks.sort((a, b) => {
            if (sortField === "assignedAt") {
                return sortDirection === "desc"
                    ? b.assignedAt.getTime() - a.assignedAt.getTime()
                    : a.assignedAt.getTime() - b.assignedAt.getTime();
            }
            return sortDirection === "desc"
                ? b.status.localeCompare(a.status)
                : a.status.localeCompare(b.status);
        });

        return tasks;
    }, [allTasks, statusFilter, sortField, sortDirection]);

    // Calculate statistics
    const stats = useMemo(() => {
        const completed = allTasks.filter((t) => t.status === "COMPLETED").length;
        const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
        const byType = allTasks.reduce((acc, task) => {
            acc[task.disasterType] = (acc[task.disasterType] || 0) + 1;
            return acc;
        }, {} as Record<DisasterType, number>);

        return {
            total: allTasks.length,
            completed,
            inProgress,
            completionRate: Math.round((completed / allTasks.length) * 100),
            byType,
        };
    }, [allTasks]);

    // Toggle sort
    const handleSort = (field: "assignedAt" | "status") => {
        if (sortField === field) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    // Export handlers (mock)
    const handleExportCSV = () => {
        alert("CSV export would be triggered here");
    };

    const handleExportPDF = () => {
        alert("PDF export would be triggered here");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        History & Analytics
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        View your task history and performance metrics
                    </p>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FileText size={18} />
                        Export CSV
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                    >
                        <Download size={18} />
                        Export PDF
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                            <History size={20} />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                            <Calendar size={20} />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                            <BarChart3 size={20} />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completionRate}%</p>
                </div>
            </motion.div>

            {/* Tasks by Disaster Type */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Tasks by Disaster Type
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(stats.byType).map(([type, count]) => (
                        <div key={type} className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{count}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                                {type.toLowerCase().replace("_", " ")}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* History Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Task History
                    </h2>

                    {/* Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
                            className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Task
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Type
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    Priority
                                </th>
                                <th
                                    className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                                    onClick={() => handleSort("status")}
                                >
                                    <div className="flex items-center gap-1">
                                        Status
                                        {sortField === "status" && (
                                            sortDirection === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                                    onClick={() => handleSort("assignedAt")}
                                >
                                    <div className="flex items-center gap-1">
                                        Date
                                        {sortField === "assignedAt" && (
                                            sortDirection === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.slice(0, 10).map((task) => {
                                const statusColors = getStatusColor(task.status);
                                const priorityColors = getPriorityColor(task.priority);

                                return (
                                    <tr
                                        key={task.id}
                                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {task.label}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {task.targetLocationName}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                                                {task.disasterType.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${priorityColors.bg} ${priorityColors.text}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
                                                <span className={`text-sm font-medium ${statusColors.text}`}>
                                                    {formatStatusLabel(task.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {formatTimeAgo(task.assignedAt)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredTasks.length > 10 && (
                    <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                        Showing 10 of {filteredTasks.length} tasks
                    </div>
                )}
            </motion.div>
        </div>
    );
}
