/**
 * Disaster Legend - Explains map symbols and colors
 */

'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Droplets, Activity } from 'lucide-react';

export default function DisasterLegend() {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="fixed bottom-8 right-4 z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-panel rounded-2xl w-[280px] overflow-hidden transition-all duration-300">
                {/* Header */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
                            <Info className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="font-semibold text-white text-sm tracking-wide">Legend</span>
                    </div>
                    {expanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    )}
                </button>

                {/* Content */}
                {expanded && (
                    <div className="px-4 pb-4 space-y-5 animate-fade-in-up">
                        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-3" />

                        {/* Earthquake Magnitude */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <Activity className="w-3 h-3 text-red-400" />
                                <span>Earthquake Magnitude</span>
                            </div>

                            <div className="relative pt-1">
                                <div className="h-2 w-full rounded-full bg-linear-to-r from-cyan-500 via-amber-400 to-red-500 shadow-inner" />
                                <div className="flex justify-between mt-1.5 text-[10px] font-medium text-slate-400">
                                    <span>&lt; 3.0</span>
                                    <span>4.0</span>
                                    <span>5.0</span>
                                    <span>&gt; 6.0</span>
                                </div>

                                {/* Markers example */}
                                <div className="flex justify-between items-end mt-2 px-1">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                        <span className="text-[9px] text-slate-500">Minor</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                                        <span className="text-[9px] text-slate-500">Moderate</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse" />
                                        <span className="text-[9px] text-slate-500">Severe</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rain Intensity */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <Droplets className="w-3 h-3 text-blue-400" />
                                <span>Rain Intensity (mm/h)</span>
                            </div>

                            <div className="relative pt-1">
                                <div className="h-2 w-full rounded-full bg-linear-to-r from-transparent via-blue-500 to-purple-600 shadow-inner border border-white/5" />
                                <div className="flex justify-between mt-1.5 text-[10px] font-medium text-slate-400">
                                    <span>0</span>
                                    <span>10</span>
                                    <span>25</span>
                                    <span>&gt; 50</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-medium">ClimaSyncAI Monitor</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-400 font-medium">Live</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
