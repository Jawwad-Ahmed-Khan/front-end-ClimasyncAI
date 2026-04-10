"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    ClipboardList,
    Bell,
    Package,
    MapPin,
    BadgeCheck,
    Zap,
} from "lucide-react";
import { StatCard, TaskCard, NotificationItem, MiniMap } from "./_components";
import {
    generateMockNGOProfile,
    generateMockStats,
    generateMockNotifications,
    generateMockActiveDisasters,
} from "./_lib/mockData";
import { getTasks, updateTask } from "@/app/_lib/tasks/taskService";
import type { TaskResponse } from "@/app/_lib/tasks/taskTypes";
import { markNotificationRead } from "./_lib/actions";
import type { Task, TaskStatus } from "@/app/dashboard/_lib/types";

// ============================================
// HOME PAGE (Dashboard Landing)
// ============================================
// Default tab showing overview: stats, map, recent notifications, quick actions
// Used as: /dashboard

export default function DashboardHome() {
    // Mock data - will be replaced with API calls
    const ngoProfile = generateMockNGOProfile();
    const stats = generateMockStats();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [notifications, setNotifications] = useState(generateMockNotifications(10));
    const disasters = generateMockActiveDisasters();

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const liveTasks = await getTasks();
                setTasks(liveTasks.map(t => ({
                    id: t.task_id,
                    label: t.title,
                    description: t.description,
                    taskType: 'MEDICAL', // mapping required_role could be done later
                    disasterType: 'EARTHQUAKE',
                    requiredQuantity: 1,
                    priority: t.priority,
                    targetLocation: { lat: t.latitude, lng: t.longitude },
                    targetLocationName: 'Mapped Location',
                    status: (t.status === 'UNALLOCATED' ? 'PENDING_ACCEPTANCE' : t.status) as TaskStatus,
                    assignedAt: new Date(t.created_at),
                    eventId: t.event_id,
                    eventTitle: t.title,
                    progress: t.progress_percentage
                })));
            } catch (e) {
                console.error(e);
            }
        };
        loadDashboardData();
    }, []);

    // Get recent items
    const recentTasks = tasks.slice(0, 3);
    const recentNotifications = notifications.slice(0, 5);

    // Task action handlers
    const handleAcceptTask = async (taskId: string) => {
        await updateTask(taskId, { status: 'ASSIGNED' });
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: "ASSIGNED" as const } : t))
        );
    };

    const handleRejectTask = async (taskId: string) => {
        await updateTask(taskId, { status: 'UNALLOCATED' });
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
    };

    const handleStartTask = async (taskId: string) => {
        await updateTask(taskId, { status: 'IN_PROGRESS' });
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: "IN_PROGRESS" as const, progress: 0 } : t))
        );
    };

    const handleCompleteTask = async (taskId: string) => {
        await updateTask(taskId, { status: 'COMPLETED', completion_notes: "Task completed successfully" });
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: "COMPLETED" as const, completedAt: new Date() } : t))
        );
    };

    // Notification action handler
    const handleMarkNotificationRead = async (id: string) => {
        await markNotificationRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-6 rounded-2xl bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Welcome back, {ngoProfile.headOfOperations.split(" ")[0]}!
                            </h1>
                            {ngoProfile.isVerified && (
                                <BadgeCheck className="w-6 h-6 text-emerald-300" />
                            )}
                        </div>
                        <p className="text-white/80">
                            {ngoProfile.orgName} • {ngoProfile.baseCity}, {ngoProfile.baseProvince}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Zap className="w-5 h-5 text-yellow-300" />
                        <span className="text-white font-semibold">{stats.responseRate}% Response Rate</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon="tasks"
                    label="Active Tasks"
                    value={stats.activeTasks}
                    trend={8}
                    delay={0}
                />
                <StatCard
                    icon="pending"
                    label="Pending Requests"
                    value={stats.pendingRequests}
                    delay={0.1}
                />
                <StatCard
                    icon="completed"
                    label="Completed (Month)"
                    value={stats.completedThisMonth}
                    trend={12}
                    delay={0.2}
                />
                <StatCard
                    icon="rate"
                    label="Response Rate"
                    value={stats.responseRate}
                    suffix="%"
                    delay={0.3}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Map & Tasks */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Mini Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Active Disasters in Your Area
                            </h2>
                            <Link
                                href="/map"
                                className="flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                                Full Map
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <MiniMap disasters={disasters} />
                    </motion.div>

                    {/* Recent Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Recent Tasks
                            </h2>
                            <Link
                                href="/dashboard/tasks"
                                className="flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                                View All
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    variant="compact"
                                    onAccept={handleAcceptTask}
                                    onReject={handleRejectTask}
                                    onStart={handleStartTask}
                                    onComplete={handleCompleteTask}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Notifications & Quick Actions */}
                <div className="space-y-6">
                    {/* Recent Notifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Notifications
                            </h2>
                            <Link
                                href="/dashboard/notifications"
                                className="flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                            >
                                View All
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {recentNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    variant="compact"
                                    onMarkRead={handleMarkNotificationRead}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            <Link href="/dashboard/tasks">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                                        <ClipboardList size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        View All Tasks
                                    </span>
                                </motion.div>
                            </Link>
                            <Link href="/dashboard/notifications">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                        <Bell size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Check Notifications
                                    </span>
                                </motion.div>
                            </Link>
                            <Link href="/dashboard/resources">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                        <Package size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Update Resources
                                    </span>
                                </motion.div>
                            </Link>
                            <Link href="/dashboard/areas">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Manage Areas
                                    </span>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
