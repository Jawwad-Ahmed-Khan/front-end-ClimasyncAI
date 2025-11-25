'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AboutStyles } from '@/app/_types/about_types';
import { User } from 'lucide-react';

export default function TeamPartner() {
    const teamMembers = [
        {
            id: 1,
            name: 'Omer',
            role: 'Team Lead',
            bio: 'Leading the vision and strategy for ClimaSync.AI',
            imageUrl: '' // Placeholder - will show default avatar
        },
        {
            id: 2,
            name: 'Moe',
            role: 'AI Architect',
            bio: 'Designing intelligent verification and analysis systems',
            imageUrl: ''
        },
        {
            id: 3,
            name: 'Sherry',
            role: 'Backend Lead',
            bio: 'Building robust and scalable infrastructure',
            imageUrl: ''
        },
        {
            id: 4,
            name: 'David',
            role: 'Data Scientist',
            bio: 'Developing predictive models and analytics',
            imageUrl: ''
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
                    className="text-center mb-12"
                >
                    <h2 className={`${AboutStyles.Heading2} mb-4`}>
                        Meet Our Team
                    </h2>
                    <p className={`${AboutStyles.Body} max-w-2xl mx-auto`}>
                        Dedicated professionals working to save lives through technology
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`${AboutStyles.Card} ${AboutStyles.CardHover} text-center group`}
                        >
                            {/* Avatar - Placeholder with Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    {member.imageUrl ? (
                                        <img
                                            src={member.imageUrl}
                                            alt={member.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-blue-600" />
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className={`${AboutStyles.Heading4} mb-2`}>
                                {member.name}
                            </h3>

                            {/* Role */}
                            <p className="text-blue-600 font-semibold mb-3">
                                {member.role}
                            </p>

                            {/* Bio */}
                            <p className={`${AboutStyles.BodySmall} leading-relaxed`}>
                                {member.bio}
                            </p>

                            {/* Bottom Border Animation */}
                            <div className="mt-6 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
