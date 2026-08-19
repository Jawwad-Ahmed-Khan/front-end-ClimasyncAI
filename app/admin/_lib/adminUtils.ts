import { AlertStatus, AdminTaskStatus, TaskPriority } from './adminTypes';

/**
 * Format time ago (e.g., "2 minutes ago", "3 hours ago")
 */
export function formatTimeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return dateObj.toLocaleDateString();
}

/**
 * Get severity color class based on score
 */
export function getSeverityColor(score: number): string {
    if (score >= 8) return 'text-red-400 bg-red-500/20';
    if (score >= 6) return 'text-orange-400 bg-orange-500/20';
    if (score >= 4) return 'text-amber-400 bg-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/20';
}

/**
 * Get status color class
 */
export function getStatusColor(status: AlertStatus | AdminTaskStatus | string): string {
    const colors: Record<string, string> = {
        NEW: 'text-red-400 bg-red-500/20 border-red-500/30',
        VERIFIED: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        ANALYZING: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
        ACTIVE: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        MONITORING: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
        RESOLVED: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
        FALSE_ALARM: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
        DRAFT: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
        PENDING_APPROVAL: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
        UNALLOCATED: 'text-red-400 bg-red-500/20 border-red-500/30',
        PENDING_ACCEPTANCE: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        ASSIGNED: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
        IN_PROGRESS: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        COMPLETED: 'text-green-400 bg-green-500/20 border-green-500/30',
    };
    return colors[status.toUpperCase()] || 'text-slate-400 bg-slate-500/20';
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: TaskPriority | string): string {
    const colors: Record<string, string> = {
        LOW: 'text-slate-400 bg-slate-500/20',
        MEDIUM: 'text-blue-400 bg-blue-500/20',
        HIGH: 'text-orange-400 bg-orange-500/20',
        CRITICAL: 'text-red-400 bg-red-500/20',
    };
    return colors[priority.toUpperCase()] || 'text-slate-400 bg-slate-500/20';
}
