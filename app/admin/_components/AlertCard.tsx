"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    CloudRain,
    Mountain,
    Wind,
    Thermometer,
    Droplets,
    ExternalLink,
    MapPin,
    Clock,
    ChevronRight,
    Loader2,
    ShieldAlert
} from "lucide-react";
import { Alert, DisasterType, AlertStatus } from "../_lib/adminTypes";
import { formatTimeAgo, getStatusColor } from "../_lib/adminUtils";

// ============================================
// ALERT CARD COMPONENT
// ============================================

interface AlertCardProps {
    alert: Alert;
    onVerify?: (alert: Alert) => void;
    onViewAnalysis?: (alert: Alert) => void;
    hasReport?: boolean;
    index?: number;
    isAnalyzing?: boolean;
}

const disasterIcons: Record<DisasterType, React.ReactNode> = {
    FLOOD: <CloudRain className="w-4 h-4" />,
    EARTHQUAKE: <Mountain className="w-4 h-4" />,
    CYCLONE: <Wind className="w-4 h-4" />,
    HEATWAVE: <Thermometer className="w-4 h-4" />,
    DROUGHT: <Droplets className="w-4 h-4" />,
};

const statusClassMap: Record<string, string> = {
    NEW: 'text-red-400 border-red-500/30',
    VERIFIED: 'text-amber-400 border-amber-500/30',
    ANALYZING: 'text-orange-400 border-orange-500/30',
    ACTIVE: 'text-emerald-400 border-emerald-500/30',
    MONITORING: 'text-blue-400 border-blue-500/30',
    RESOLVED: 'text-slate-400 border-slate-500/30',
    FALSE_ALARM: 'text-slate-500 border-slate-600/30'
};

export default function AlertCard({ alert, onVerify, onViewAnalysis, hasReport = false, index = 0, isAnalyzing = false }: AlertCardProps) {
    const [localAnalyzing, setLocalAnalyzing] = useState(false);

    const isNew = alert.status === 'NEW';
    const statusClass = statusClassMap[alert.status] || statusClassMap.NEW;
    
    const currentlyAnalyzing = isAnalyzing || localAnalyzing;

    const handleVerifyClick = async () => {
        if (!onVerify || currentlyAnalyzing) return;
        setLocalAnalyzing(true);
        try {
            await onVerify(alert);
        } finally {
            setLocalAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
                relative p-4 rounded-xl border transition-all duration-300
                bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 flex flex-col
                ${isNew
                    ? 'border-red-500/30 shadow-lg shadow-red-500/5'
                    : 'border-slate-800/50 hover:border-slate-700/50'
                }
            `}
        >
            {/* New Alert Pulse */}
            {isNew && !currentlyAnalyzing && !hasReport && (
                <div className="absolute top-3 right-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className={`p-2.5 rounded-xl bg-slate-800/50 text-blue-400`}>
                    {disasterIcons[alert.type] || <AlertTriangle className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                        {alert.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{alert.locationName}</span>
                    </div>
                </div>
            </div>

            {/* Info Row */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide`}>
                    {alert.source ? alert.source.replace('_', ' ') : 'UNKNOWN'}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded border ${statusClass}`}>
                    {alert.status.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-800/50 rounded">
                    {alert.confidence}% confidence
                </span>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-slate-800/50 flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(alert.detectedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isNew && !hasReport ? (
                            <button
                                onClick={handleVerifyClick}
                                disabled={currentlyAnalyzing}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                          text-xs font-medium transition-all duration-200 group
                                          ${currentlyAnalyzing 
                                            ? 'bg-orange-500/20 text-orange-400 cursor-not-allowed border border-orange-500/30' 
                                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}`}
                            >
                                {currentlyAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                <span>{currentlyAnalyzing ? 'Analyzing Risk...' : 'Risk Analysis'}</span>
                            </button>
                        ) : hasReport ? (
                            <button
                                onClick={() => onViewAnalysis?.(alert)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                          text-xs font-medium bg-slate-800 text-emerald-400 hover:bg-slate-700
                                          border border-emerald-500/30 transition-all duration-200"
                            >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>View Report</span>
                            </button>
                        ) : (
                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                          text-xs font-medium bg-slate-800 hover:bg-slate-700
                                          text-slate-300 hover:text-white transition-all duration-200"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>View Details</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
