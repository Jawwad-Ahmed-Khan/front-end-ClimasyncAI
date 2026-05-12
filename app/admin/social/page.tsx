"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Share2,
    RefreshCw,
    Edit,
    Trash2,
    Calendar,
    Send,
    Eye,
    Heart,
    MessageCircle,
    Repeat2,
    Twitter,
    Facebook,
    Linkedin,
    Instagram,
    Plus,
} from "lucide-react";
import { fetchSocialPosts, deleteSocialPost } from "../_lib/adminService";
import { formatTimeAgo } from "../_lib/adminUtils";
import type { SocialPost, SocialPlatform, SocialPostStatus } from "../_lib/adminTypes";

// ============================================
// SOCIAL POSTS PAGE
// ============================================

const statusTabs: { label: string; status: SocialPostStatus | 'ALL' }[] = [
    { label: 'All', status: 'ALL' },
    { label: 'Queued', status: 'QUEUED' },
    { label: 'Publishing', status: 'PUBLISHING' },
    { label: 'Published', status: 'PUBLISHED' },
    { label: 'Failed', status: 'FAILED' },
];

const platformIcons: Record<SocialPlatform, React.ElementType> = {
    TWITTER: Twitter,
    FACEBOOK: Facebook,
    LINKEDIN: Linkedin,
    INSTAGRAM: Instagram,
    TIKTOK: Share2,
};

const statusColors: Record<SocialPostStatus, string> = {
    QUEUED: 'text-amber-400 bg-amber-500/20',
    PUBLISHING: 'text-blue-400 bg-blue-500/20',
    PUBLISHED: 'text-emerald-400 bg-emerald-500/20',
    FAILED: 'text-red-400 bg-red-500/20',
};

export default function SocialPage() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [activeTab, setActiveTab] = useState<SocialPostStatus | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSocialPosts();
                setPosts(data);
            } catch (e) {
                console.error("Failed to load social posts", e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const filtered = activeTab === 'ALL' ? posts : posts.filter(p => p.status === activeTab);

    const getStatusCount = (status: SocialPostStatus | 'ALL') => {
        if (status === 'ALL') return posts.length;
        return posts.filter(p => p.status === status).length;
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Social Posts</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage public awareness campaigns</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl
                                  bg-linear-to-r from-red-500 to-orange-500 text-white font-medium text-sm">
                    <Plus className="w-4 h-4" />
                    Create Post
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.status}
                        onClick={() => setActiveTab(tab.status)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                                   ${activeTab === tab.status
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'text-slate-400 hover:bg-slate-800/50'}`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold
                                        ${activeTab === tab.status ? 'bg-red-500/30' : 'bg-slate-700'}`}>
                            {getStatusCount(tab.status)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((post, index) => (
                    <motion.div
                        key={post.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50"
                    >
                        {/* Status & Platforms */}
                        <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[post.status]}`}>
                                {post.status}
                            </span>
                            <div className="flex gap-1">
                                {(post.platforms || []).map((platform, pIdx) => {
                                    const Icon = platformIcons[platform];
                                    if (!Icon) return null;
                                    return (
                                        <div key={`${post.id}-${platform}-${pIdx}`} className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-white mb-3 line-clamp-3">{post.content}</p>

                        {/* Related Disaster */}
                        <p className="text-xs text-slate-500 mb-3 truncate">
                            Related: {post.disasterTitle}
                        </p>

                        {/* Engagement (if published) */}
                        {post.engagement && (
                            <div className="flex items-center gap-4 mb-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {post.engagement.views.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" /> {post.engagement.likes.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Repeat2 className="w-3 h-3" /> {post.engagement.shares}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" /> {post.engagement.comments}
                                </span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/50">
                            {post.status === 'QUEUED' && (
                                <>
                                    <button className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-1">
                                        <Send className="w-3 h-3" /> Post Now
                                    </button>
                                    <button className="flex-1 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center gap-1">
                                        <Calendar className="w-3 h-3" /> Schedule
                                    </button>
                                </>
                            )}
                            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
