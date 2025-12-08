"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    CheckCircle,
    Loader2,
    AlertTriangle,
    FileText,
    ClipboardList,
    Users,
    Share2,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { PipelineStep } from "../_lib/adminTypes";
import { generateMockPipelineSteps } from "../_lib/adminMockData";

// ============================================
// PIPELINE MODAL COMPONENT
// ============================================
// Shows AI analysis pipeline progress when verifying an alert
// Steps: Risk Analysis → Precautions → Tasks → Allocation → Social Posts

interface PipelineModalProps {
    isOpen: boolean;
    onClose: () => void;
    alertId: string;
    alertTitle: string;
}

const stepIcons = {
    'Risk Analysis': AlertTriangle,
    'Precautions Generated': FileText,
    'Tasks Defined': ClipboardList,
    'Task Allocation': Users,
    'Social Posts': Share2,
};

const stepDescriptions = {
    'Risk Analysis': 'AI analyzing severity, risk level, and affected population',
    'Precautions Generated': 'Generating recommended safety precautions',
    'Tasks Defined': 'Auto-generating response tasks based on disaster type',
    'Task Allocation': 'Matching tasks to capable NGOs in the area',
    'Social Posts': 'Generating public awareness posts for social media',
};

export default function PipelineModal({ isOpen, onClose, alertId, alertTitle }: PipelineModalProps) {
    const [steps, setSteps] = useState<PipelineStep[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Initialize pipeline when modal opens
    const startPipeline = () => {
        const mockSteps = generateMockPipelineSteps(alertId);
        setSteps(mockSteps);
        setIsRunning(true);
        simulatePipeline(mockSteps);
    };

    // Simulate pipeline execution
    const simulatePipeline = async (pipelineSteps: PipelineStep[]) => {
        for (let i = 0; i < pipelineSteps.length; i++) {
            setCurrentStep(i);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSteps(prev => prev.map((step, idx) => {
                if (idx === i) return { ...step, status: 'completed' };
                if (idx === i + 1) return { ...step, status: 'in_progress' };
                return step;
            }));
        }
        setIsRunning(false);
    };

    const getStepStatus = (step: PipelineStep, index: number) => {
        if (step.status === 'completed') return 'completed';
        if (step.status === 'in_progress' || index === currentStep) return 'in_progress';
        return 'pending';
    };

    const allCompleted = steps.every(s => s.status === 'completed');

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
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 
                                  md:-translate-x-1/2 md:-translate-y-1/2
                                  z-50 w-full md:w-[600px] max-h-[90vh]
                                  bg-slate-900 border border-slate-800 rounded-2xl
                                  shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-linear-to-br from-red-500/20 to-orange-500/20">
                                    <Sparkles className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">AI Analysis Pipeline</h2>
                                    <p className="text-xs text-slate-400 truncate max-w-[300px]">{alertTitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-slate-400 hover:text-white 
                                          hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {steps.length === 0 ? (
                                /* Start State */
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl 
                                                   bg-linear-to-br from-red-500/20 to-orange-500/20
                                                   flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Ready to Analyze
                                    </h3>
                                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                                        The AI will analyze this alert, generate tasks,
                                        match NGOs, and prepare social media posts.
                                    </p>
                                </div>
                            ) : (
                                /* Pipeline Steps */
                                <div className="space-y-3">
                                    {steps.map((step, index) => {
                                        const status = getStepStatus(step, index);
                                        const Icon = stepIcons[step.name as keyof typeof stepIcons] || FileText;

                                        return (
                                            <motion.div
                                                key={step.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`
                                                    p-4 rounded-xl border transition-all duration-300
                                                    ${status === 'completed'
                                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                                        : status === 'in_progress'
                                                            ? 'bg-blue-500/10 border-blue-500/30'
                                                            : 'bg-slate-800/30 border-slate-700/30'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Status Icon */}
                                                    <div className={`
                                                        p-2 rounded-lg
                                                        ${status === 'completed'
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : status === 'in_progress'
                                                                ? 'bg-blue-500/20 text-blue-400'
                                                                : 'bg-slate-700/50 text-slate-500'
                                                        }
                                                    `}>
                                                        {status === 'completed' ? (
                                                            <CheckCircle className="w-5 h-5" />
                                                        ) : status === 'in_progress' ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Icon className="w-5 h-5" />
                                                        )}
                                                    </div>

                                                    {/* Step Info */}
                                                    <div className="flex-1">
                                                        <h4 className={`
                                                            text-sm font-medium
                                                            ${status === 'pending' ? 'text-slate-400' : 'text-white'}
                                                        `}>
                                                            {step.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500">
                                                            {stepDescriptions[step.name as keyof typeof stepDescriptions]}
                                                        </p>
                                                    </div>

                                                    {/* Step Number */}
                                                    <div className={`
                                                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                                        ${status === 'completed'
                                                            ? 'bg-emerald-500 text-white'
                                                            : status === 'in_progress'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-slate-700 text-slate-400'
                                                        }
                                                    `}>
                                                        {index + 1}
                                                    </div>
                                                </div>

                                                {/* Result Preview (if completed) */}
                                                {status === 'completed' && step.result && (
                                                    <div className="mt-3 p-2 rounded-lg bg-slate-900/50 text-xs text-slate-400">
                                                        {step.name === 'Risk Analysis' && (
                                                            <div className="flex items-center gap-4">
                                                                <span>Severity: <span className="text-red-400">{(step.result as { severityScore: number }).severityScore}/10</span></span>
                                                                <span>Risk: <span className="text-orange-400">{(step.result as { riskLevel: string }).riskLevel}</span></span>
                                                                <span>Population: <span className="text-blue-400">{((step.result as { affectedPopulation: number }).affectedPopulation).toLocaleString()}</span></span>
                                                            </div>
                                                        )}
                                                        {step.name === 'Tasks Defined' && (
                                                            <span>{(step.result as { tasksCount: number }).tasksCount} tasks auto-generated</span>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm text-slate-400 
                                          hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>

                            {steps.length === 0 ? (
                                <button
                                    onClick={startPipeline}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                                              bg-linear-to-r from-red-500 to-orange-500
                                              text-white font-medium text-sm
                                              hover:from-red-600 hover:to-orange-600
                                              transition-all duration-200"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Start AI Analysis</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : allCompleted ? (
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                                              bg-linear-to-r from-emerald-500 to-cyan-500
                                              text-white font-medium text-sm
                                              hover:from-emerald-600 hover:to-cyan-600
                                              transition-all duration-200"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Approve & Execute All</span>
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                                              bg-slate-700 text-slate-400 font-medium text-sm
                                              cursor-not-allowed"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
