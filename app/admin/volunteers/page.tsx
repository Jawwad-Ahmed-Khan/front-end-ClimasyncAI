"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Search,
    RefreshCw,
    Star,
    MapPin,
    Car,
    Bike,
    HeartPulse,
    Home,
    Utensils,
    MessageSquare,
    Eye,
    ClipboardList,
} from "lucide-react";
import { generateMockVolunteers } from "../_lib/adminMockData";
import type { Volunteer, VolunteerCapability } from "../_lib/adminTypes";

// ============================================
// VOLUNTEERS PAGE
// ============================================

const capabilityIcons: Record<VolunteerCapability, { icon: React.ElementType; label: string; color: string }> = {
    HAS_CAR: { icon: Car, label: 'Car', color: 'text-blue-400' },
    HAS_MOTORCYCLE: { icon: Bike, label: 'Bike', color: 'text-purple-400' },
    FIRST_AID: { icon: HeartPulse, label: 'First Aid', color: 'text-red-400' },
    OFFERS_SHELTER: { icon: Home, label: 'Shelter', color: 'text-amber-400' },
    OFFERS_FOOD: { icon: Utensils, label: 'Food', color: 'text-emerald-400' },
};

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setVolunteers(generateMockVolunteers(20));
        setIsLoading(false);
    }, []);

    const filtered = searchQuery
        ? volunteers.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.city.toLowerCase().includes(searchQuery.toLowerCase()))
        : volunteers;

    const activeCount = volunteers.filter(v => v.isActive).length;
    const totalTasks = volunteers.reduce((a, b) => a + b.tasksCompleted, 0);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Volunteers</h1>
                <p className="text-slate-400 text-sm mt-1">Community volunteers and their capabilities</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-2xl font-bold text-blue-400">{volunteers.length}</p>
                    <p className="text-xs text-slate-400">Total Registered</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
                    <p className="text-xs text-slate-400">Currently Active</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-2xl font-bold text-purple-400">{totalTasks}</p>
                    <p className="text-xs text-slate-400">Tasks Completed</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-2xl font-bold text-amber-400">
                        {(volunteers.reduce((a, b) => a + b.rating, 0) / volunteers.length).toFixed(1)}★
                    </p>
                    <p className="text-xs text-slate-400">Avg Rating</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50
                              text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                />
            </div>

            {/* Volunteer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((vol, index) => (
                    <motion.div
                        key={vol.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500
                                               flex items-center justify-center text-white font-bold">
                                    {vol.name.charAt(0)}
                                </div>
                                {vol.isActive && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white truncate">{vol.name}</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {vol.city}, {vol.province}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3 h-3 text-amber-400" />
                                <span className="text-white">{vol.rating}</span>
                            </div>
                        </div>

                        {/* Capabilities */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {vol.capabilities.map(cap => {
                                const { icon: Icon, label, color } = capabilityIcons[cap];
                                return (
                                    <span key={cap} className={`flex items-center gap-1 px-2 py-0.5 rounded-lg 
                                                              bg-slate-800/50 text-xs ${color}`}>
                                        <Icon className="w-3 h-3" />
                                        {label}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                            <span>{vol.tasksCompleted} tasks</span>
                            {vol.tasksCurrent && (
                                <span className="text-emerald-400">● Active task</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t border-slate-800/50">
                            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg
                                              bg-slate-800/50 text-slate-300 hover:bg-slate-800 text-xs">
                                <Eye className="w-3 h-3" /> View
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg
                                              bg-slate-800/50 text-slate-300 hover:bg-slate-800 text-xs">
                                <MessageSquare className="w-3 h-3" /> Message
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
