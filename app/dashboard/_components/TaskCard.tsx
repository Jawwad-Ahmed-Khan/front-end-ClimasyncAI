"use client";

import { motion } from "framer-motion";
import {
    Ambulance,
    Ship,
    Stethoscope,
    UtensilsCrossed,
    Users,
    Home,
    MapPin,
    Calendar,
} from "lucide-react";
import { Task } from "../_lib/types";
import { getPriorityColor, getStatusColor, formatTimeAgo, formatStatusLabel } from "../_lib/utils";

// ============================================
// TASK CARD COMPONENT
// ============================================
// Displays a single task with type, priority, status, and actions
// Used in: Tasks tab grid, Home tab recent tasks

interface TaskCardProps {
    task: Task;
    onAccept?: (taskId: string) => void;
    onReject?: (taskId: string) => void;
    onStart?: (taskId: string) => void;
    onComplete?: (taskId: string) => void;
    variant?: "default" | "compact";
}

// Icon mapping for task types
const taskTypeIcons = {
    AMBULANCE: Ambulance,
    BOAT: Ship,
    MEDICAL: Stethoscope,
    FOOD: UtensilsCrossed,
    EVACUATION: Users,
    SHELTER: Home,
};

const taskTypeColors = {
    AMBULANCE: "text-red-400",
    BOAT: "text-blue-400",
    MEDICAL: "text-emerald-400",
    FOOD: "text-amber-400",
    EVACUATION: "text-purple-400",
    SHELTER: "text-cyan-400",
};

export default function TaskCard({
    task,
    onAccept,
    onReject,
    onStart,
    onComplete,
    variant = "default",
}: TaskCardProps) {
    const Icon = taskTypeIcons[task.taskType];
    const iconColor = taskTypeColors[task.taskType];
    const priorityColors = getPriorityColor(task.priority);
    const statusColors = getStatusColor(task.status);

    // Get action button based on status
    const getActionButton = () => {
        switch (task.status) {
            case "PENDING_ACCEPTANCE":
                return (
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onAccept?.(task.id)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                        >
                            Accept
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onReject?.(task.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Reject
                        </motion.button>
                    </div>
                );
            case "ASSIGNED":
                return (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStart?.(task.id)}
                        className="w-full px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition-colors"
                    >
                        Start Task
                    </motion.button>
                );
            case "IN_PROGRESS":
                return (
                    <div className="space-y-2">
                        {task.progress !== undefined && (
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onComplete?.(task.id)}
                            className="w-full px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                        >
                            Mark Complete
                        </motion.button>
                    </div>
                );
            case "COMPLETED":
                return (
                    <div className="text-center py-1.5 text-emerald-500 text-sm font-medium">
                        ✓ Completed
                    </div>
                );
            default:
                return null;
        }
    };

    if (variant === "compact") {
        return (
            <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 ${iconColor}`}>
                    <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {task.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {task.targetLocationName}
                    </p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text}`}>
                    {task.priority}
                </span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Header - Type Icon & Priority */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 ${iconColor}`}>
                        <Icon size={22} />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            {task.taskType.replace("_", " ")}
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {task.eventTitle}
                        </p>
                    </div>
                </div>

                {/* Priority Badge */}
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}>
                    {task.priority}
                </span>
            </div>

            {/* Task Title & Description */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {task.label}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {task.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span className="truncate max-w-[120px]">{task.targetLocationName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{formatTimeAgo(task.assignedAt)}</span>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
                <span className={`text-sm font-medium ${statusColors.text}`}>
                    {formatStatusLabel(task.status)}
                </span>
            </div>

            {/* Action Button */}
            {getActionButton()}
        </motion.div>
    );
}
