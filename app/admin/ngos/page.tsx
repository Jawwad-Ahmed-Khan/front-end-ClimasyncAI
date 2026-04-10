"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Search,
    Filter,
    RefreshCw,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    TrendingDown,
    MapPin,
    MessageSquare,
    Eye,
    Shield,
    AlertTriangle,
} from "lucide-react";
import { generateMockNGOsWithPerformance, formatTimeAgo } from "../_lib/adminMockData";
import { getAdminNgos, verifyAdminNgo } from "@/app/_lib/admin/adminService";
import type { NGOWithPerformance, VerificationStatus } from "../_lib/adminTypes";
import type { NgoProfileSnapshot, NgoStatus } from "@/app/_lib/admin/adminTypes";

// ============================================
// NGOs PAGE
// ============================================
// View and manage NGO performance and verification
// Features: Status tabs, performance metrics, verification queue

const statusTabs: { label: string; status: VerificationStatus | 'ALL' }[] = [
    { label: 'All NGOs', status: 'ALL' },
    { label: 'Verified', status: 'VERIFIED' },
    { label: 'Pending', status: 'PENDING' },
    { label: 'Suspended', status: 'SUSPENDED' },
];

export default function NGOsPage() {
    const [ngos, setNGOs] = useState<NGOWithPerformance[]>([]);
    const [filteredNGOs, setFilteredNGOs] = useState<NGOWithPerformance[]>([]);
    const [activeTab, setActiveTab] = useState<VerificationStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'tasksCompleted' | 'rating' | 'responseRate'>('tasksCompleted');
    const [isLoading, setIsLoading] = useState(true);

    const loadNgos = async () => {
        setIsLoading(true);
        try {
            const rawNgos = await getAdminNgos();
            // Map the backend profiles to the UI performance signature temporarily keeping mocked performance fields
            const mapped: NGOWithPerformance[] = rawNgos.map(n => ({
                id: n.ngo_id,
                orgName: n.org_name,
                registrationNumber: n.registration_number || "PENDING",
                headOfOperations: "N/A",
                phone: "N/A",
                email: n.org_email,
                verificationStatus: n.verification_status.toUpperCase() as VerificationStatus,
                rating: n.rating,
                baseCity: "Rawalpindi",
                baseDistrict: "Rawalpindi",
                baseProvince: "Punjab",
                baseLocation: { lat: 33.6844, lng: 73.0479 },
                serviceRadiusKm: 50,
                specializations: [],
                resources: {
                    ambulances: 0,
                    rescueBoats: 0,
                    trucks: 0,
                    personnel: 0
                },
                tasksCompleted: 0,
                tasksInProgress: 0,
                tasksPending: 0,
                responseRate: 100,
                avgResponseTime: 0,
                monthlyTrend: 0,
                isOnline: false,
                lastActiveAt: new Date(),
                createdAt: new Date()
            }));
            setNGOs(mapped);
        } catch (error) {
            console.error("Failed to fetch admin NGOs", error);
            // Fallback to mock on error for uncompleted API sections
            setNGOs(generateMockNGOsWithPerformance(15));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNgos();
    }, []);

    const handleVerify = async (ngoId: string, status: NgoStatus) => {
        try {
            await verifyAdminNgo(ngoId, { status });
            // Optimistic update
            setNGOs(prev => prev.map(n => 
                n.id === ngoId ? { ...n, verificationStatus: status.toUpperCase() as VerificationStatus } : n
            ));
        } catch (error) {
            console.error("Verification failed", error);
        }
    };

    useEffect(() => {
        let filtered = ngos;

        if (activeTab !== 'ALL') {
            filtered = filtered.filter(n => n.verificationStatus === activeTab);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(n =>
                n.orgName.toLowerCase().includes(query) ||
                n.baseCity.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered = [...filtered].sort((a, b) => b[sortBy] - a[sortBy]);

        setFilteredNGOs(filtered);
    }, [ngos, activeTab, searchQuery, sortBy]);

    const getStatusCount = (status: VerificationStatus | 'ALL') => {
        if (status === 'ALL') return ngos.length;
        return ngos.filter(n => n.verificationStatus === status).length;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">NGO Management</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Monitor performance and manage verifications
                    </p>
                </div>
                {getStatusCount('PENDING') > 0 && (
                    <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                        <span className="text-sm font-medium text-amber-400">
                            {getStatusCount('PENDING')} pending verification
                        </span>
                    </div>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatMini label="Total NGOs" value={ngos.length} icon={Building2} color="blue" />
                <StatMini label="Online Now" value={ngos.filter(n => n.isOnline).length} icon={CheckCircle} color="emerald" />
                <StatMini label="Avg Rating" value={`${(ngos.reduce((a, b) => a + b.rating, 0) / ngos.length).toFixed(1)}★`} icon={Star} color="amber" />
                <StatMini label="Pending" value={getStatusCount('PENDING')} icon={Clock} color="orange" />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {statusTabs.map((tab) => {
                    const count = getStatusCount(tab.status);
                    const isActive = activeTab === tab.status;
                    return (
                        <button
                            key={tab.status}
                            onClick={() => setActiveTab(tab.status)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                       whitespace-nowrap transition-all
                                       ${isActive
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'}`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold
                                            ${isActive ? 'bg-red-500/30' : 'bg-slate-700'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search NGOs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50
                                  text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/50
                              text-white text-sm focus:outline-none"
                >
                    <option value="tasksCompleted">Sort by: Tasks Completed</option>
                    <option value="rating">Sort by: Rating</option>
                    <option value="responseRate">Sort by: Response Rate</option>
                </select>
            </div>

            {/* NGO Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredNGOs.map((ngo, index) => (
                    <NGOCard key={ngo.id} ngo={ngo} index={index} handleVerify={handleVerify} />
                ))}
            </div>

            {filteredNGOs.length === 0 && (
                <div className="text-center py-16">
                    <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400">No NGOs found</p>
                </div>
            )}
        </div>
    );
}

// Mini Stat Component
function StatMini({ label, value, icon: Icon, color }: {
    label: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
}) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-400',
        emerald: 'bg-emerald-500/10 text-emerald-400',
        amber: 'bg-amber-500/10 text-amber-400',
        orange: 'bg-orange-500/10 text-orange-400',
    };

    return (
        <div className={`p-4 rounded-xl ${colors[color]} border border-white/5`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs opacity-70">{label}</p>
                </div>
                <Icon className="w-5 h-5 opacity-50" />
            </div>
        </div>
    );
}

// NGO Card Component
function NGOCard({ ngo, index, handleVerify }: { ngo: NGOWithPerformance; index: number; handleVerify: (id: string, s: NgoStatus) => void; }) {
    const statusColors: Record<VerificationStatus, string> = {
        VERIFIED: 'text-emerald-400 bg-emerald-500/20',
        PENDING: 'text-amber-400 bg-amber-500/20',
        SUSPENDED: 'text-red-400 bg-red-500/20',
        REJECTED: 'text-slate-400 bg-slate-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500
                                       flex items-center justify-center text-white font-bold text-lg">
                            {ngo.orgName.charAt(0)}
                        </div>
                        {ngo.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full 
                                           border-2 border-slate-900" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            {ngo.orgName}
                            {ngo.verificationStatus === 'VERIFIED' && (
                                <Shield className="w-4 h-4 text-emerald-400" />
                            )}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {ngo.baseCity}, {ngo.baseProvince}
                        </p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[ngo.verificationStatus]}`}>
                    {ngo.verificationStatus}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-lg font-bold text-white">{ngo.tasksCompleted}</p>
                    <p className="text-[10px] text-slate-500">Completed</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-lg font-bold text-white">{ngo.responseRate}%</p>
                    <p className="text-[10px] text-slate-500">Response</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                        {ngo.rating}
                        <Star className="w-3 h-3 text-amber-400" />
                    </p>
                    <p className="text-[10px] text-slate-500">Rating</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-800/30">
                    <p className={`text-lg font-bold flex items-center justify-center gap-1
                                  ${ngo.monthlyTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {ngo.monthlyTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(ngo.monthlyTrend)}%
                    </p>
                    <p className="text-[10px] text-slate-500">Trend</p>
                </div>
            </div>

            {/* Resources Preview */}
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                <span>🚑 {ngo.resources.ambulances}</span>
                <span>🚤 {ngo.resources.rescueBoats}</span>
                <span>🚛 {ngo.resources.trucks}</span>
                <span>👥 {ngo.resources.personnel}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/50">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                                  bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    View Profile
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                                  bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                </button>
                {ngo.verificationStatus === 'PENDING' && (
                    <button 
                        onClick={() => handleVerify(ngo.id, 'verified')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                                      bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verify
                    </button>
                )}
                {ngo.verificationStatus === 'VERIFIED' && (
                    <button 
                        onClick={() => handleVerify(ngo.id, 'suspended')}
                        className="flex items-center justify-center p-2 rounded-lg
                                      text-red-400 hover:bg-red-500/10">
                        <XCircle className="w-4 h-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
