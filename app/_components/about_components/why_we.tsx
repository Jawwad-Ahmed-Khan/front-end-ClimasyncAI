'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AboutStyles } from '@/app/_types/about_types';
import { AlertTriangle, DollarSign, Users } from 'lucide-react';

export default function WhyWe() {
    const statistics = [
        {
            id: 1,
            number: '224',
            suffix: '+',
            description: 'Major Disasters',
            subtext: '1950–2024',
            icon: AlertTriangle,
            color: 'blue'
        },
        {
            id: 2,
            number: '$36B',
            suffix: '+',
            description: 'Economic Losses Incurred',
            subtext: 'Total damages',
            icon: DollarSign,
            color: 'rose'
        },
        {
            id: 3,
            number: '2.5M',
            suffix: '+',
            description: 'People Displaced',
            subtext: '2022-2025 Analysis',
            icon: Users,
            color: 'emerald'
        }
    ];

    const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            iconBg: 'bg-blue-100'
        },
        rose: {
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            iconBg: 'bg-rose-100'
        },
        emerald: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            iconBg: 'bg-emerald-100'
        }
    };

    return (
        <section className={`${AboutStyles.Section} ${AboutStyles.SectionLight}`}>
            <div className={AboutStyles.Container}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className={`${AboutStyles.Heading2} mb-4`}>
                        Why We Exist
                    </h2>
                    <p className={`${AboutStyles.Body} max-w-2xl mx-auto`}>
                        The data speaks for itself. These numbers represent lives, communities, and futures that need protection.
                    </p>
                </motion.div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statistics.map((stat, index) => {
                        const Icon = stat.icon;
                        const colors = colorClasses[stat.color];

                        return (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                className={`${AboutStyles.Card} ${AboutStyles.CardHover} text-center`}
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.iconBg} mb-6`}>
                                    <Icon className={`w-8 h-8 ${colors.text}`} />
                                </div>

                                {/* Number */}
                                <div className="mb-3">
                                    <span className={`text-5xl md:text-6xl font-bold ${colors.text}`}>
                                        {stat.number}
                                    </span>
                                    <span className={`text-4xl md:text-5xl font-bold ${colors.text}`}>
                                        {stat.suffix}
                                    </span>
                                </div>

                                {/* Description */}
                                <h3 className={`${AboutStyles.Heading4} mb-2`}>
                                    {stat.description}
                                </h3>

                                {/* Subtext */}
                                <p className={`${AboutStyles.BodySmall} ${colors.text}`}>
                                    {stat.subtext}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
