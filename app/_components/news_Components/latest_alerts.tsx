'use client'
import React from 'react';
import Image from 'next/image';
import { CommonStyles } from '@/app/_types/news_types';
import type { AlertCard } from '@/app/_types/news_types';

// ============================================
// API FUNCTIONS (Placeholder)
// ============================================

const fetchLatestAlerts = async (): Promise<AlertCard[]> => {
    console.log('Fetch Latest Alerts API called');
    // TODO: Implement actual API call
    return DUMMY_ALERTS;
};

const handleAlertClick = (alertId: number) => {
    console.log('Alert clicked:', alertId);
    // TODO: Navigate to alert detail page or open modal
};

const handleSeeMore = () => {
    console.log('See more alerts clicked');
    // TODO: Navigate to all alerts page
};

// ============================================
// DUMMY DATA
// ============================================

const DUMMY_ALERTS: AlertCard[] = [
    {
        id: 1,
        type: 'High temperature',
        title: 'Extreme Heatwave Alert',
        description: 'Record-breaking temperatures expected in multiple regions. Stay hydrated and avoid outdoor activities.',
        image: '/images/alerts/heatwave.jpg',
        severity: 'Real',
    },
    {
        id: 2,
        type: 'Earthquake',
        title: 'Seismic Activity Detected',
        description: 'Major earthquake warning issued for coastal areas. Buildings may be at risk.',
        image: '/images/alerts/earthquake.jpg',
        severity: 'Real',
    },
    {
        id: 3,
        type: 'Drought',
        title: 'Water Scarcity Crisis',
        description: 'Severe drought conditions affecting agricultural regions. Conservation measures in effect.',
        image: '/images/alerts/drought.jpg',
        severity: 'Pass-Fake',
    },
    {
        id: 4,
        type: 'Hurricane',
        title: 'Hurricane Approaching',
        description: 'Category 3 hurricane with destructive winds heading towards the coastline.',
        image: '/images/alerts/hurricane.jpg',
        severity: 'Fake',
    },
    {
        id: 5,
        type: 'Forest fire',
        title: 'Wildfire Outbreak',
        description: 'Rapid spread of forest fires in mountainous regions. Evacuations underway.',
        image: '/images/alerts/forest-fire.jpg',
        severity: 'Real',
    },
    {
        id: 6,
        type: 'Melting Glacier',
        title: 'Glacier Melt Accelerating',
        description: 'Climate change impacts causing unprecedented glacier retreat in polar regions.',
        image: '/images/alerts/glacier.jpg',
        severity: 'Real',
    },
];

// ============================================
// COMPONENT
// ============================================

export default function LatestAlerts() {
    const [alerts] = React.useState<AlertCard[]>(DUMMY_ALERTS);

    const getSeverityConfig = (severity: AlertCard['severity']) => {
        switch (severity) {
            case 'Real':
                return {
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    badgeBg: 'bg-green-500',
                    badgeText: 'text-white',
                    icon: '/images/news/real.png',
                    label: 'VERIFIED',
                };
            case 'Fake':
                return {
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700',
                    badgeBg: 'bg-red-500',
                    badgeText: 'text-white',
                    icon: '/images/news/fake.png',
                    label: 'FAKE NEWS',
                };
            case 'Pass-Fake':
                return {
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    badgeBg: 'bg-yellow-500',
                    badgeText: 'text-white',
                    icon: '/images/news/search.png',
                    label: 'UNDER REVIEW',
                };
            default:
                return {
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-700',
                    badgeBg: 'bg-gray-500',
                    badgeText: 'text-white',
                    icon: '/images/news/search.png',
                    label: 'UNKNOWN',
                };
        }
    };

    return (
        <section className={`w-full bg-gray-50 ${CommonStyles.PaddingSection}`}>
            <div className={CommonStyles.Container}>
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-1 bg-blue-600 rounded"></div>
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">
                            Latest Updates
                        </span>
                        <div className="w-12 h-1 bg-blue-600 rounded"></div>
                    </div>
                    <h2 className={`${CommonStyles.Heading2} text-gray-900 mb-4`}>
                        Latest Verified Alerts & News
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                        Stay informed with our AI-verified disaster alerts and breaking news updates
                    </p>
                    <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                        onClick={handleSeeMore}
                    >
                        View All Alerts
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>

                {/* Alerts Grid */}
                <div className={CommonStyles.Grid1to2to3}>
                    {alerts.map((alert) => {
                        const severityConfig = getSeverityConfig(alert.severity);

                        return (
                            <div
                                key={alert.id}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                                onClick={() => handleAlertClick(alert.id)}
                            >
                                {/* Image with Overlay */}
                                <div className="relative w-full h-52 overflow-hidden">
                                    <Image
                                        src={alert.image}
                                        alt={alert.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

                                    {/* Verification Badge - Top Right */}
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-12 h-12 ${severityConfig.bgColor} rounded-full p-1.5 shadow-lg border-2 ${severityConfig.borderColor}`}>
                                            <Image
                                                src={severityConfig.icon}
                                                alt={alert.severity}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Type Badge - Bottom Left */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 uppercase tracking-wide">
                                            {alert.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Severity Status Bar */}
                                    <div className={`flex items-center gap-2 mb-3 pb-3 border-b-2 ${severityConfig.borderColor}`}>
                                        <span className={`flex-1 text-center px-3 py-1.5 ${severityConfig.badgeBg} ${severityConfig.badgeText} rounded-lg font-bold text-sm uppercase tracking-wide shadow-sm`}>
                                            {severityConfig.label}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {alert.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                                        {alert.description}
                                    </p>

                                    {/* Read More Link */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-blue-600 font-semibold text-sm group-hover:gap-3 flex items-center gap-2 transition-all">
                                            Read More
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Just now
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Want to verify news yourself?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Use our AI-powered verification system to check news authenticity
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
                        <Image
                            src="/images/news/search.png"
                            alt="Verify"
                            width={24}
                            height={24}
                        />
                        Verify News Now
                    </button>
                </div>
            </div>
        </section>
    );
}
