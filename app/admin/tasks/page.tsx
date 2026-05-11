"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ClipboardList,
    Filter,
    Search,
    CheckSquare,
    RefreshCw,
    ChevronDown,
    MoreHorizontal,
    MapPin,
    Clock,
    Building2,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { fetchTasks } from "../_lib/adminService";
import { formatTimeAgo, getStatusColor, getPriorityColor } from "../_lib/adminUtils";
import type { AdminTask, AdminTaskStatus, TaskPriority } from "../_lib/adminTypes";

// ============================================
// TASKS PAGE
// ============================================
// Manage all tasks across disasters
// Features: Status tabs, filters, bulk actions, task cards

const statusTabs: { label: string; status: AdminTaskStatus | 'ALL' }[] = [
    { label: 'All', status: 'ALL' },
    { label: 'Draft', status: 'DRAFT' },
    { label: 'Pending Approval', status: 'PENDING_APPROVAL' },
    { label: 'Unallocated', status: 'UNALLOCATED' },
    { label: 'Pending Acceptance', status: 'PENDING_ACCEPTANCE' },
    { label: 'Assigned', status: 'ASSIGNED' },
    { label: 'In Progress', status: 'IN_PROGRESS' },
    { label: 'Completed', status: 'COMPLETED' },
];

const taskTypeIcons: Record<string, string> = {
    AMBULANCE: '🚑',
    BOAT: '🚤',
    MEDICAL: '🏥',
    FOOD: '🍚',
    EVACUATION: '🚁',
    SHELTER: '⛺',
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<AdminTask[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<AdminTask[]>([]);
    const [activeTab, setActiveTab] = useState<AdminTaskStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Load data
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data);
                setFilteredTasks(data);
            } catch (e) {
                console.error("Failed to fetch tasks", e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // Filter tasks
    useEffect(() => {
        let filtered = tasks;

        if (activeTab !== 'ALL') {
            filtered = filtered.filter(t => t.status === activeTab);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.label.toLowerCase().includes(query) ||
                t.targetLocationName.toLowerCase().includes(query) ||
                t.disasterTitle.toLowerCase().includes(query)
            );
        }

        setFilteredTasks(filtered);
    }, [tasks, activeTab, searchQuery]);

    // Toggle task selection
    const toggleSelection = (taskId: string) => {
        setSelectedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    // Select all visible tasks
    const selectAll = () => {
        if (selectedTasks.size === filteredTasks.length) {
            setSelectedTasks(new Set());
        } else {
            setSelectedTasks(new Set(filteredTasks.map(t => t.id)));
        }
    };

    const getStatusCount = (status: AdminTaskStatus | 'ALL') => {
        if (status === 'ALL') return tasks.length;
        return tasks.filter(t => t.status === status).length;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage and allocate disaster response tasks
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl
                                  bg-linear-to-r from-red-500 to-orange-500
                                  text-white font-medium text-sm
                                  hover:from-red-600 hover:to-orange-600
                                  transition-all duration-200">
                    <ClipboardList className="w-4 h-4" />
                    Create Task
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {statusTabs.map((tab) => {
                    const count = getStatusCount(tab.status);
                    const isActive = activeTab === tab.status;
                    return (
                        <button
                            key={tab.status}
                            onClick={() => setActiveTab(tab.status)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                whitespace-nowrap transition-all duration-200
                                ${isActive
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                                }
                            `}
                        >
                            <span>{tab.label}</span>
                            {count > 0 && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold
                                    ${isActive ? 'bg-red-500/30' : 'bg-slate-700'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search & Bulk Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50
                                      text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                      bg-slate-800/50 border border-slate-700/50 text-slate-300">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">Filters</span>
                    </button>
                </div>

                {/* Bulk Actions */}
                {selectedTasks.size > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                            {selectedTasks.size} selected
                        </span>
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm">
                            Approve All
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm">
                            Assign All
                        </button>
                    </div>
                )}
            </div>

            {/* Select All */}
            <div className="flex items-center gap-2">
                <button
                    onClick={selectAll}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                >
                    <CheckSquare className="w-4 h-4" />
                    {selectedTasks.size === filteredTasks.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
                {filteredTasks.map((task, index) => (
                    <TaskRow
                        key={task.id}
                        task={task}
                        isSelected={selectedTasks.has(task.id)}
                        onToggle={() => toggleSelection(task.id)}
                        index={index}
                    />
                ))}
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-16">
                    <ClipboardList className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400">No tasks found</p>
                </div>
            )}
        </div>
    );
}

// Task Row Component
interface TaskRowProps {
    task: AdminTask;
    isSelected: boolean;
    onToggle: () => void;
    index: number;
}

function TaskRow({ task, isSelected, onToggle, index }: TaskRowProps) {
    const statusClass = getStatusColor(task.status);
    const priorityClass = getPriorityColor(task.priority);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`
                p-4 rounded-xl border transition-all duration-200
                ${isSelected
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700/50'
                }
            `}
        >
            <div className="flex items-center gap-4">
                {/* Checkbox */}
                <button
                    onClick={onToggle}
                    className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                        ${isSelected
                            ? 'bg-red-500 border-red-500'
                            : 'border-slate-600 hover:border-slate-500'
                        }
                    `}
                >
                    {isSelected && <CheckSquare className="w-3 h-3 text-white" />}
                </button>

                {/* Task Type Icon */}
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-lg">
                    {taskTypeIcons[task.taskType]}
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate">{task.label}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase rounded ${priorityClass}`}>
                            {task.priority}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {task.disasterTitle}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {task.targetLocationName}
                        </span>
                    </div>
                </div>

                {/* Status & Assignment */}
                <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${statusClass}`}>
                        {task.status.replace(/_/g, ' ')}
                    </span>

                    {task.assignedNgoName ? (
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-300 max-w-[120px] truncate">
                                {task.assignedNgoName}
                            </span>
                        </div>
                    ) : task.matchingNGOs && task.matchingNGOs.length > 0 ? (
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                                          bg-blue-500/20 text-blue-400 text-xs">
                            Assign
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    ) : null}

                    {/* Progress */}
                    {task.progress !== undefined && (
                        <div className="flex items-center gap-2 w-24">
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500"
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-400">{task.progress}%</span>
                        </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-slate-500 w-20">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(task.createdAt)}
                    </div>

                    {/* Actions */}
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
