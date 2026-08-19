"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Activity, CheckCircle } from "lucide-react";
import { DisasterEvent, Alert } from "../_lib/adminTypes";

// ============================================
// LIVE MAP COMPONENT
// ============================================
// Interactive map placeholder showing Pakistan with disaster markers
// Shows severity colors and real-time indicators

interface LiveMapProps {
    disasters?: DisasterEvent[];
    alerts?: Alert[];
    className?: string;
}

interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    type: 'new' | 'active' | 'monitoring' | 'resolved';
    title: string;
    severity?: number;
}

export default function LiveMap({ disasters = [], alerts = [], className = "" }: LiveMapProps) {
    const [markers, setMarkers] = useState<MapMarker[]>([]);

    useEffect(() => {
        // Combine alerts and disasters into markers
        const alertMarkers: MapMarker[] = alerts.map(a => ({
            id: a.id,
            lat: a.location.lat,
            lng: a.location.lng,
            type: a.status === 'NEW' ? 'new' : a.status === 'ACTIVE' ? 'active' : 'monitoring',
            title: a.title,
            severity: a.severity,
        }));

        const disasterMarkers: MapMarker[] = disasters.map(d => ({
            id: d.id,
            lat: d.location.lat,
            lng: d.location.lng,
            type: d.status === 'RESOLVED' ? 'resolved' : d.status === 'ACTIVE' ? 'active' : 'monitoring',
            title: d.title,
            severity: d.severityScore,
        }));

        setMarkers([...alertMarkers, ...disasterMarkers]);
    }, [alerts, disasters]);

    // Convert lat/lng to position percentage for the map
    const getPosition = (lat: number, lng: number) => {
        // Pakistan bounds approximately: 24-37 lat, 61-78 lng
        const latMin = 23, latMax = 38;
        const lngMin = 60, lngMax = 79;

        const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
        const y = ((latMax - lat) / (latMax - latMin)) * 100;

        return { x: Math.min(Math.max(x, 5), 95), y: Math.min(Math.max(y, 5), 95) };
    };

    const markerColors = {
        new: 'bg-red-500 shadow-red-500/50',
        active: 'bg-emerald-500 shadow-emerald-500/50',
        monitoring: 'bg-amber-500 shadow-amber-500/50',
        resolved: 'bg-slate-500 shadow-slate-500/50',
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-slate-800/50 
                        bg-slate-900/50 backdrop-blur-sm ${className}`}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between
                           bg-linear-to-b from-slate-900 to-transparent">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    Live Incidents Map
                </h3>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-400">Real-time</span>
                </div>
            </div>

            {/* Map Visualization */}
            <div className="relative aspect-16/10 min-h-[300px]">
                {/* Pakistan Shape Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
                        <path
                            d="M30,20 L35,15 L50,18 L65,15 L75,25 L80,35 L75,50 L70,60 L60,70 L50,75 L40,80 L30,75 L25,65 L20,50 L25,35 Z"
                            fill="currentColor"
                            className="text-slate-500"
                        />
                    </svg>
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `
                             linear-gradient(to right, #fff 1px, transparent 1px),
                             linear-gradient(to bottom, #fff 1px, transparent 1px)
                         `,
                        backgroundSize: '20% 20%',
                    }}
                />

                {/* Markers */}
                {markers.map((marker, index) => {
                    const pos = getPosition(marker.lat, marker.lng);
                    return (
                        <motion.div
                            key={marker.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute group"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                            {/* Marker */}
                            <div className={`
                                relative w-4 h-4 rounded-full cursor-pointer
                                ${markerColors[marker.type]}
                                shadow-lg transform -translate-x-1/2 -translate-y-1/2
                            `}>
                                {/* Pulse for new alerts */}
                                {marker.type === 'new' && (
                                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                                )}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                           opacity-0 group-hover:opacity-100 transition-opacity
                                           pointer-events-none z-20">
                                <div className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700
                                               text-xs text-white whitespace-nowrap shadow-xl">
                                    <p className="font-medium">{marker.title}</p>
                                    {marker.severity && (
                                        <p className="text-slate-400 mt-0.5">
                                            Severity: {marker.severity}/10
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Empty State */}
                {markers.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Activity className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No active incidents</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 p-4
                           bg-linear-to-t from-slate-900 to-transparent">
                <div className="flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-slate-400">New Alert</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-400">Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-slate-400">Monitoring</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                        <span className="text-slate-400">Resolved</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
