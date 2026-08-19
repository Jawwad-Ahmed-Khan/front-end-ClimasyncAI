import { Loader2 } from "lucide-react";

// ============================================
// DASHBOARD LOADING COMPONENT
// ============================================
// Shows a professional loading spinner while pages load

export default function DashboardLoading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
                </div>

                {/* Loading Text */}
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm font-medium">Loading...</span>
                </div>
            </div>
        </div>
    );
}
