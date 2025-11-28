'use client';

export default function DashboardHeader() {
    return (
        <header className="bg-linear-to-r from-blue-600 via-blue-700 to-cyan-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Pakistan Disaster Response Dashboard
                        </h1>
                        <p className="text-blue-100 text-sm mt-2 font-medium">
                            Real-time coordination platform for emergency relief operations
                        </p>
                    </div>
                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                        <span className="text-sm font-bold text-white">LIVE</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
