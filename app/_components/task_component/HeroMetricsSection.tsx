'use client';

import React, { useState } from 'react';
import { Users, AlertTriangle, Activity, Truck, MapPin } from 'lucide-react';
import { MetricsData } from '@/app/_types/task';

interface HeroMetricsSectionProps {
    metrics: MetricsData;
}

export default function HeroMetricsSection({ metrics }: HeroMetricsSectionProps) {
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <section className="relative bg-linear-to-br from-blue-50 via-cyan-50 to-blue-100 py-16">
            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Context Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700 text-sm font-bold uppercase tracking-wider">
                            {metrics.location}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                        Real-time Relief Operations
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg font-medium">
                        {metrics.disasterType} • Updated {metrics.lastUpdated.toLocaleTimeString()}
                    </p>
                </div>

                {/* Metrics Ribbon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Affected Area */}
                    <div className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all border-2 border-blue-100 hover:border-blue-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-gray-700 text-sm font-bold uppercase tracking-wide">Affected Area</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-2">
                            {metrics.affectedArea.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">{metrics.affectedArea.unit}</div>
                    </div>

                    {/* Damage Assessment */}
                    <div className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all border-2 border-red-100 hover:border-red-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30">
                                <AlertTriangle className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-gray-700 text-sm font-bold uppercase tracking-wide">Damage</span>
                        </div>
                        <div className="text-4xl font-black text-red-600 mb-2">
                            {metrics.damageAssessment.value}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">{metrics.damageAssessment.description}</div>
                    </div>

                    {/* Recovered */}
                    <div className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all border-2 border-green-100 hover:border-green-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30">
                                <Activity className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-gray-700 text-sm font-bold uppercase tracking-wide">Recovered</span>
                        </div>
                        <div className="text-4xl font-black text-green-600 mb-2">
                            {metrics.recoveredPercentage}%
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Area recovery status</div>
                    </div>

                    {/* Aid Delivered */}
                    <div className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all border-2 border-cyan-100 hover:border-cyan-300 hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg shadow-cyan-500/30">
                                <Truck className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-gray-700 text-sm font-bold uppercase tracking-wide">Aid Delivered</span>
                        </div>
                        <div className="text-4xl font-black text-cyan-600 mb-2">
                            {metrics.aidDeliveredPercentage}%
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">Relief supplies distributed</div>
                    </div>
                </div>

                {/* Map Toggle Button */}
                <div className="text-center">
                    <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-600/40 hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                        <MapPin className="w-5 h-5" />
                        {showHeatmap ? 'Hide Heatmap' : 'View Heatmap'}
                    </button>
                </div>
            </div>
        </section>
    );
}
