// ============================================
// UTILITY FUNCTIONS
// ============================================
// Helper functions for formatting, filtering, and display logic
// Used throughout the NGO Dashboard components

import { Task, Notification, TaskStatus, TaskPriority, TaskType, DisasterType, NotificationType } from './types';

// ============================================
// TIME FORMATTING
// ============================================

/**
 * formatTimeAgo
 * Converts date to human-readable relative time.
 * Used in: Notification timestamps, task cards
 * @example "2 hours ago", "Yesterday", "3 days ago"
 */
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return 'Just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
    }
}

// ============================================
// ICON MAPPINGS
// ============================================

/**
 * getTaskTypeIcon
 * Returns Lucide icon name for task type.
 * Used in: Task cards, task list
 */
export function getTaskTypeIcon(taskType: TaskType): string {
    const icons: Record<TaskType, string> = {
        AMBULANCE: 'Ambulance',
        BOAT: 'Ship',
        MEDICAL: 'Stethoscope',
        FOOD: 'UtensilsCrossed',
        EVACUATION: 'Users',
        SHELTER: 'Home',
    };
    return icons[taskType];
}

/**
 * getDisasterTypeIcon
 * Returns Lucide icon name for disaster type.
 * Used in: Map markers, disaster alerts
 */
export function getDisasterTypeIcon(disasterType: DisasterType): string {
    const icons: Record<DisasterType, string> = {
        FLOOD: 'Waves',
        EARTHQUAKE: 'Activity',
        CYCLONE: 'Wind',
        DROUGHT: 'Sun',
        HEATWAVE: 'Thermometer',
    };
    return icons[disasterType];
}

/**
 * getNotificationTypeIcon
 * Returns Lucide icon name for notification type.
 * Used in: Notification items
 */
export function getNotificationTypeIcon(notificationType: NotificationType): string {
    const icons: Record<NotificationType, string> = {
        TASK_ASSIGNED: 'ClipboardCheck',
        TASK_UPDATED: 'RefreshCw',
        URGENT_REQUEST: 'AlertTriangle',
        DISASTER_ALERT: 'AlertCircle',
        SYSTEM: 'Settings',
    };
    return icons[notificationType];
}

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * getPriorityColor
 * Returns TailwindCSS color classes for priority badge.
 * Used in: Priority badges on task cards
 */
export function getPriorityColor(priority: TaskPriority): { bg: string; text: string; border: string } {
    const colors: Record<TaskPriority, { bg: string; text: string; border: string }> = {
        LOW: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' },
        MEDIUM: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
        HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
        CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    };
    return colors[priority];
}

/**
 * getStatusColor
 * Returns TailwindCSS color classes for status badge.
 * Used in: Status badges on task cards
 */
export function getStatusColor(status: TaskStatus): { bg: string; text: string; border: string; dot: string } {
    const colors: Record<TaskStatus, { bg: string; text: string; border: string; dot: string }> = {
        PENDING_ACCEPTANCE: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
        ASSIGNED: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
        IN_PROGRESS: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
        COMPLETED: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
    };
    return colors[status];
}

/**
 * getSeverityColor
 * Returns TailwindCSS color classes for severity level.
 * Used in: Disaster markers, alert badges
 */
export function getSeverityColor(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): { bg: string; text: string; marker: string } {
    const colors: Record<string, { bg: string; text: string; marker: string }> = {
        LOW: { bg: 'bg-slate-500/20', text: 'text-slate-300', marker: '#64748b' },
        MEDIUM: { bg: 'bg-amber-500/20', text: 'text-amber-300', marker: '#f59e0b' },
        HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-300', marker: '#f97316' },
        CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-300', marker: '#ef4444' },
    };
    return colors[severity];
}

/**
 * getNotificationColor
 * Returns TailwindCSS color classes for notification type.
 * Used in: Notification items
 */
export function getNotificationColor(type: NotificationType): { bg: string; icon: string } {
    const colors: Record<NotificationType, { bg: string; icon: string }> = {
        TASK_ASSIGNED: { bg: 'bg-blue-500/20', icon: 'text-blue-400' },
        TASK_UPDATED: { bg: 'bg-amber-500/20', icon: 'text-amber-400' },
        URGENT_REQUEST: { bg: 'bg-red-500/20', icon: 'text-red-400' },
        DISASTER_ALERT: { bg: 'bg-orange-500/20', icon: 'text-orange-400' },
        SYSTEM: { bg: 'bg-slate-500/20', icon: 'text-slate-400' },
    };
    return colors[type];
}

// ============================================
// FILTER FUNCTIONS
// ============================================

/**
 * filterTasks
 * Filters task list by multiple criteria.
 * Used in: Tasks tab filter bar
 */
export function filterTasks(
    tasks: Task[],
    filters: {
        status?: TaskStatus;
        priority?: TaskPriority;
        disasterType?: DisasterType;
        taskType?: TaskType;
        dateRange?: { start: Date; end: Date };
    }
): Task[] {
    return tasks.filter((task) => {
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.disasterType && task.disasterType !== filters.disasterType) return false;
        if (filters.taskType && task.taskType !== filters.taskType) return false;
        if (filters.dateRange) {
            const taskDate = task.assignedAt.getTime();
            if (taskDate < filters.dateRange.start.getTime() || taskDate > filters.dateRange.end.getTime()) {
                return false;
            }
        }
        return true;
    });
}

/**
 * filterNotifications
 * Filters notifications by type or read status.
 * Used in: Notifications tab filter
 */
export function filterNotifications(
    notifications: Notification[],
    filters: {
        type?: NotificationType;
        unreadOnly?: boolean;
    }
): Notification[] {
    return notifications.filter((notification) => {
        if (filters.type && notification.type !== filters.type) return false;
        if (filters.unreadOnly && notification.isRead) return false;
        return true;
    });
}

/**
 * groupNotificationsByDate
 * Groups notifications into Today, Yesterday, Earlier.
 * Used in: Notifications tab display
 */
export function groupNotificationsByDate(notifications: Notification[]): {
    today: Notification[];
    yesterday: Notification[];
    earlier: Notification[];
} {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    return {
        today: notifications.filter((n) => n.createdAt >= today),
        yesterday: notifications.filter((n) => n.createdAt >= yesterday && n.createdAt < today),
        earlier: notifications.filter((n) => n.createdAt < yesterday),
    };
}

// ============================================
// CALCULATION UTILITIES
// ============================================

/**
 * calculateResponseRate
 * Calculates task acceptance/completion rate.
 * Used in: Dashboard stats
 */
export function calculateResponseRate(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const pending = tasks.filter((t) => t.status === 'PENDING_ACCEPTANCE').length;
    const accepted = tasks.length - pending;
    return Math.round((accepted / tasks.length) * 100);
}

/**
 * formatNumber
 * Formats large numbers with K/M suffix.
 * Used in: Stats display
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * formatStatusLabel
 * Converts status enum to readable label.
 * Used in: Status badges
 */
export function formatStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
        PENDING_ACCEPTANCE: 'Pending',
        ASSIGNED: 'Assigned',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
    };
    return labels[status];
}
