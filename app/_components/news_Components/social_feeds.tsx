'use client'
import React from 'react';
import Image from 'next/image';
import { CommonStyles } from '@/app/_types/news_types';
import type { SocialFeed } from '@/app/_types/news_types';

// ============================================
// API FUNCTIONS (Placeholder)
// ============================================

const fetchSocialFeeds = async (): Promise<SocialFeed[]> => {
    console.log('Fetch Social Feeds API called');
    // TODO: Implement actual API call
    return DUMMY_FEEDS;
};

const handleFeedClick = (feedId: number) => {
    console.log('Social feed clicked:', feedId);
    // TODO: Open feed detail or external link
};

const handleSeeMoreFeeds = () => {
    console.log('See more social feeds clicked');
    // TODO: Navigate to all social feeds page
};

// ============================================
// DUMMY DATA
// ============================================

const DUMMY_FEEDS: SocialFeed[] = [
    {
        id: 1,
        platform: 'Facebook',
        content: 'Breaking: Emergency services respond to natural disaster. Multiple agencies coordinating relief efforts. Follow for live updates and safety information.',
        image: '/images/feeds/feed1.jpg',
        rating: 5,
        author: 'National Emergency Management',
    },
    {
        id: 2,
        platform: 'LinkedIn',
        content: 'New study reveals climate change impact on disaster frequency. Expert analysis on preparedness strategies and mitigation efforts.',
        image: '/images/feeds/feed2.jpg',
        rating: 4,
        author: 'Climate Research Institute',
    },
    {
        id: 3,
        platform: 'X',
        content: 'Real-time updates: Weather alert system activated. Citizens advised to follow official channels for verified information.',
        rating: 5,
        author: 'Weather Alert System',
    },
    {
        id: 4,
        platform: 'Instagram',
        content: 'Community resilience in action! See how volunteers are making a difference during disaster response efforts.',
        image: '/images/feeds/feed1.jpg',
        rating: 5,
        author: 'Disaster Response Team',
    },
];

// ============================================
// PLATFORM ICONS
// ============================================

const PlatformIcon = ({ platform }: { platform: string }) => {
    const getIcon = () => {
        switch (platform) {
            case 'Facebook':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'LinkedIn':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                );
            case 'X':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                );
            case 'Instagram':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getPlatformColor = () => {
        switch (platform) {
            case 'Facebook':
                return 'bg-blue-600';
            case 'LinkedIn':
                return 'bg-blue-700';
            case 'X':
                return 'bg-black';
            case 'Instagram':
                return 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500';
            default:
                return 'bg-gray-600';
        }
    };

    return (
        <div className={`w-10 h-10 ${getPlatformColor()} rounded-full ${CommonStyles.FlexCenter} text-white`}>
            {getIcon()}
        </div>
    );
};

// ============================================
// COMPONENT
// ============================================

export default function SocialFeeds() {
    const [feeds] = React.useState<SocialFeed[]>(DUMMY_FEEDS);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="text-gray-600 text-sm ml-1">{rating}.0</span>
            </div>
        );
    };

    return (
        <section className={`w-full bg-gray-50 ${CommonStyles.PaddingSectionSmall}`}>
            <div className={CommonStyles.Container}>
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-1 bg-blue-600 rounded"></div>
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">
                            Community Voices
                        </span>
                        <div className="w-12 h-1 bg-blue-600 rounded"></div>
                    </div>
                    <h2 className={`${CommonStyles.Heading2} text-gray-900 mb-4`}>
                        Official & Social Media Feeds
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
                        Verified posts from trusted sources and official disaster management channels
                    </p>
                    <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-lg"
                        onClick={handleSeeMoreFeeds}
                    >
                        Explore All Posts
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>

                {/* Feeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {feeds.map((feed) => (
                        <div
                            key={feed.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200 hover:border-blue-500"
                            onClick={() => handleFeedClick(feed.id)}
                        >
                            {/* Feed Image (if available) */}
                            {feed.image && (
                                <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                                    <Image
                                        src={feed.image}
                                        alt={feed.platform}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Platform Badge on Image */}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                                            <PlatformIcon platform={feed.platform} />
                                            <span className="font-semibold text-gray-900 text-sm">{feed.platform}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feed Content */}
                            <div className="p-6">
                                {/* Header without image */}
                                {!feed.image && (
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                        <PlatformIcon platform={feed.platform} />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{feed.platform}</h3>
                                            {feed.author && (
                                                <p className="text-sm text-gray-500">{feed.author}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Author (with image) */}
                                {feed.image && feed.author && (
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {feed.author[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{feed.author}</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                                    {feed.content}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    {/* Rating */}
                                    {feed.rating && renderStars(feed.rating)}

                                    {/* Engagement */}
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span className="text-sm font-medium">245</span>
                                        </button>
                                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="text-sm font-medium">89</span>
                                        </button>
                                        <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                            <span className="text-sm font-medium">34</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Section */}
                <div className="mt-12 text-center">
                    <button className="inline-flex items-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                        <svg className="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Load More Posts
                    </button>
                </div>
            </div>
        </section>
    );
}
