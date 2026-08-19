/**
 * Control Panel - Layer toggle panel with glassmorphism styling
 */

'use client';

import { useState } from 'react';
import {
    CloudRain,
    Activity,
    Building2,
    Mountain,
    Layers,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Sun,
    Moon,
    Eye,
    EyeOff,
} from 'lucide-react';
import type { MapLayerState } from '@/app/_types/api';
import { formatRelativeTime } from '@/app/_utils/geoUtils';

interface ControlPanelProps {
    layerState: MapLayerState;
    onLayerToggle: (layer: keyof MapLayerState) => void;
    lastUpdated: number | null;
    onRefresh: () => void;
    isRefreshing?: boolean;
    onThemeToggle: () => void;
    isDarkTheme: boolean;
    onDummyDataToggle: () => void;
    showDummyData: boolean;
}

export default function ControlPanel({
    layerState,
    onLayerToggle,
    lastUpdated,
    onRefresh,
    isRefreshing = false,
    onThemeToggle,
    isDarkTheme,
    onDummyDataToggle,
    showDummyData,
}: ControlPanelProps) {
    const [expanded, setExpanded] = useState(false);

    const layers = [
        {
            key: 'rain' as const,
            label: 'Rain Layer',
            icon: CloudRain,
            color: 'from-cyan-500 to-blue-500',
            shadowColor: 'shadow-cyan-500/25',
        },
        {
            key: 'earthquakes' as const,
            label: 'Earthquakes',
            icon: Activity,
            color: 'from-red-500 to-orange-500',
            shadowColor: 'shadow-red-500/25',
        },
        {
            key: 'buildings3D' as const,
            label: '3D Buildings',
            icon: Building2,
            color: 'from-violet-500 to-purple-500',
            shadowColor: 'shadow-violet-500/25',
        },
        {
            key: 'terrain' as const,
            label: 'Terrain',
            icon: Mountain,
            color: 'from-emerald-500 to-green-500',
            shadowColor: 'shadow-emerald-500/25',
        },
    ];

    return (
        <div className="fixed top-24 right-4 z-10 animate-fade-in-up">
            {/* Main Panel */}
            <div className="glass-panel rounded-2xl min-w-[240px] overflow-hidden transition-all duration-300">
                {/* Header */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors group"
                    aria-label="Toggle control panel"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                            <Layers className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="font-semibold text-white tracking-wide text-sm">View Options</span>
                    </div>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    )}
                </button>

                {/* Layer Toggles */}
                {expanded && (
                    <div className="px-4 pb-4 space-y-3 animate-fade-in-up">
                        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-3" />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={onThemeToggle}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-linear-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-500 hover:to-orange-500 rounded-xl transition-all shadow-lg shadow-amber-500/20 border border-white/10 group"
                        >
                            <div className="flex items-center gap-2.5">
                                {isDarkTheme ? (
                                    <Sun className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-500" />
                                ) : (
                                    <Moon className="w-4 h-4 text-white group-hover:-rotate-12 transition-transform duration-500" />
                                )}
                                <span className="text-sm font-medium text-white">
                                    {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
                                </span>
                            </div>
                        </button>

                        {/* Dummy Data Toggle */}
                        <button
                            onClick={onDummyDataToggle}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border border-white/5 ${showDummyData
                                ? 'bg-linear-to-r from-violet-500/80 to-purple-500/80 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/20'
                                : 'glass-button hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                {showDummyData ? (
                                    <Eye className="w-4 h-4 text-white" />
                                ) : (
                                    <EyeOff className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                )}
                                <span className={`text-sm font-medium ${showDummyData ? 'text-white' : 'text-slate-300'}`}>
                                    {showDummyData ? 'Hide Sample Data' : 'Show Sample Data'}
                                </span>
                            </div>
                        </button>

                        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-2" />

                        {layers.map((layer) => {
                            const Icon = layer.icon;
                            const isActive = layerState[layer.key];

                            return (
                                <div key={layer.key} className="flex items-center justify-between group/item">
                                    <label
                                        htmlFor={`toggle-${layer.key}`}
                                        className="flex items-center gap-3 cursor-pointer flex-1"
                                    >
                                        <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/10' : 'bg-transparent group-hover/item:bg-white/5'}`}>
                                            <Icon
                                                className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500'
                                                    }`}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm transition-colors ${isActive ? 'text-white font-medium' : 'text-slate-400 group-hover/item:text-slate-300'
                                                }`}
                                        >
                                            {layer.label}
                                        </span>
                                    </label>

                                    {/* Toggle Switch */}
                                    <button
                                        id={`toggle-${layer.key}`}
                                        type="button"
                                        role="switch"
                                        aria-checked={isActive}
                                        onClick={() => onLayerToggle(layer.key)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${isActive
                                            ? `bg-linear-to-r ${layer.color} shadow-lg ${layer.shadowColor}`
                                            : 'bg-slate-700/50 border border-white/5'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Refresh Button */}
                        <div className="pt-3 border-t border-white/5">
                            <button
                                onClick={onRefresh}
                                disabled={isRefreshing}
                                className="glass-button w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'
                                        } transition-transform duration-500`}
                                />
                                <span className="text-sm text-slate-200 font-medium group-hover:text-white">
                                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                                </span>
                            </button>
                        </div>

                        {/* Last Updated */}
                        {lastUpdated && (
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 text-center font-medium">
                                Updated {formatRelativeTime(lastUpdated)}
                            </div>
                        )}
                    </div>
                )}

                {/* Collapsed State - Show active layers count */}
                {!expanded && (
                    <div className="px-4 pb-3 flex justify-center">
                        <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-slate-400">
                            {Object.values(layerState).filter(Boolean).length} active
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
