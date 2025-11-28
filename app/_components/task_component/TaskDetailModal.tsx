'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, User, Clock, FileText, Paperclip, ChevronRight } from 'lucide-react';
import { TaskData } from '@/app/_types/task';
import Image from 'next/image';

interface TaskDetailModalProps {
    task: TaskData | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'contact' | 'timeline' | 'notes' | 'attachments'>('contact');

    // Reset tab when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab('contact');
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!task) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal - Desktop: Centered, Mobile: Bottom Sheet */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 p-0 md:p-4"
                    >
                        <div className="bg-slate-900 border border-slate-700 rounded-t-3xl md:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        {task.ngo.logo && (
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700">
                                                <Image
                                                    src={task.ngo.logo}
                                                    alt={task.ngo.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{task.title}</h2>
                                            <p className="text-slate-400 text-sm">{task.ngo.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-slate-400">Progress</span>
                                        <span className="text-sm font-medium text-white">{task.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500"
                                            style={{ width: `${task.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-slate-800">
                                <div className="flex px-6 gap-1">
                                    {[
                                        { id: 'contact', label: 'Contact', icon: User },
                                        { id: 'timeline', label: 'Timeline', icon: Clock },
                                        { id: 'notes', label: 'Notes', icon: FileText },
                                        { id: 'attachments', label: 'Attachments', icon: Paperclip },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                                    ? 'text-cyan-400 border-cyan-500'
                                                    : 'text-slate-400 border-transparent hover:text-white'
                                                }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Contact Tab */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-4">
                                        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <User className="w-5 h-5 text-cyan-400" />
                                                <span className="font-medium text-white">Coordinator</span>
                                            </div>
                                            <p className="text-slate-300">{task.ngo.contact.coordinator}</p>
                                        </div>

                                        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Mail className="w-5 h-5 text-cyan-400" />
                                                <span className="font-medium text-white">Email</span>
                                            </div>
                                            <a href={`mailto:${task.ngo.contact.email}`} className="text-cyan-400 hover:underline">
                                                {task.ngo.contact.email}
                                            </a>
                                        </div>

                                        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Phone className="w-5 h-5 text-cyan-400" />
                                                <span className="font-medium text-white">Phone</span>
                                            </div>
                                            <a href={`tel:${task.ngo.contact.phone}`} className="text-cyan-400 hover:underline">
                                                {task.ngo.contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Timeline Tab */}
                                {activeTab === 'timeline' && (
                                    <div className="space-y-4">
                                        {task.timeline.length === 0 ? (
                                            <p className="text-slate-500 text-center py-8">No timeline events yet.</p>
                                        ) : (
                                            <div className="relative">
                                                {/* Vertical Line */}
                                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-800" />

                                                {task.timeline.map((event, index) => (
                                                    <div key={event.id} className="relative pl-12 pb-6 last:pb-0">
                                                        {/* Timeline Dot */}
                                                        <div className="absolute left-2.5 top-0 w-3 h-3 bg-cyan-500 rounded-full ring-4 ring-slate-900" />

                                                        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-medium text-white">{event.title}</h4>
                                                                <span className="text-xs text-slate-500">
                                                                    {event.date.toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-400">{event.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Notes Tab */}
                                {activeTab === 'notes' && (
                                    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                                        <p className="text-slate-300 whitespace-pre-line">{task.notes || 'No notes available.'}</p>
                                    </div>
                                )}

                                {/* Attachments Tab */}
                                {activeTab === 'attachments' && (
                                    <div className="space-y-3">
                                        {task.attachments.length === 0 ? (
                                            <p className="text-slate-500 text-center py-8">No attachments yet.</p>
                                        ) : (
                                            task.attachments.map((attachment) => (
                                                <a
                                                    key={attachment.id}
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 rounded-lg hover:bg-slate-800/60 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Paperclip className="w-5 h-5 text-slate-400" />
                                                        <div>
                                                            <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                                                {attachment.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {attachment.uploadedAt.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                                </a>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                                <button className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors">
                                    Update Status
                                </button>
                                <button className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-medium transition-colors">
                                    Reassign Task
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
