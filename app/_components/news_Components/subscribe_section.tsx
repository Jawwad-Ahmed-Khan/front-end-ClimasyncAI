'use client'
import React, { useState } from 'react';
import { CommonStyles } from '@/app/_types/news_types';

// ============================================
// API FUNCTIONS (Placeholder)
// ============================================

const handleSubscribe = async (email: string) => {
    console.log('Subscribe API called with email:', email);
    // TODO: Implement subscription API call
    return { success: true, message: 'Successfully subscribed!' };
};

const handleReportNews = () => {
    console.log('Report News clicked');
    // TODO: Navigate to report news form or open modal
};

// ============================================
// COMPONENT
// ============================================

export default function SubscribeSection() {
    const [email, setEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscribeMessage, setSubscribeMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const handleSubmitSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setSubscribeMessage({
                type: 'error',
                text: 'Please enter a valid email address',
            });
            return;
        }

        setIsSubscribing(true);
        setSubscribeMessage(null);

        try {
            const result = await handleSubscribe(email);
            setSubscribeMessage({
                type: 'success',
                text: result.message,
            });
            setEmail('');
        } catch (error) {
            setSubscribeMessage({
                type: 'error',
                text: 'Failed to subscribe. Please try again.',
            });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <section className="w-full bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 py-20 md:py-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
            </div>

            <div className={`${CommonStyles.Container} relative z-10`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-white font-semibold text-sm">Stay Informed</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Never Miss Critical Updates
                        </h2>

                        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                            Get instant alerts about verified disaster news, emergency updates, and safety information delivered straight to your inbox.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-4 mb-8">
                            {[
                                { icon: '⚡', text: 'Real-time disaster alerts' },
                                { icon: '✅', text: 'AI-verified news only' },
                                { icon: '🔔', text: 'Customizable notifications' },
                                { icon: '🔒', text: 'Privacy protected' },
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
                                        {feature.icon}
                                    </div>
                                    <span className="text-white font-medium">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 text-white">
                            <div>
                                <div className="text-3xl font-bold">50K+</div>
                                <div className="text-blue-200 text-sm">Subscribers</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-blue-200 text-sm">Accuracy Rate</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-bold">24/7</div>
                                <div className="text-blue-200 text-sm">Monitoring</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Subscribe Form */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Subscribe to Alerts
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Join thousands staying safe with verified information
                            </p>

                            {/* Subscribe Form */}
                            <form onSubmit={handleSubmitSubscribe} className="mb-6">
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full px-4 py-4 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900"
                                            disabled={isSubscribing}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Success/Error Message */}
                                {subscribeMessage && (
                                    <div
                                        className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${subscribeMessage.type === 'success'
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-red-50 border border-red-200 text-red-800'
                                            }`}
                                    >
                                        <span className="text-xl">
                                            {subscribeMessage.type === 'success' ? '✓' : '⚠'}
                                        </span>
                                        <span className="font-medium text-sm">{subscribeMessage.text}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubscribing}
                                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubscribing ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            Subscribe Now
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            {/* Report News Button */}
                            <button
                                onClick={handleReportNews}
                                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Report Suspicious News
                            </button>

                            {/* Privacy Note */}
                            <p className="text-xs text-gray-500 mt-6 text-center">
                                We respect your privacy. Unsubscribe anytime. No spam, ever.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
