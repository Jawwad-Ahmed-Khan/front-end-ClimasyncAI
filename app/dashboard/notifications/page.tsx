"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    CheckCheck,
    Filter,
    ChevronDown,
} from "lucide-react";
import { NotificationItem } from "../_components";
import { generateMockNotifications } from "../_lib/mockData";
import { filterNotifications, groupNotificationsByDate } from "../_lib/utils";
import { Notification, NotificationType } from "../_lib/types";
import { markNotificationRead, markAllNotificationsRead, acceptTask, rejectTask, acknowledgeTaskUpdate } from "../_lib/actions";

// ============================================
// NOTIFICATIONS PAGE
// ============================================
// Notification center with filtering and date grouping
// Used as: /dashboard/notifications

const filterTabs: { value: NotificationType | "ALL" | "UNREAD"; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "UNREAD", label: "Unread" },
    { value: "TASK_ASSIGNED", label: "Tasks" },
    { value: "DISASTER_ALERT", label: "Alerts" },
    { value: "SYSTEM", label: "System" },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    useEffect(() => {
        let isMounted = true;
        const fetchNotifs = async () => {
            try {
                const { getNotifications } = await import("@/app/_lib/notifications/notificationService");
                const liveNotifs = await getNotifications(50);
                if (isMounted) {
                    setNotifications(liveNotifs.map(n => ({
                        id: n.notification_id,
                        title: n.title,
                        message: n.message || '',
                        type: (n.notification_type?.toUpperCase() || 'SYSTEM') as Notification['type'],
                        isRead: n.is_read,
                        relatedTaskId: n.related_task_id || undefined,
                        relatedEventId: n.related_event_id || undefined,
                        changes: undefined,
                        createdAt: new Date(n.created_at),
                    })));
                }
            } catch (e) {
                console.error("Failed to fetch notifications", e);
            }
        };
        fetchNotifs();
        return () => { isMounted = false; };
    }, []);
    const [activeFilter, setActiveFilter] = useState<NotificationType | "ALL" | "UNREAD">("ALL");

    // Filter notifications
    const filteredNotifications = useMemo(() => {
        if (activeFilter === "ALL") return notifications;
        if (activeFilter === "UNREAD") return filterNotifications(notifications, { unreadOnly: true });
        return filterNotifications(notifications, { type: activeFilter });
    }, [notifications, activeFilter]);

    // Group by date
    const groupedNotifications = useMemo(() => {
        return groupNotificationsByDate(filteredNotifications);
    }, [filteredNotifications]);

    // Count unread
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Handlers
    const handleMarkRead = async (id: string) => {
        await markNotificationRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, isRead: true }))
        );
    };

    const handleAccept = async (notificationId: string, taskId: string) => {
        await acceptTask(taskId);
        await markNotificationRead(notificationId);
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
    };

    const handleReject = async (notificationId: string, taskId: string) => {
        await rejectTask(taskId);
        await markNotificationRead(notificationId);
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
    };

    const handleAcknowledge = async (notificationId: string, taskId: string) => {
        await acknowledgeTaskUpdate(notificationId, taskId);
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
    };

    // Render notification group
    const renderGroup = (title: string, items: Notification[]) => {
        if (items.length === 0) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
            >
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {title}
                </h3>
                <div className="space-y-3">
                    {items.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={handleMarkRead}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onAcknowledge={handleAcknowledge}
                        />
                    ))}
                </div>
            </motion.div>
        );
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
                        Notifications
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Stay updated with task assignments and alerts
                    </p>
                </div>

                {/* Mark All Read Button */}
                {unreadCount > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
                    >
                        <CheckCheck size={18} />
                        Mark All Read ({unreadCount})
                    </motion.button>
                )}
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-2"
            >
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveFilter(tab.value)}
                        className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeFilter === tab.value
                                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                            }
            `}
                    >
                        {tab.label}
                        {tab.value === "UNREAD" && unreadCount > 0 && (
                            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${activeFilter === tab.value
                                    ? "bg-white/20"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                                }`}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </motion.div>

            {/* Notification Groups */}
            {filteredNotifications.length > 0 ? (
                <div className="space-y-8">
                    {renderGroup("Today", groupedNotifications.today)}
                    {renderGroup("Yesterday", groupedNotifications.yesterday)}
                    {renderGroup("Earlier", groupedNotifications.earlier)}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Bell size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No notifications
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                        {activeFilter === "UNREAD"
                            ? "You're all caught up! No unread notifications."
                            : "You don't have any notifications yet."}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
