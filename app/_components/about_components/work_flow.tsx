'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AboutStyles } from '@/app/_types/about_types';
import { ShieldCheck, Activity, FileText, Network, ClipboardList, Megaphone, ArrowRight } from 'lucide-react';

export default function WorkFlow() {
    const steps = [
        {
            id: 1,
            name: 'Verification Agent',
            icon: ShieldCheck,
            description: 'Cross-checks sensor, API, and human data with trusted models'
        },
        {
            id: 2,
            name: 'Risk Analysis',
            icon: Activity,
            description: 'Scores hazards using local data and predictive models'
        },
        {
            id: 3,
            name: 'Protocol Definer',
            icon: FileText,
            description: 'Generates clear safety steps when danger rises'
        },
        {
            id: 4,
            name: 'Distribution Engine',
            icon: Network,
            description: 'Optimizes resource allocation across affected regions'
        },
        {
            id: 5,
            name: 'Task Allocation',
            icon: ClipboardList,
            description: 'Assigns responsibilities based on area needs and capacity'
        },
        {
            id: 6,
            name: 'Public Alert System',
            icon: Megaphone,
            description: 'Broadcasts verified alerts through multiple channels'
        }
    ];

    return (
        <section className={`${AboutStyles.Section} ${AboutStyles.SectionOffWhite}`}>
            <div className={AboutStyles.Container}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={`${AboutStyles.Heading2} mb-4`}>
                        How It Works
                    </h2>
                    <p className={`${AboutStyles.Body} max-w-2xl mx-auto`}>
                        Our AI-powered pipeline transforms raw disaster data into coordinated action
                    </p>
                </motion.div>

                {/* Workflow Steps */}
                <div className="relative">
                    {/* Desktop: Horizontal Flow */}
                    <div className="hidden lg:block">
                        <div className="grid grid-cols-6 gap-4 relative">
                            {/* Connection Line */}
                            <div className="absolute top-16 left-0 right-0 h-0.5 bg-slate-200 -z-0">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-rose-500 origin-left"
                                />
                            </div>

                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15, duration: 0.5 }}
                                        className="relative z-10"
                                    >
                                        {/* Step Number Circle */}
                                        <div className="flex justify-center mb-4">
                                            <div className="w-14 h-14 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-blue-600 font-bold text-lg">{step.id}</span>
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex justify-center mb-3">
                                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-2 text-center">
                                                {step.name}
                                            </h3>
                                            <p className="text-xs text-slate-600 text-center leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile/Tablet: Vertical Flow */}
                    <div className="lg:hidden space-y-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="relative"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Step Number */}
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold">{step.id}</span>
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-5 hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                        {step.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow Connector (except last item) */}
                                    {index < steps.length - 1 && (
                                        <div className="flex justify-center my-3">
                                            <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
