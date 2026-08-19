/**
 * Loading Overlay - Displays loading state for the map
 */

'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
}

export default function LoadingOverlay({
    message = 'Loading disaster data...',
}: LoadingOverlayProps) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
                <div className="flex flex-col items-center gap-4">
                    {/* Animated Spinner */}
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl" />
                    </div>

                    {/* Loading Text */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-1">
                            ClimaSyncAI
                        </h3>
                        <p className="text-sm text-slate-400">{message}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-cyan-500 to-blue-600 animate-progress rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
