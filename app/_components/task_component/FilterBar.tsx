'use client';

import React from 'react';
import { Search, Filter, RotateCw } from 'lucide-react';
import { DisasterType } from '@/app/_types/task';

interface FilterBarProps {
    locationRef: React.RefObject<HTMLInputElement | null>;
    defaultLocation?: string;
    disasterType: DisasterType | 'all';
    timeframe: '24h' | 'week' | 'month' | 'all';
    autoUpdate: boolean;
    onLocationKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onDisasterTypeChange: (type: DisasterType | 'all') => void;
    onTimeframeChange: (timeframe: '24h' | 'week' | 'month' | 'all') => void;
    onAutoUpdateToggle: () => void;
}

export default function FilterBar({
    locationRef,
    defaultLocation = 'Pakistan',
    disasterType,
    timeframe,
    autoUpdate,
    onLocationKeyDown,
    onDisasterTypeChange,
    onTimeframeChange,
    onAutoUpdateToggle,
}: FilterBarProps) {
    return (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Location Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                        <input
                            ref={locationRef}
                            type="text"
                            defaultValue={defaultLocation}
                            onKeyDown={onLocationKeyDown}
                            placeholder="Search location..."
                            className="w-full pl-12 pr-4 py-3.5 bg-linear-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Disaster Type */}
                        <div className="relative">
                            <select
                                value={disasterType}
                                onChange={(e) => onDisasterTypeChange(e.target.value as DisasterType | 'all')}
                                className="appearance-none pl-5 pr-11 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-300 shadow-sm"
                            >
                                <option value="all">All Disasters</option>
                                {Object.values(DisasterType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Timeframe */}
                        <div className="relative">
                            <select
                                value={timeframe}
                                onChange={(e) => onTimeframeChange(e.target.value as '24h' | 'week' | 'month' | 'all')}
                                className="appearance-none pl-5 pr-11 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-300 shadow-sm"
                            >
                                <option value="all">All Time</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Auto-update Toggle */}
                        <button
                            onClick={onAutoUpdateToggle}
                            className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm ${autoUpdate
                                    ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30 shadow-lg'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            <RotateCw className={`w-4 h-4 ${autoUpdate ? 'animate-spin' : ''}`} />
                            Auto-update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
