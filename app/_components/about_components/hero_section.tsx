'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AboutStyles } from '@/app/_types/about_types';

export default function HeroSection() {
    return (
        <section className={`${AboutStyles.Section} ${AboutStyles.SectionLight} relative overflow-hidden min-h-[600px] flex items-center`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/about/hero_bg.png"
                    alt="Agentic AI System Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90" />
            </div>

            <div className={`${AboutStyles.Container} relative z-10`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block mb-6"
                    >
                        <span className="px-4 py-2 bg-blue-50/80 backdrop-blur-sm text-blue-600 rounded-full text-sm font-semibold uppercase tracking-wide border border-blue-100">
                            About ClimaSync.AI
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className={`${AboutStyles.Heading1} mb-6 drop-shadow-sm`}
                    >
                        Reshaping Disaster Resilience with AI
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`${AboutStyles.BodyLarge} max-w-3xl mx-auto leading-relaxed font-medium`}
                    >
                        An automated system reducing response delays and saving lives through
                        predictive analytics and real-time verification.
                    </motion.p>

                    {/* Decorative Elements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="mt-12 flex justify-center gap-4"
                    >
                        <div className="w-16 h-1 bg-blue-600 rounded-full shadow-sm" />
                        <div className="w-16 h-1 bg-emerald-500 rounded-full shadow-sm" />
                        <div className="w-16 h-1 bg-rose-500 rounded-full shadow-sm" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
