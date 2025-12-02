'use client';

import React from 'react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { TaskData, TaskStatus } from '@/app/_types/task';
import Image from 'next/image';

interface TaskCardProps {
    task: TaskData;
    onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    // Status badge colors - vibrant gradients
    const getStatusStyle = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.COMPLETED:
                return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30';
            case TaskStatus.IN_PROGRESS:
                return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30';
            case TaskStatus.ASSIGNED:
                return 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30';
            case TaskStatus.UNALLOCATED:
                return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    // Card border accent - thicker, more vibrant
    const getCardBorderStyle = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.COMPLETED:
                return 'border-2 border-green-200 hover:border-green-400 hover:shadow-green-500/20';
            case TaskStatus.IN_PROGRESS:
                return 'border-2 border-blue-200 hover:border-blue-400 hover:shadow-blue-500/20';
            case TaskStatus.ASSIGNED:
                return 'border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-cyan-500/20';
            case TaskStatus.UNALLOCATED:
                return 'border-2 border-red-200 hover:border-red-400 hover:shadow-red-500/20';
            default:
                return 'border-2 border-gray-200';
        }
    };

    // Progress bar gradient
    const getProgressGradient = (progress: number) => {
        if (progress >= 75) return 'bg-gradient-to-r from-green-500 to-green-600';
        if (progress >= 40) return 'bg-gradient-to-r from-blue-500 to-blue-600';
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
    };

    return (
        <div
            onClick={onClick}
            className={`h-full flex flex-col bg-white ${getCardBorderStyle(task.status)} rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl group hover:-translate-y-1`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    {/* NGO Logo */}
                    {task.ngo.logo && (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-100 shadow-md">
                            <Image
                                src={task.ngo.logo}
                                alt={task.ngo.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    {/* NGO Name */}
                    <div>
                        <h4 className="text-base font-bold text-gray-900">{task.ngo.name}</h4>
                        <p className="text-xs text-gray-600 font-semibold mt-0.5">{task.taskType}</p>
                    </div>
                </div>
                {/* Status Badge */}
                <span className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide ${getStatusStyle(task.status)}`}>
                    {task.status}
                </span>
            </div>

            {/* Task Content */}
            <div className="flex-1 mb-5">
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {task.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            </div>

            {/* Location & Date */}
            <div className="flex items-center gap-4 mb-5 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{task.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.updatedAt.toLocaleDateString()}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">Progress</span>
                    <span className="font-black text-gray-900 text-base">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                        className={`h-full ${getProgressGradient(task.progress)} transition-all duration-500 rounded-full shadow-lg`}
                        style={{ width: `${task.progress}%` }}
                    />
                </div>
            </div>

            {/* View Details */}
            <div className="pt-4 border-t-2 border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600">View Details</span>
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}
