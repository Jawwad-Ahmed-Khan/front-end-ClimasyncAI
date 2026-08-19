'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Target, Eye } from 'lucide-react';
import { AboutStyles } from '@/app/_types/about_types';

export default function MissionVision() {
    const cards = [
        {
            id: 1,
            title: 'Our Mission',
            icon: Target,
            description: 'To eliminate delays, minimize false alarms, and unify coordination using AI-driven verification.',
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            image: '/images/about/mission_bg.png'
        },
        {
            id: 2,
            title: 'Our Vision',
            icon: Eye,
            description: 'Sustainable, automated disaster resilience for Pakistan and the global community.',
            color: 'emerald',
            gradient: 'from-emerald-500 to-emerald-600',
            image: '/images/about/vision_bg.png'
        }
    ];

    return (
        <section className={`${AboutStyles.Section} ${AboutStyles.SectionOffWhite}`}>
            <div className={AboutStyles.Container}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                // Removed AboutStyles.Card to avoid bg-white conflict, manually added other styles
                                className={`border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 ${AboutStyles.CardHover} group relative overflow-hidden`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Overlay for readability - Reduced opacity */}
                                    <div className="absolute inset-0 bg-white/60 group-hover:bg-white/50 transition-colors duration-300 backdrop-blur-[2px]" />
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    {/* Icon Container */}
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className={`${AboutStyles.Heading3} mb-4 relative`}>
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`${AboutStyles.Body} font-medium relative`}>
                                        {card.description}
                                    </p>

                                    {/* Bottom Border Animation */}
                                    <div className={`mt-6 h-1 bg-gradient-to-r ${card.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
