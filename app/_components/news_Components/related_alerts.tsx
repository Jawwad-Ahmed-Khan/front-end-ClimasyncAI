'use client'
import React from 'react';
import { CommonStyles } from '@/app/_types/news_types';

// ============================================
// API FUNCTIONS (Placeholder)
// ============================================

const handleSocialLinkClick = (platform: string, url: string) => {
    console.log(`Navigate to ${platform} feed:`, url);
    // TODO: Navigate to social media platform feed page
    window.open(url, '_blank');
};

// ============================================
// SOCIAL MEDIA ICONS (SVG)
// ============================================

const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// ============================================
// COMPONENT
// ============================================

const SOCIAL_PLATFORMS = [
    {
        id: 'twitter',
        name: 'Twitter / X',
        description: 'Follow real-time disaster updates and verified news alerts',
        url: 'https://twitter.com',
        icon: TwitterIcon,
        bgColor: 'bg-black',
        hoverColor: 'hover:bg-gray-900',
        textColor: 'text-white',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        description: 'View visual updates and disaster response stories',
        url: 'https://instagram.com',
        icon: InstagramIcon,
        bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
        hoverColor: 'hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
        textColor: 'text-white',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        description: 'Join our community for disaster preparedness tips',
        url: 'https://facebook.com',
        icon: FacebookIcon,
        bgColor: 'bg-blue-600',
        hoverColor: 'hover:bg-blue-700',
        textColor: 'text-white',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        description: 'Connect with disaster management professionals',
        url: 'https://linkedin.com',
        icon: LinkedInIcon,
        bgColor: 'bg-blue-700',
        hoverColor: 'hover:bg-blue-800',
        textColor: 'text-white',
    },
];

export default function RelatedAlerts() {
    return (
        <section className={`w-full bg-white ${CommonStyles.PaddingSectionSmall}`}>
            <div className={CommonStyles.Container}>
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-1 bg-blue-600 rounded"></div>
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">
                            Connect With Us
                        </span>
                        <div className="w-12 h-1 bg-blue-600 rounded"></div>
                    </div>
                    <h2 className={`${CommonStyles.Heading2} text-gray-900 mb-4`}>
                        Follow Us on Social Media
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Stay connected for the latest verified news, disaster alerts, and emergency updates
                    </p>
                </div>

                {/* Social Platforms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SOCIAL_PLATFORMS.map((platform) => {
                        const IconComponent = platform.icon;

                        return (
                            <div
                                key={platform.id}
                                className="group cursor-pointer"
                                onClick={() => handleSocialLinkClick(platform.name, platform.url)}
                            >
                                {/* Card */}
                                <div className="bg-gray-50 rounded-xl p-6 h-full border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                                    {/* Icon Container */}
                                    <div className="mb-4">
                                        <div className={`w-16 h-16 ${platform.bgColor} ${platform.hoverColor} rounded-xl ${CommonStyles.FlexCenter} ${platform.textColor} transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110`}>
                                            <IconComponent />
                                        </div>
                                    </div>

                                    {/* Platform Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {platform.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {platform.description}
                                    </p>

                                    {/* Follow Link */}
                                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                        <span>Follow Now</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Info */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-6 px-8 py-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">Real-time Updates</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 font-medium">Verified Content</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-gray-700 font-medium">Community Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
