'use client'
import React, { useState } from 'react';
import { CommonStyles } from '@/app/_types/news_types';
import type { SearchFilters } from '@/app/_types/news_types';

// ============================================
// API FUNCTIONS (Placeholder)
// ============================================

const handleSearch = (filters: SearchFilters) => {
    console.log('Search API called with filters:', filters);
    // TODO: Implement actual API call
};

export default function HeroSection() {
    const [filters, setFilters] = useState<SearchFilters>({
        region: '',
        type: '',
        time: '',
    });

    const onSearchClick = () => {
        handleSearch(filters);
    };

    return (
        <section
            className={`relative w-full h-[650px] md:h-[800px] bg-cover bg-center ${CommonStyles.FlexCenter}`}
            style={{
                backgroundImage: "url('/images/news/hero.avif')",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className={`relative z-10 text-center ${CommonStyles.ContainerSmall}`}>
                <h1 className={`text-4xl md:text-6xl font-bold ${CommonStyles.TextWhite} mb-4 drop-shadow-lg`}>
                    Real-Time Disaster Alerts<br />& Verified News
                </h1>
                <p className={`${CommonStyles.BodyText} text-white/90 mb-8`}>
                    Stay informed with live alerts & official updates
                </p>

                {/* Search Bar */}
                <div className={`${CommonStyles.FlexResponsive} gap-2 ${CommonStyles.BgWhite} ${CommonStyles.RoundedLarge} p-2 ${CommonStyles.ShadowXL} max-w-3xl mx-auto`}>
                    <select
                        className={`${CommonStyles.Select} flex-1 border-gray-300 focus:ring-red-500 ${CommonStyles.Rounded}`}
                        value={filters.region}
                        onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                    >
                        <option value="">Region</option>
                        <option value="north">North</option>
                        <option value="south">South</option>
                        <option value="east">East</option>
                        <option value="west">West</option>
                    </select>

                    <select
                        className={`${CommonStyles.Select} flex-1 border-gray-300 focus:ring-red-500 ${CommonStyles.Rounded}`}
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">Type</option>
                        <option value="earthquake">Earthquake</option>
                        <option value="flood">Flood</option>
                        <option value="fire">Fire</option>
                        <option value="hurricane">Hurricane</option>
                    </select>

                    <select
                        className={`${CommonStyles.Select} flex-1 border-gray-300 focus:ring-red-500 ${CommonStyles.Rounded}`}
                        value={filters.time}
                        onChange={(e) => setFilters({ ...filters, time: e.target.value })}
                    >
                        <option value="">Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>

                    <button
                        className={`bg-red-600 ${CommonStyles.TextWhite} ${CommonStyles.ButtonPrimary} font-semibold hover:bg-red-700 ${CommonStyles.FlexCenter} gap-2`}
                        onClick={onSearchClick}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        Search
                    </button>
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 w-full h-[15%] bg-linear-to-t from-black/60 to-transparent" />
        </section>
    );
}
