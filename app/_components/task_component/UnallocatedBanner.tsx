'use client';

import { AlertTriangle } from 'lucide-react';

interface UnallocatedBannerProps {
    count: number;
}

export default function UnallocatedBanner({ count }: UnallocatedBannerProps) {
    if (count === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/30">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-amber-900">
                                Warning: {count} Tasks Unallocated
                            </h3>
                            <p className="text-sm text-amber-700 font-semibold mt-1">
                                Immediate attention required for task assignment
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-amber-600/40 hover:shadow-xl hover:-translate-y-0.5">
                        View Unallocated Tasks
                    </button>
                </div>
            </div>
        </div>
    );
}
