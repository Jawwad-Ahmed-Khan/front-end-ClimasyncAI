import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, Mountain, Users, AlertTriangle, CheckCircle2, Lightbulb, Loader2, AlertCircle, Info } from "lucide-react";

interface RiskAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: any; // Using any for now, should ideally be typed according to the RiskAssessmentResponse
}

const dummyPrecautions = [
    { id: 1, task: "Evacuate Low-Lying Areas — Move residents near Indus River banks to higher ground immediately", severity: "CRITICAL" },
    { id: 2, task: "Deploy Medical Teams — Station health workers to prevent cholera, typhoid & waterborne disease outbreaks", severity: "CRITICAL" },
    { id: 3, task: "Set Up Emergency Shelters — Open schools/public buildings as relief camps for 20,000+ displaced persons", severity: "CRITICAL" },
    { id: 4, task: "Distribute Clean Water & Food — Supply safe drinking water & dry rations to affected communities", severity: "CRITICAL" },
    { id: 5, task: "Protect Livestock & Crops — Move animals to elevated areas; harvest ready crops before flooding spreads", severity: "HIGH" },
    { id: 6, task: "Monitor Road Access — Keep major evacuation routes clear; identify alternate routes if roads flood", severity: "HIGH" },
    { id: 7, task: "Broadcast Public Warnings — Use loudspeakers, SMS alerts & radio to warn communities in local language", severity: "HIGH" },
    { id: 8, task: "Shut Off Electricity in Flood Zones — Prevent electrocution risks in waterlogged areas", severity: "HIGH" },
    { id: 9, task: "Coordinate with NGOs & NDMA — Align relief efforts with active organizations already on ground", severity: "MEDIUM" },
    { id: 10, task: "Register Displaced Families — Record names & locations of displaced persons for aid distribution tracking", severity: "MEDIUM" }
];

export default function RiskAssessmentModal({ isOpen, onClose, report }: RiskAssessmentModalProps) {
    const [isGeneratingPrecautions, setIsGeneratingPrecautions] = useState(false);
    const [precautionsGenerated, setPrecautionsGenerated] = useState(false);

    if (!isOpen || !report) return null;

    const actualReport = report.assessment_id ? report : (report.data || report.result || report);

    const handleGeneratePrecautions = () => {
        setIsGeneratingPrecautions(true);
        // Simulate a long 4-minute wait (using 4 seconds for development UX sanity, 
        // but visually it tells the user it's running a complex agent)
        setTimeout(() => {
            setIsGeneratingPrecautions(false);
            setPrecautionsGenerated(true);
        }, 5000); 
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl custom-scrollbar"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-slate-900/95 backdrop-blur border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">AI Risk Assessment Report</h2>
                                <p className="text-sm text-slate-400">
                                    ID: {actualReport.assessment_id || 'Unknown'} • {actualReport.location_name || 'Unknown Location'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 transition-colors rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {!actualReport.assessment_id && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg">
                                <h3 className="font-bold mb-2">Unexpected Data Format Received:</h3>
                                <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(report, null, 2)}</pre>
                            </div>
                        )}

                        {/* Executive Summary */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="p-5 border rounded-xl bg-slate-800/50 border-slate-700/50 md:col-span-2">
                                <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-slate-400">Justification</h3>
                                <p className="leading-relaxed text-slate-200">
                                    {actualReport.risk_level_justification || 'No justification provided.'}
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-5 border rounded-xl bg-slate-800/50 border-slate-700/50">
                                <span className="mb-1 text-sm font-semibold tracking-wider text-center uppercase text-slate-400">Composite Score</span>
                                <span className="text-5xl font-black text-white">{actualReport.composite_risk_score || 'N/A'}</span>
                                <span className={`px-3 py-1 mt-3 text-xs font-bold uppercase rounded-full ${
                                    actualReport.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                    actualReport.risk_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    {actualReport.risk_level || 'UNKNOWN'} RISK
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Critical Actions */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                    Critical Actions Needed
                                </h3>
                                <ul className="space-y-3">
                                    {Array.isArray(actualReport.critical_actions_needed) ? actualReport.critical_actions_needed.map((action: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-3 border rounded-lg bg-red-500/5 border-red-500/20 text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 mt-0.5 text-red-400 shrink-0" />
                                            <span className="text-sm">{action}</span>
                                        </li>
                                    )) : (
                                        <li className="text-sm text-slate-500 italic">No critical actions identified.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Terrain & Exposure */}
                            <div className="space-y-6">
                                <div className="p-5 border rounded-xl bg-slate-800/30 border-slate-700/50">
                                    <h3 className="flex items-center gap-2 mb-4 text-sm font-semibold text-white uppercase">
                                        <Mountain className="w-4 h-4 text-emerald-400" />
                                        Terrain Assessment
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-xs text-slate-500">Type</span>
                                            <span className="text-sm font-medium text-slate-200 capitalize">{actualReport.terrain_assessment?.terrain_type || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-500">Multiplier</span>
                                            <span className="text-sm font-medium text-slate-200">{actualReport.terrain_assessment?.terrain_multiplier || 1}x</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="block mb-1 text-xs text-slate-500">Implications</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(actualReport.terrain_assessment?.terrain_implications) ? actualReport.terrain_assessment.terrain_implications.map((imp: string, i: number) => (
                                                <span key={i} className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300">{imp}</span>
                                            )) : (
                                                <span className="text-sm text-slate-500">None provided</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 border rounded-xl bg-slate-800/30 border-slate-700/50">
                                    <h3 className="flex items-center gap-2 mb-4 text-sm font-semibold text-white uppercase">
                                        <Users className="w-4 h-4 text-blue-400" />
                                        Exposure Details
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Total Population:</span>
                                            <span className="font-medium text-slate-200">{actualReport.exposure?.population_breakdown?.total_population?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Directly Affected:</span>
                                            <span className="font-medium text-red-400">{actualReport.exposure?.population_breakdown?.estimated_directly_affected?.toLocaleString() || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Precaution Generation Section */}
                        <div className="pt-8 mt-8 border-t border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-emerald-400" />
                                        Response Strategy
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">Generate actionable precautions using the Precautionary Agent based on this assessment.</p>
                                </div>
                                
                                {!precautionsGenerated && (
                                    <button
                                        onClick={handleGeneratePrecautions}
                                        disabled={isGeneratingPrecautions}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg
                                            ${isGeneratingPrecautions 
                                                ? 'bg-slate-800 text-emerald-400/50 cursor-not-allowed border border-slate-700' 
                                                : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:-translate-y-0.5 shadow-emerald-900/50 border border-emerald-500/50'}`}
                                    >
                                        {isGeneratingPrecautions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                                        <span>{isGeneratingPrecautions ? 'Running Precautionary Agent...' : 'Generate Precautions'}</span>
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                {precautionsGenerated && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-3"
                                    >
                                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                            <h4 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Precautions Required to Mitigate Risk
                                            </h4>
                                            <div className="space-y-3">
                                                {dummyPrecautions.map((p) => (
                                                    <div key={p.id} className="flex gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                                                        <div className="mt-0.5">
                                                            {p.severity === 'CRITICAL' && <AlertCircle className="w-4 h-4 text-red-400" />}
                                                            {p.severity === 'HIGH' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                                                            {p.severity === 'MEDIUM' && <Info className="w-4 h-4 text-yellow-400" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm text-slate-200">{p.task}</p>
                                                        </div>
                                                        <div className="hidden sm:block">
                                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                                                                p.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                p.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                            }`}>
                                                                {p.severity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}