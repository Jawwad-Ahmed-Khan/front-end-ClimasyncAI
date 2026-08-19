"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// ============================================
// STAT CARD COMPONENT
// ============================================
// Dashboard statistics card with icon, value, and trend
// Used in Command Center for key metrics

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'red' | 'orange' | 'emerald' | 'blue' | 'purple' | 'cyan' | 'amber';
    index?: number;
}

const colorClasses = {
    red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: 'text-red-400 bg-red-500/20',
        glow: 'shadow-red-500/5',
    },
    orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        icon: 'text-orange-400 bg-orange-500/20',
        glow: 'shadow-orange-500/5',
    },
    emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        icon: 'text-emerald-400 bg-emerald-500/20',
        glow: 'shadow-emerald-500/5',
    },
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: 'text-blue-400 bg-blue-500/20',
        glow: 'shadow-blue-500/5',
    },
    purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        icon: 'text-purple-400 bg-purple-500/20',
        glow: 'shadow-purple-500/5',
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        icon: 'text-cyan-400 bg-cyan-500/20',
        glow: 'shadow-cyan-500/5',
    },
    amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: 'text-amber-400 bg-amber-500/20',
        glow: 'shadow-amber-500/5',
    },
};

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color,
    index = 0,
}: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative p-5 rounded-2xl border backdrop-blur-sm
                ${colors.bg} ${colors.border}
                shadow-lg ${colors.glow}
                hover:scale-[1.02] transition-transform duration-300
            `}
        >
            {/* Top Row: Icon + Trend */}
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors.icon}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {trend && (
                    <div className={`
                        flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                        ${trend.isPositive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }
                    `}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="mb-1">
                <span className="text-3xl font-bold text-white tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
            </div>

            {/* Title & Subtitle */}
            <div>
                <h3 className="text-sm font-medium text-slate-300">{title}</h3>
                {subtitle && (
                    <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                )}
            </div>

            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full 
                           bg-linear-to-r from-transparent via-slate-700 to-transparent opacity-50" />
        </motion.div>
    );
}
