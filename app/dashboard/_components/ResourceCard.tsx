"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Ambulance,
    Ship,
    Truck,
    Car,
    Construction,
    Stethoscope,
    HeartPulse,
    Waves,
    Users,
    Package,
    Home,
    Edit3,
    Check,
    X,
} from "lucide-react";

// ============================================
// RESOURCE CARD COMPONENT
// ============================================
// Displays a resource category with quantity and edit capability
// Used in: Resources tab

interface ResourceCardProps {
    icon: "ambulances" | "rescueBoats" | "trucks" | "fourWheelVehicles" | "cranes" | "doctors" | "paramedics" | "rescueDivers" | "volunteersAvailable" | "foodPacketsCapacity" | "shelterCapacity";
    label: string;
    value: number;
    category: "vehicles" | "personnel" | "capacity";
    onUpdate?: (newValue: number) => void;
}

const iconMap = {
    ambulances: Ambulance,
    rescueBoats: Ship,
    trucks: Truck,
    fourWheelVehicles: Car,
    cranes: Construction,
    doctors: Stethoscope,
    paramedics: HeartPulse,
    rescueDivers: Waves,
    volunteersAvailable: Users,
    foodPacketsCapacity: Package,
    shelterCapacity: Home,
};

const categoryColors = {
    vehicles: { bg: "from-blue-500/20 to-cyan-500/20", icon: "text-blue-400", border: "border-blue-500/30" },
    personnel: { bg: "from-emerald-500/20 to-teal-500/20", icon: "text-emerald-400", border: "border-emerald-500/30" },
    capacity: { bg: "from-amber-500/20 to-orange-500/20", icon: "text-amber-400", border: "border-amber-500/30" },
};

export default function ResourceCard({ icon, label, value, category, onUpdate }: ResourceCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState((value ?? 0).toString());
    const Icon = iconMap[icon];
    const colors = categoryColors[category];

    const handleSave = () => {
        const newValue = parseInt(editValue, 10);
        if (!isNaN(newValue) && newValue >= 0) {
            onUpdate?.(newValue);
        } else {
            setEditValue((value ?? 0).toString());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue((value ?? 0).toString());
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className={`
                relative p-4 rounded-xl
                bg-linear-to-br ${colors.bg}
                border ${colors.border}
                backdrop-blur-xl
            `}
        >
            {/* Icon & Label row */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 shrink-0 ${colors.icon}`}>
                    <Icon size={20} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">
                    {label}
                </p>
            </div>

            {/* Value & Edit row */}
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                        className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        autoFocus
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSave}
                        className="p-1.5 rounded-lg bg-emerald-500 text-white shrink-0"
                    >
                        <Check size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancel}
                        className="p-1.5 rounded-lg bg-slate-500 text-white shrink-0"
                    >
                        <X size={16} />
                    </motion.button>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {value ?? 0}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                        <Edit3 size={16} />
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}
