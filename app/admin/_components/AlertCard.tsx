"use client";

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
} from "lucide-react";
import { Alert, DisasterType, AlertStatus } from "../_lib/adminTypes";
import { formatTimeAgo, getStatusColor } from "../_lib/adminMockData";

// ============================================
// ALERT CARD COMPONENT
// ============================================
// Displays real-time alerts in the Command Center
// Features: Source badges, severity indicators, quick actions

interface AlertCardProps {
    alert: Alert;
    onVerify?: (id: string) => void;
    index?: number;
}

const disasterIcons: Record<DisasterType, React.ReactNode> = {
    FLOOD: <CloudRain className="w-4 h-4" />,
    EARTHQUAKE: <Mountain className="w-4 h-4" />,
    CYCLONE: <Wind className="w-4 h-4" />,
    HEATWAVE: <Thermometer className="w-4 h-4" />,
    DROUGHT: <Droplets className="w-4 h-4" />,
};

const sourceColors: Record<string, string> = {
    USGS: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    OPEN_METEO: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    GOOGLE_FLOOD_HUB: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    SOCIAL_MEDIA: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    MANUAL: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
};

const disasterColors: Record<DisasterType, string> = {
    FLOOD: 'text-blue-400',
    EARTHQUAKE: 'text-orange-400',
    CYCLONE: 'text-purple-400',
    HEATWAVE: 'text-red-400',
    DROUGHT: 'text-amber-400',
};

export default function AlertCard({ alert, onVerify, index = 0 }: AlertCardProps) {
    const isNew = alert.status === 'NEW';
    const statusClass = getStatusColor(alert.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
                relative p-4 rounded-xl border transition-all duration-300
                bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70
                ${isNew
                    ? 'border-red-500/30 shadow-lg shadow-red-500/5'
                    : 'border-slate-800/50 hover:border-slate-700/50'
                }
            `}
        >
            {/* New Alert Pulse */}
            {isNew && (
                <div className="absolute top-3 right-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                {/* Disaster Type Icon */}
                <div className={`
                    p-2.5 rounded-xl bg-slate-800/50
                    ${disasterColors[alert.type]}
                `}>
                    {disasterIcons[alert.type]}
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
                {/* Source Badge */}
                <span className={`
                    px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide
                    rounded border ${sourceColors[alert.source]}
                `}>
                    {alert.source.replace('_', ' ')}
                </span>

                {/* Status Badge */}
                <span className={`
                    px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide
                    rounded border ${statusClass}
                `}>
                    {alert.status.replace('_', ' ')}
                </span>

                {/* Confidence */}
                <span className="px-2 py-0.5 text-[10px] font-medium 
                               text-slate-400 bg-slate-800/50 rounded">
                    {alert.confidence}% confidence
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(alert.detectedAt)}</span>
                </div>

                {isNew ? (
                    <button
                        onClick={() => onVerify?.(alert.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                  text-xs font-medium
                                  bg-linear-to-r from-red-500 to-orange-500
                                  text-white hover:from-red-600 hover:to-orange-600
                                  transition-all duration-200 group"
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Verify & Analyze</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                ) : (
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                  text-xs font-medium
                                  bg-slate-800 hover:bg-slate-700
                                  text-slate-300 hover:text-white
                                  transition-all duration-200"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Details</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
