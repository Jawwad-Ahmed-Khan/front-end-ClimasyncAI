'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { CommonStyles } from '@/app/_types/news_types';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface VerificationResult {
    status: 'real' | 'fake';
    explanation: string;
    sourceLinks: string[];
    fullAgentOutput: string;
    confidence: number;
}

// ============================================
// API FUNCTIONS (Placeholder)
// ============================================

const verifyNewsWithAI = async (
    text: string,
    imageFile?: File,
    videoFile?: File
): Promise<VerificationResult> => {
    console.log('Verify News AI API called with:', {
        text,
        hasImage: !!imageFile,
        hasVideo: !!videoFile,
    });

    // TODO: Implement actual API call to Agentic AI backend
    // Example API call structure:
    // const formData = new FormData();
    // formData.append('text', text);
    // if (imageFile) formData.append('image', imageFile);
    // if (videoFile) formData.append('video', videoFile);
    // const response = await fetch('/api/verify-news', {
    //   method: 'POST',
    //   body: formData,
    // });
    // return await response.json();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response
    const isReal = Math.random() > 0.5;
    return {
        status: isReal ? 'real' : 'fake',
        explanation: isReal
            ? 'This news appears to be authentic based on cross-referencing with verified sources and fact-checking databases. The information aligns with reports from credible news organizations and official statements.'
            : 'This news shows signs of fabrication. Our AI analysis detected inconsistencies in the timeline, lack of credible sources, and similarities to known misinformation patterns.',
        sourceLinks: [
            'https://example.com/source1',
            'https://example.com/source2',
            'https://example.com/source3',
        ],
        fullAgentOutput: `Agent Analysis Report:
    
1. Text Analysis:
   - Sentiment: ${isReal ? 'Neutral' : 'Sensationalist'}
   - Language patterns: ${isReal ? 'Professional' : 'Emotional'}
   - Fact density: ${isReal ? 'High' : 'Low'}

2. Source Verification:
   - Cross-referenced ${Math.floor(Math.random() * 10 + 5)} sources
   - Credibility score: ${isReal ? '8.5/10' : '3.2/10'}
   
3. Media Analysis:
   ${imageFile ? '- Image metadata verified\n   - No signs of manipulation detected' : '- No image provided'}
   ${videoFile ? '- Video forensics completed\n   - Authenticity confirmed' : '- No video provided'}

4. Conclusion: ${isReal ? 'VERIFIED' : 'FAKE NEWS DETECTED'}
Confidence: ${Math.floor(Math.random() * 20 + 80)}%`,
        confidence: Math.floor(Math.random() * 20 + 80),
    };
};

// ============================================
// COMPONENT
// ============================================

