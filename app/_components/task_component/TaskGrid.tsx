'use client';

import React from 'react';
import { TaskData } from '@/app/_types/task';
import TaskCard from './TaskCard';
import { Package } from 'lucide-react';

interface TaskGridProps {
    tasks: TaskData[];
    onTaskClick: (task: TaskData) => void;
}

export default function TaskGrid({ tasks, onTaskClick }: TaskGridProps) {
    // Empty state
    if (tasks.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="p-6 bg-gray-100 rounded-full mb-6">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Tasks Found</h3>
                    <p className="text-gray-600 max-w-md">
                        There are no tasks matching your current filters. Try adjusting your search criteria.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tasks.map((task) => (
                    <div key={task.id} className="h-full">
                        <TaskCard task={task} onClick={() => onTaskClick(task)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
