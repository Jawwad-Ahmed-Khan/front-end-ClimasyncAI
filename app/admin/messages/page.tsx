"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Search,
    Send,
    Paperclip,
    MoreHorizontal,
    User,
    RefreshCw,
} from "lucide-react";
import { generateMockConversations, generateMockMessages, formatTimeAgo } from "../_lib/adminMockData";
import type { Conversation, Message } from "../_lib/adminTypes";

// ============================================
// MESSAGES PAGE
// ============================================

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const convs = generateMockConversations(10);
        setConversations(convs);
        if (convs.length > 0) {
            setSelectedConv(convs[0].id);
            setMessages(generateMockMessages(convs[0].id, 8));
        }
        setIsLoading(false);
    }, []);

    const handleSelectConversation = (convId: string) => {
        setSelectedConv(convId);
        setMessages(generateMockMessages(convId, 8));
    };

    const selectedConversation = conversations.find(c => c.id === selectedConv);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[60vh]">
            <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
        </div>;
    }

    return (
        <div className="h-[calc(100vh-180px)] flex gap-4">
            {/* Conversation List */}
            <div className="w-80 shrink-0 flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800/50 overflow-hidden">
                <div className="p-4 border-b border-slate-800/50">
                    <h2 className="text-lg font-semibold text-white mb-3">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50
                                      text-white text-sm placeholder-slate-500 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv.id)}
                            className={`w-full p-4 flex items-start gap-3 border-b border-slate-800/30 transition-colors
                                       ${selectedConv === conv.id ? 'bg-red-500/10' : 'hover:bg-slate-800/30'}`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500
                                           flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {conv.participantName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-white truncate">{conv.participantName}</p>
                                    <span className="text-[10px] text-slate-500">{formatTimeAgo(conv.lastMessageAt)}</span>
                                </div>
                                <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] 
                                               flex items-center justify-center font-bold">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800/50 overflow-hidden">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500
                                               flex items-center justify-center text-white font-bold">
                                    {selectedConversation.participantName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{selectedConversation.participantName}</p>
                                    <p className="text-xs text-slate-400">{selectedConversation.participantType}</p>
                                </div>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex ${msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${msg.senderType === 'ADMIN' ? 'order-2' : ''}`}>
                                        <div className={`p-3 rounded-2xl ${msg.senderType === 'ADMIN'
                                            ? 'bg-linear-to-r from-red-500 to-orange-500 text-white'
                                            : 'bg-slate-800 text-white'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                        <p className={`text-[10px] text-slate-500 mt-1 
                                                      ${msg.senderType === 'ADMIN' ? 'text-right' : ''}`}>
                                            {formatTimeAgo(msg.createdAt)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50
                                              text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                                />
                                <button className="p-2.5 rounded-xl bg-linear-to-r from-red-500 to-orange-500 text-white">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-400">Select a conversation</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
