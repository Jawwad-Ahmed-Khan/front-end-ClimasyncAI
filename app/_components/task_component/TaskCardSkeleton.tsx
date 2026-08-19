'use client';

import React from 'react';

export default function TaskCardSkeleton() {
    return (
        <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Logo skeleton */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    {/* Name skeleton */}
                    <div className="space-y-2">
                        <div className="w-24 h-3 bg-gray-200 rounded" />
                        <div className="w-16 h-2 bg-gray-100 rounded" />
                    </div>
                </div>
                {/* Badge skeleton */}
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
            </div>

            {/* Content */}
            <div className="flex-1 mb-4 space-y-3">
                <div className="w-3/4 h-5 bg-gray-200 rounded" />
                <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-100 rounded" />
                    <div className="w-5/6 h-3 bg-gray-100 rounded" />
                </div>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-3 bg-gray-200 rounded" />
                <div className="w-24 h-3 bg-gray-200 rounded" />
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="w-16 h-3 bg-gray-200 rounded" />
                    <div className="w-8 h-3 bg-gray-200 rounded" />
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full" />
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-24 h-3 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
