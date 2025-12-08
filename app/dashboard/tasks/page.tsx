"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { TaskCard } from "../_components";
import { generateMockTasks } from "../_lib/mockData";
import { filterTasks } from "../_lib/utils";
import { Task, TaskStatus, TaskPriority, DisasterType } from "../_lib/types";
import { acceptTask, rejectTask, startTask, completeTask } from "../_lib/actions";

// ============================================
// TASKS PAGE
// ============================================
// Full task management with sub-tabs, filters, and pagination
// Used as: /dashboard/tasks

const statusTabs: { value: TaskStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "PENDING_ACCEPTANCE", label: "Pending" },
    { value: "ASSIGNED", label: "Assigned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
];

const priorityOptions: { value: TaskPriority | ""; label: string }[] = [
    { value: "", label: "All Priorities" },
    { value: "CRITICAL", label: "Critical" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
];

const disasterOptions: { value: DisasterType | ""; label: string }[] = [
    { value: "", label: "All Disasters" },
    { value: "FLOOD", label: "Flood" },
    { value: "EARTHQUAKE", label: "Earthquake" },
    { value: "CYCLONE", label: "Cyclone" },
    { value: "DROUGHT", label: "Drought" },
    { value: "HEATWAVE", label: "Heatwave" },
];

const TASKS_PER_PAGE = 8;

export default function TasksPage() {
    // State
    const [allTasks, setAllTasks] = useState<Task[]>(generateMockTasks(35));
    const [activeTab, setActiveTab] = useState<TaskStatus | "ALL">("ALL");
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
    const [disasterFilter, setDisasterFilter] = useState<DisasterType | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter tasks
    const filteredTasks = useMemo(() => {
        return filterTasks(allTasks, {
            status: activeTab === "ALL" ? undefined : activeTab,
            priority: priorityFilter || undefined,
            disasterType: disasterFilter || undefined,
        });
    }, [allTasks, activeTab, priorityFilter, disasterFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * TASKS_PER_PAGE,
        currentPage * TASKS_PER_PAGE
    );

    // Reset page when filters change
    const handleTabChange = (tab: TaskStatus | "ALL") => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    // Task action handlers
    const handleAcceptTask = async (taskId: string) => {
        await acceptTask(taskId);
        setAllTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: "ASSIGNED" as const } : t))
        );
    };

    const handleRejectTask = async (taskId: string) => {
        await rejectTask(taskId);
        setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    };

    const handleStartTask = async (taskId: string) => {
        await startTask(taskId);
        setAllTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: "IN_PROGRESS" as const, progress: 0 } : t))
        );
    };

    const handleCompleteTask = async (taskId: string) => {
        await completeTask(taskId, "Task completed successfully");
        setAllTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: "COMPLETED" as const, completedAt: new Date() } : t))
        );
    };

    // Get counts for tabs
    const getTabCount = (status: TaskStatus | "ALL") => {
        if (status === "ALL") return allTasks.length;
        return allTasks.filter((t) => t.status === status).length;
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
                        Tasks
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your assigned disaster response tasks
                    </p>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
                </div>
            </motion.div>

            {/* Status Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2"
            >
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.value
                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                            }
            `}
                    >
                        {tab.label}
                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${activeTab === tab.value
                                ? "bg-white/20"
                                : "bg-slate-100 dark:bg-slate-700"
                            }`}>
                            {getTabCount(tab.value)}
                        </span>
                    </button>
                ))}
            </motion.div>

            {/* Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
                <div className="flex flex-wrap items-center gap-4">
                    {/* Filter Toggle (Mobile) */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sm:hidden"
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Filter Dropdowns */}
                    <div className={`flex flex-wrap gap-4 ${isFilterOpen ? "flex" : "hidden sm:flex"} w-full sm:w-auto`}>
                        {/* Priority Filter */}
                        <div className="relative">
                            <select
                                value={priorityFilter}
                                onChange={(e) => {
                                    setPriorityFilter(e.target.value as TaskPriority | "");
                                    setCurrentPage(1);
                                }}
                                className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                            >
                                {priorityOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Disaster Type Filter */}
                        <div className="relative">
                            <select
                                value={disasterFilter}
                                onChange={(e) => {
                                    setDisasterFilter(e.target.value as DisasterType | "");
                                    setCurrentPage(1);
                                }}
                                className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                            >
                                {disasterOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Clear Filters */}
                        {(priorityFilter || disasterFilter) && (
                            <button
                                onClick={() => {
                                    setPriorityFilter("");
                                    setDisasterFilter("");
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Tasks Grid */}
            {paginatedTasks.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                >
                    {paginatedTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <TaskCard
                                task={task}
                                onAccept={handleAcceptTask}
                                onReject={handleRejectTask}
                                onStart={handleStartTask}
                                onComplete={handleCompleteTask}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Filter size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No tasks found
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                        Try adjusting your filters or check back later for new task assignments.
                    </p>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2"
                >
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                        ? "bg-cyan-500 text-white"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
