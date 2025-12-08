"use client";

import { motion } from "framer-motion";
import {
    ClipboardCheck,
    RefreshCw,
    AlertTriangle,
    AlertCircle,
    Settings,
    Check,
    X,
} from "lucide-react";
import { Notification } from "../_lib/types";
import { formatTimeAgo, getNotificationColor } from "../_lib/utils";

// ============================================
// NOTIFICATION ITEM COMPONENT
// ============================================
// Displays a single notification with type, message, and actions
// Used in: Notifications tab, Home tab recent notifications

interface NotificationItemProps {
    notification: Notification;
    onMarkRead?: (id: string) => void;
    onAccept?: (notificationId: string, taskId: string) => void;
    onReject?: (notificationId: string, taskId: string) => void;
    onAcknowledge?: (notificationId: string, taskId: string) => void;
    variant?: "default" | "compact";
}

// Icon mapping for notification types
const notificationTypeIcons = {
    TASK_ASSIGNED: ClipboardCheck,
    TASK_UPDATED: RefreshCw,
    URGENT_REQUEST: AlertTriangle,
    DISASTER_ALERT: AlertCircle,
    SYSTEM: Settings,
};

export default function NotificationItem({
    notification,
    onMarkRead,
    onAccept,
    onReject,
    onAcknowledge,
    variant = "default",
}: NotificationItemProps) {
    const Icon = notificationTypeIcons[notification.type];
    const colors = getNotificationColor(notification.type);

    // Get action buttons based on notification type
    const getActions = () => {
        if (notification.type === "TASK_ASSIGNED" && notification.relatedTaskId) {
            return (
                <div className="flex gap-2 mt-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onAccept?.(notification.id, notification.relatedTaskId!)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                    >
                        <Check size={14} />
                        Accept
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onReject?.(notification.id, notification.relatedTaskId!)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        <X size={14} />
                        Reject
                    </motion.button>
                </div>
            );
        }

        if (notification.type === "TASK_UPDATED" && notification.relatedTaskId) {
            return (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAcknowledge?.(notification.id, notification.relatedTaskId!)}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                    Acknowledge
                </motion.button>
            );
        }

        return null;
    };

    if (variant === "compact") {
        return (
            <motion.div
                whileHover={{ x: 4 }}
                onClick={() => !notification.isRead && onMarkRead?.(notification.id)}
                className={`
          flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors
          ${notification.isRead
                        ? "bg-white dark:bg-slate-800/50"
                        : "bg-blue-50 dark:bg-blue-500/10"
                    }
        `}
            >
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.icon}`}>
                    <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${notification.isRead
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-900 dark:text-white"
                        }`}>
                        {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTimeAgo(notification.createdAt)}
                    </p>
                </div>
                {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            onClick={() => !notification.isRead && onMarkRead?.(notification.id)}
            className={`
        p-4 rounded-2xl cursor-pointer transition-all
        ${notification.isRead
                    ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    : "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30"
                }
      `}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${colors.bg} ${colors.icon}`}>
                    <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-semibold ${notification.isRead
                                ? "text-slate-700 dark:text-slate-300"
                                : "text-slate-900 dark:text-white"
                            }`}>
                            {notification.title}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                            {formatTimeAgo(notification.createdAt)}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {notification.message}
                    </p>

                    {/* Task Update Changes */}
                    {notification.changes && notification.changes.length > 0 && (
                        <div className="mt-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                            {notification.changes.map((change, idx) => (
                                <div key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                                    <span className="font-medium capitalize">{change.field}:</span>{" "}
                                    <span className="line-through text-red-400">{change.oldValue}</span>
                                    {" → "}
                                    <span className="text-emerald-400">{change.newValue}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    {getActions()}
                </div>

                {/* Unread Indicator */}
                {!notification.isRead && (
                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                )}
            </div>
        </motion.div>
    );
}
