'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AboutStyles } from '@/app/_types/about_types';
import { Zap, Target, Users, Globe } from 'lucide-react';

export default function Impact() {
    const impactCards = [
        {
            id: 1,
            title: '70% Faster Verification',
            description: 'Real-time AI verification reduces disaster report processing time from hours to minutes',
            icon: Zap,
            borderColor: 'border-t-rose-500',
            bgGradient: 'from-rose-50 to-white',
            iconColor: 'text-rose-500',
            iconBg: 'bg-rose-100'
        },
        {
            id: 2,
            title: '80% Fewer False Alarms',
            description: 'Multi-source verification eliminates misinformation and reduces panic',
            icon: Target,
            borderColor: 'border-t-amber-500',
            bgGradient: 'from-amber-50 to-white',
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-100'
        },
        {
            id: 3,
            title: 'Optimized NGO Workflows',
            description: 'Intelligent task allocation prevents resource duplication and maximizes relief efforts',
            icon: Users,
            borderColor: 'border-t-blue-500',
            bgGradient: 'from-blue-50 to-white',
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-100'
        },
        {
            id: 4,
            title: 'Globally Scalable Model',
            description: 'Built on open standards to extend beyond Pakistan to disaster-prone regions worldwide',
            icon: Globe,
            borderColor: 'border-t-emerald-500',
            bgGradient: 'from-emerald-50 to-white',
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-100'
        }
    ];

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
                        Our Impact
                    </h2>
                    <p className={`${AboutStyles.Body} max-w-2xl mx-auto`}>
                        Measurable improvements in disaster response effectiveness
                    </p>
                </motion.div>

                {/* Impact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {impactCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`relative bg-gradient-to-b ${card.bgGradient} border border-slate-200 ${card.borderColor} border-t-4 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group`}
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                                </div>

                                {/* Title */}
                                <h3 className={`text-xl font-bold text-slate-900 mb-3`}>
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className={`${AboutStyles.BodySmall} leading-relaxed`}>
                                    {card.description}
                                </p>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-slate-300 rounded-2xl transition-colors duration-300 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