export default function VerifyNews() {
    // Using useRef for text input
    const newsTextRef = useRef<HTMLTextAreaElement>(null);

    // File uploads
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<VerificationResult | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                // 10MB limit
                setError('Image file size must be less than 10MB');
                return;
            }
            setImageFile(file);
            setError(null);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                // 50MB limit
                setError('Video file size must be less than 50MB');
                return;
            }
            setVideoFile(file);
            setError(null);
        }
    };

    const handleVerify = async () => {
        const newsText = newsTextRef.current?.value || '';

        if (!newsText.trim() && !imageFile && !videoFile) {
            setError('Please provide news text, image, or video to verify');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const verificationResult = await verifyNewsWithAI(
                newsText,
                imageFile || undefined,
                videoFile || undefined
            );
            setResult(verificationResult);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to verify news. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (newsTextRef.current) {
            newsTextRef.current.value = '';
        }
        setImageFile(null);
        setVideoFile(null);
        setResult(null);
        setError(null);
    };

    return (
        <section className={`w-full bg-gray-50 ${CommonStyles.PaddingSectionSmall} md:py-16`}>
            <div className={CommonStyles.Container}>
                {/* Header with Search Icon */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                        <Image
                            src="/images/news/search.png"
                            alt="Search"
                            width={80}
                            height={80}
                            className="mx-auto"
                        />
                    </div>
                    <h2 className={`${CommonStyles.Heading2} text-gray-900 mb-3`}>
                        AI-Powered News Verification
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Submit news content for instant verification using advanced AI and fact-checking systems
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input Form */}
                    <div className={`bg-white ${CommonStyles.Shadow} ${CommonStyles.RoundedLarge} ${CommonStyles.PaddingForm}`}>
                        <h3 className={`${CommonStyles.Heading4} text-gray-900 mb-6 pb-4 border-b-2 border-gray-200`}>
                            📝 Submit Content for Verification
                        </h3>

                        {/* Text Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                                News Text
                            </label>
                            <textarea
                                ref={newsTextRef}
                                placeholder="Paste or type the news content you want to verify..."
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none h-32 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                                📷 Upload Image (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`block w-full px-4 py-4 bg-gray-50 ${CommonStyles.RoundedLarge} border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 ${CommonStyles.TransitionAll} cursor-pointer text-center`}
                                >
                                    {imageFile ? (
                                        <span className="text-gray-900 font-semibold flex items-center justify-center gap-2">
                                            <span className="text-2xl">✅</span>
                                            {imageFile.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 flex flex-col items-center gap-2">
                                            <span className="text-3xl">📤</span>
                                            <span>Click to upload or drag & drop</span>
                                            <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                                        </span>
                                    )}
                                </label>
                            </div>
                            {imageFile && (
                                <button
                                    onClick={() => setImageFile(null)}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                    disabled={loading}
                                >
                                    ✕ Remove image
                                </button>
                            )}
                        </div>

                        {/* Video Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-semibold text-sm uppercase tracking-wide">
                                🎥 Upload Video (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    disabled={loading}
                                    className="hidden"
                                    id="video-upload"
                                />
                                <label
                                    htmlFor="video-upload"
                                    className={`block w-full px-4 py-4 bg-gray-50 ${CommonStyles.RoundedLarge} border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 ${CommonStyles.TransitionAll} cursor-pointer text-center`}
                                >
                                    {videoFile ? (
                                        <span className="text-gray-900 font-semibold flex items-center justify-center gap-2">
                                            <span className="text-2xl">✅</span>
                                            {videoFile.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 flex flex-col items-center gap-2">
                                            <span className="text-3xl">📤</span>
                                            <span>Click to upload or drag & drop</span>
                                            <span className="text-xs text-gray-400">MP4, MOV up to 50MB</span>
                                        </span>
                                    )}
                                </label>
                            </div>
                            {videoFile && (
                                <button
                                    onClick={() => setVideoFile(null)}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                    disabled={loading}
                                >
                                    ✕ Remove video
                                </button>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 text-xl">⚠️</span>
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={`${CommonStyles.FlexRow} gap-3`}>
                            <button
                                className={`flex-1 bg-blue-600 ${CommonStyles.TextWhite} ${CommonStyles.ButtonPrimary} hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${CommonStyles.FlexCenter} gap-2 shadow-lg hover:shadow-xl`}
                                onClick={handleVerify}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">🔍</span>
                                        Verify with AI
                                    </>
                                )}
                            </button>
                            <button
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 shadow"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Results Display */}
                    <div>
                        {loading && (
                            <div className={`bg-white ${CommonStyles.Shadow} ${CommonStyles.RoundedLarge} ${CommonStyles.PaddingForm} ${CommonStyles.FlexCenter} min-h-[500px]`}>
                                <div className="text-center">
                                    {/* Professional Spinner */}
                                    <div className="relative w-24 h-24 mx-auto mb-6">
                                        <div className="absolute inset-0 border-8 border-gray-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-3 border-8 border-blue-400 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        AI Analysis in Progress
                                    </h3>
                                    <p className="text-gray-600">
                                        Analyzing content with advanced verification systems...
                                    </p>
                                    <div className="mt-4 flex items-center justify-center gap-1">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading && !result && (
                            <div className={`bg-white ${CommonStyles.Shadow} ${CommonStyles.RoundedLarge} ${CommonStyles.PaddingForm} ${CommonStyles.FlexCenter} min-h-[500px]`}>
                                <div className="text-center">
                                    <div className="mb-6">
                                        <Image
                                            src="/images/news/search.png"
                                            alt="Search"
                                            width={100}
                                            height={100}
                                            className="mx-auto opacity-50"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Ready to Verify
                                    </h3>
                                    <p className="text-gray-600">
                                        Submit news content to get instant AI-powered verification
                                    </p>
                                </div>
                            </div>
                        )}

                        {!loading && result && (
                            <div className={`bg-white ${CommonStyles.Shadow} ${CommonStyles.RoundedLarge} overflow-hidden`}>
                                {/* Status Header with Icon */}
                                <div className={`p-8 text-center ${result.status === 'real' ? 'bg-green-50 border-b-4 border-green-500' : 'bg-red-50 border-b-4 border-red-500'}`}>
                                    <div className="mb-4">
                                        <Image
                                            src={`/images/news/${result.status}.png`}
                                            alt={result.status}
                                            width={120}
                                            height={120}
                                            className="mx-auto drop-shadow-lg"
                                        />
                                    </div>
                                    <h3 className={`text-5xl font-bold mb-2 ${result.status === 'real' ? 'text-green-700' : 'text-red-700'}`}>
                                        {result.status === 'real' ? 'VERIFIED' : 'FAKE NEWS'}
                                    </h3>
                                    <div className={`inline-block px-4 py-2 rounded-full ${result.status === 'real' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} font-semibold`}>
                                        Confidence: {result.confidence}%
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Explanation */}
                                    <div className="mb-6">
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <span>💡</span>
                                            AI Explanation
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                            {result.explanation}
                                        </p>
                                    </div>

                                    {/* Source Links */}
                                    {result.sourceLinks.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <span>🔗</span>
                                                Verified Sources
                                            </h4>
                                            <div className="space-y-2">
                                                {result.sourceLinks.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 hover:text-blue-800 font-medium border border-blue-200"
                                                    >
                                                        <span className="mr-2">↗</span>
                                                        {link}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Full Agent Output (Collapsible) */}
                                    <details className="group">
                                        <summary className="cursor-pointer p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-gray-900 flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <span>📊</span>
                                                Full AI Agent Report
                                            </span>
                                            <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <div className="mt-3 p-4 bg-gray-900 rounded-lg">
                                            <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                                                {result.fullAgentOutput}
                                            </pre>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
