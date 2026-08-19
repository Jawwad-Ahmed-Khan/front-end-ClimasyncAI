"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    ClipboardList,
    Clock,
    CheckCircle,
    Percent,
} from "lucide-react";

// ============================================
// STAT CARD COMPONENT
// ============================================
// Glassmorphism stat card with animated number
// Used in: Home tab stat cards grid

interface StatCardProps {
    label: string;
    value: number;
    suffix?: string;
    trend?: number;
    icon: "tasks" | "pending" | "completed" | "rate";
    delay?: number;
}

const iconMap = {
    tasks: ClipboardList,
    pending: Clock,
    completed: CheckCircle,
    rate: Percent,
};

const colorMap = {
    tasks: { bg: "from-cyan-500/20 to-blue-500/20", icon: "text-cyan-400", border: "border-cyan-500/30" },
    pending: { bg: "from-amber-500/20 to-orange-500/20", icon: "text-amber-400", border: "border-amber-500/30" },
    completed: { bg: "from-emerald-500/20 to-teal-500/20", icon: "text-emerald-400", border: "border-emerald-500/30" },
    rate: { bg: "from-violet-500/20 to-purple-500/20", icon: "text-violet-400", border: "border-violet-500/30" },
};

export default function StatCard({ label, value, suffix = "", trend, icon, delay = 0 }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const Icon = iconMap[icon];
    const colors = colorMap[icon];

    // Animate number on mount
    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepValue;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`
        relative p-5 rounded-2xl overflow-hidden
        bg-linear-to-br ${colors.bg}
        border ${colors.border}
        backdrop-blur-xl
        shadow-lg shadow-black/5
      `}
        >
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-white/10 to-transparent rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative flex items-start justify-between">
                {/* Left - Value & Label */}
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {displayValue}
                        </span>
                        {suffix && (
                            <span className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                                {suffix}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {label}
                    </p>

                    {/* Trend Indicator */}
                    {trend !== undefined && (
                        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-emerald-500" : "text-red-500"
                            }`}>
                            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{Math.abs(trend)}% vs last month</span>
                        </div>
                    )}
                </div>

                {/* Right - Icon */}
                <div className={`p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 ${colors.icon}`}>
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    );
}
