'use client';

import React, { useState, useMemo, useRef } from 'react';
import DashboardHeader from '../_components/task_component/DashboardHeader';
import FilterBar from '../_components/task_component/FilterBar';
import HeroMetricsSection from '../_components/task_component/HeroMetricsSection';
import UnallocatedBanner from '../_components/task_component/UnallocatedBanner';
import TaskGrid from '../_components/task_component/TaskGrid';
import PaginationControl from '../_components/task_component/PaginationControl';
import TaskDetailModal from '../_components/task_component/TaskDetailModal';
import TaskCardSkeleton from '../_components/task_component/TaskCardSkeleton';
import { TaskData, DisasterType, TaskStatus } from '../_types/task';
import { generateMockTasks, generateMockMetrics, getUnallocatedCount } from '../_api/mockTaskData';

const TASKS_PER_PAGE = 8;

export default function TaskPage() {
    // Filter State
    const locationRef = useRef<HTMLInputElement>(null);
    const [searchLocation, setSearchLocation] = useState('Pakistan'); // Actual location used for filtering
    const [disasterType, setDisasterType] = useState<DisasterType | 'all'>('all');
    const [timeframe, setTimeframe] = useState<'24h' | 'week' | 'month' | 'all'>('all');
    const [autoUpdate, setAutoUpdate] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Loading State (simulate initial load)
    const [isLoading, setIsLoading] = useState(false);

    // Generate mock data based on filters
    const allTasks = useMemo(() => {
        return generateMockTasks(
            searchLocation,
            disasterType === 'all' ? DisasterType.FLOOD : disasterType
        );
    }, [searchLocation, disasterType]);

    const metrics = useMemo(() => {
        return generateMockMetrics(
            searchLocation,
            disasterType === 'all' ? DisasterType.FLOOD : disasterType
        );
    }, [searchLocation, disasterType]);

    // Filter tasks based on timeframe
    const filteredTasks = useMemo(() => {
        let tasks = [...allTasks];

        // Filter out unallocated tasks - only show allocated tasks on this page
        tasks = tasks.filter((task) => task.status !== TaskStatus.UNALLOCATED);

        if (timeframe !== 'all') {
            const now = new Date();
            const cutoff = new Date();

            switch (timeframe) {
                case '24h':
                    cutoff.setHours(now.getHours() - 24);

                    break;
                case 'week':
                    cutoff.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoff.setMonth(now.getMonth() - 1);
                    break;
            }

            tasks = tasks.filter((task) => task.updatedAt >= cutoff);
        }

        return tasks;
    }, [allTasks, timeframe]);

    // Pagination
    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
        return filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);
    }, [filteredTasks, currentPage]);

    // Get unallocated count
    const unallocatedCount = useMemo(() => getUnallocatedCount(allTasks), [allTasks]);

    // Handlers
    const handleLocationSearch = () => {
        if (locationRef.current) {
            setSearchLocation(locationRef.current.value);
            setCurrentPage(1);
        }
    };

    const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLocationSearch();
        }
    };

    const handleDisasterTypeChange = (newType: DisasterType | 'all') => {
        setDisasterType(newType);
        setCurrentPage(1);
    };

    const handleTimeframeChange = (newTimeframe: '24h' | 'week' | 'month' | 'all') => {
        setTimeframe(newTimeframe);
        setCurrentPage(1);
    };

    const handleAutoUpdateToggle = () => {
        setAutoUpdate(!autoUpdate);
    };

    const handleTaskClick = (task: TaskData) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedTask(null), 300); // Clear after animation
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <FilterBar
                locationRef={locationRef}
                defaultLocation="Pakistan"
                disasterType={disasterType}
                timeframe={timeframe}
                autoUpdate={autoUpdate}
                onLocationKeyDown={handleLocationKeyDown}
                onDisasterTypeChange={handleDisasterTypeChange}
                onTimeframeChange={handleTimeframeChange}
                onAutoUpdateToggle={handleAutoUpdateToggle}
            />

            <HeroMetricsSection metrics={metrics} />

            <UnallocatedBanner count={unallocatedCount} />

            {isLoading ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: TASKS_PER_PAGE }).map((_, index) => (
                            <TaskCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <TaskGrid tasks={paginatedTasks} onTaskClick={handleTaskClick} />

                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <TaskDetailModal
                task={selectedTask}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}
