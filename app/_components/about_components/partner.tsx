'use client';

import React from 'react';
import Image from 'next/image';
import { AboutStyles } from '@/app/_types/about_types';

export default function Partner() {
    // Partner logos - user should rename their files to match these paths
    const partners = [
        { id: 1, name: 'Partner 1', logo: '/images/logos/partner1.png' },
        { id: 2, name: 'Partner 2', logo: '/images/logos/partner2.png' },
        { id: 3, name: 'Partner 3', logo: '/images/logos/partner3.png' },
        { id: 4, name: 'Partner 4', logo: '/images/logos/partner4.png' },
        { id: 5, name: 'NDMA', logo: '/images/logos/ndma.png' },
        { id: 6, name: 'PDMA', logo: '/images/logos/pdma.jpg' },
        { id: 7, name: 'Pakistan', logo: '/images/logos/pakistan.png' },
        { id: 8, name: 'Sindh', logo: '/images/logos/sindh.png' },
    ];

    // Duplicate for seamless loop
    const extendedPartners = [...partners, ...partners, ...partners];

    return (
        <section className={`${AboutStyles.Section} bg-slate-900 text-white overflow-hidden`}>
            <div className={AboutStyles.Container}>
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Our Partners
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                        Working together with leading organizations to build disaster resilience
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden mask-image-gradient">
                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                        {/* First Set */}
                        <div className="flex items-center gap-12 md:gap-16 px-6 md:px-8">
                            {extendedPartners.map((partner, index) => (
                                <div
                                    key={`original-${index}`}
                                    className="relative flex items-center justify-center h-24 w-24 md:h-32 md:w-32 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 flex-shrink-0"
                                >
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain p-4"
                                        sizes="(max-width: 768px) 96px, 128px"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Second Set (Duplicate for seamless loop) */}
                        <div className="flex items-center gap-12 md:gap-16 px-6 md:px-8">
                            {extendedPartners.map((partner, index) => (
                                <div
                                    key={`duplicate-${index}`}
                                    className="relative flex items-center justify-center h-24 w-24 md:h-32 md:w-32 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 flex-shrink-0"
                                >
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain p-4"
                                        sizes="(max-width: 768px) 96px, 128px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
