"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Activity,
    CheckCircle,
    Clock,
    TrendingUp,
    MapPin,
    Thermometer,
    CloudRain,
    Wind,
    Waves,
} from "lucide-react";
import {
    getThresholdAlerts,
    acknowledgeThresholdAlert,
    type ThresholdBreachAlert,
} from "@/app/_lib/admin/thresholdAlertService";
import {
    requestRiskAnalysis,
    getRiskAnalysisResult,
    type RiskAnalysisResponse,
} from "@/app/_lib/admin/riskAnalysisService";
import {
    requestPrecautionaryMeasures,
    getPrecautionaryMeasures,
    type PrecautionaryResponse,
} from "@/app/_lib/admin/precautionaryService";

export default function ThresholdAlertsPage() {
    const [alerts, setAlerts] = useState<ThresholdBreachAlert[]>([]);
    const [selectedAlert, setSelectedAlert] = useState<ThresholdBreachAlert | null>(null);
    const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysisResponse | null>(null);
    const [precautionaryMeasures, setPrecautionaryMeasures] = useState<PrecautionaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingStep, setProcessingStep] = useState<'idle' | 'analyzing' | 'generating' | 'complete'>('idle');

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const data = await getThresholdAlerts('NEW', undefined, 50);
            setAlerts(data.alerts);
        } catch (error) {
            console.error('Failed to load alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (alertId: string) => {
        try {
            await acknowledgeThresholdAlert(alertId);
            loadAlerts();
        } catch (error) {
            console.error('Failed to acknowledge alert:', error);
        }
    };

    const handleRequestRiskAnalysis = async (alert: ThresholdBreachAlert) => {
        setSelectedAlert(alert);
        setProcessingStep('analyzing');
        
        try {
            // Step 1: Request risk analysis
            const analysisRequest = await requestRiskAnalysis({
                alert_id: alert.alert_id,
                location: alert.location,
                sensor_data: {
                    sensor_type: alert.sensor_type,
                    current_value: alert.current_value,
                    threshold_value: alert.threshold_value,
                },
            });

            // Step 2: Poll for risk analysis result
            let attempts = 0;
            const maxAttempts = 30;
            const pollInterval = 2000;

            const pollAnalysis = setInterval(async () => {
                attempts++;
                try {
                    const result = await getRiskAnalysisResult(analysisRequest.analysis_id);
                    
                    if (result.status === 'COMPLETED') {
                        clearInterval(pollAnalysis);
                        setRiskAnalysis(result);
                        setProcessingStep('complete');
                    } else if (result.status === 'FAILED' || attempts >= maxAttempts) {
                        clearInterval(pollAnalysis);
                        setProcessingStep('idle');
                        alert('Risk analysis failed or timed out');
                    }
                } catch (error) {
                    console.error('Error polling analysis:', error);
                }
            }, pollInterval);

        } catch (error) {
            console.error('Failed to request risk analysis:', error);
            setProcessingStep('idle');
        }
    };

    const handleRequestPrecautions = async () => {
        if (!riskAnalysis || !selectedAlert) return;
        
        setProcessingStep('generating');
        
        try {
            // Step 3: Request precautionary measures
            const precautionRequest = await requestPrecautionaryMeasures({
                analysis_id: riskAnalysis.analysis_id,
                risk_analysis_data: {
                    risk_score: riskAnalysis.risk_score,
                    risk_level: riskAnalysis.risk_level,
                    disaster_type: riskAnalysis.disaster_type,
                    affected_area_km2: riskAnalysis.affected_area_km2,
                    estimated_population_affected: riskAnalysis.estimated_population_affected,
                },
                location: selectedAlert.location,
            });

            // Step 4: Poll for precautionary measures result
            let attempts = 0;
            const maxAttempts = 30;
            const pollInterval = 2000;

            const pollPrecautions = setInterval(async () => {
                attempts++;
                try {
                    const result = await getPrecautionaryMeasures(precautionRequest.precaution_id);
                    
                    if (result.status === 'GENERATED') {
                        clearInterval(pollPrecautions);
                        setPrecautionaryMeasures(result);
                        setProcessingStep('complete');
                    } else if (attempts >= maxAttempts) {
                        clearInterval(pollPrecautions);
                        setProcessingStep('complete');
                        alert('Precautionary measures generation timed out');
                    }
                } catch (error) {
                    console.error('Error polling precautions:', error);
                }
            }, pollInterval);

        } catch (error) {
            console.error('Failed to request precautionary measures:', error);
            setProcessingStep('complete');
        }
    };

    const getSensorIcon = (type: string) => {
        switch (type) {
            case 'temperature': return <Thermometer className="w-5 h-5" />;
            case 'rainfall': return <CloudRain className="w-5 h-5" />;
            case 'wind_speed': return <Wind className="w-5 h-5" />;
            case 'water_level': return <Waves className="w-5 h-5" />;
            case 'seismic': return <Activity className="w-5 h-5" />;
            default: return <AlertTriangle className="w-5 h-5" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'from-red-500 to-red-600';
            case 'HIGH': return 'from-orange-500 to-orange-600';
            case 'MEDIUM': return 'from-yellow-500 to-yellow-600';
            case 'LOW': return 'from-blue-500 to-blue-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Activity className="w-8 h-8 text-red-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading threshold alerts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Threshold Breach Alerts</h1>
                <p className="text-slate-400">Monitor and respond to sensor threshold breaches</p>
            </div>

            {/* Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {alerts.map((alert, index) => (
                    <motion.div
                        key={alert.alert_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-red-500/30 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl bg-linear-to-br ${getSeverityColor(alert.severity)}`}>
                                    {getSensorIcon(alert.sensor_type)}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold capitalize">
                                        {alert.sensor_type.replace('_', ' ')} Alert
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${alert.severity === 'CRITICAL' ? 'red' : alert.severity === 'HIGH' ? 'orange' : 'yellow'}-500/20 text-${alert.severity === 'CRITICAL' ? 'red' : alert.severity === 'HIGH' ? 'orange' : 'yellow'}-400`}>
                                {alert.severity}
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-3 text-slate-300">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{alert.location.location_name}, {alert.location.province}</span>
                        </div>

                        {/* Values */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-3 rounded-lg bg-slate-800/50">
                                <p className="text-xs text-slate-400 mb-1">Current Value</p>
                                <p className="text-lg font-bold text-white">{alert.current_value}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-800/50">
                                <p className="text-xs text-slate-400 mb-1">Threshold</p>
                                <p className="text-lg font-bold text-white">{alert.threshold_value}</p>
                            </div>
                        </div>

                        {/* Breach Percentage */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                <span>Breach Percentage</span>
                                <span className="font-bold text-red-400">{alert.breach_percentage}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-red-500 to-orange-500"
                                    style={{ width: `${Math.min(alert.breach_percentage, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAcknowledge(alert.alert_id)}
                                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
                            >
                                <CheckCircle className="w-4 h-4 inline mr-2" />
                                Acknowledge
                            </button>
                            <button
                                onClick={() => handleRequestRiskAnalysis(alert)}
                                disabled={processingStep !== 'idle'}
                                className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <TrendingUp className="w-4 h-4 inline mr-2" />
                                Analyze Risk
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Risk Analysis Result Modal */}
            {riskAnalysis && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => {
                        setRiskAnalysis(null);
                        setPrecautionaryMeasures(null);
                        setProcessingStep('idle');
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 rounded-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Risk Analysis Result</h2>
                            
                            {/* Risk Score */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400 mb-1">Risk Score</p>
                                    <p className="text-3xl font-bold text-red-400">{riskAnalysis.risk_score}/100</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400 mb-1">Risk Level</p>
                                    <p className="text-2xl font-bold text-white">{riskAnalysis.risk_level}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400 mb-1">Disaster Type</p>
                                    <p className="text-2xl font-bold text-white">{riskAnalysis.disaster_type}</p>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Analysis Summary</h3>
                                <p className="text-slate-300">{riskAnalysis.analysis_summary}</p>
                            </div>

                            {/* Affected Population */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400 mb-1">Affected Area</p>
                                    <p className="text-xl font-bold text-white">{riskAnalysis.affected_area_km2} km²</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400 mb-1">Est. Population Affected</p>
                                    <p className="text-xl font-bold text-white">{riskAnalysis.estimated_population_affected.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setRiskAnalysis(null);
                                        setPrecautionaryMeasures(null);
                                        setProcessingStep('idle');
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleRequestPrecautions}
                                    disabled={processingStep === 'generating'}
                                    className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processingStep === 'generating' ? 'Generating...' : 'Generate Precautions'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Precautionary Measures Modal */}
            {precautionaryMeasures && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-slate-900 rounded-2xl border border-slate-800 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Precautionary Measures</h2>
                            
                            {/* Strategy */}
                            <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Overall Strategy</h3>
                                <p className="text-slate-300">{precautionaryMeasures.overall_strategy}</p>
                            </div>

                            {/* Measures */}
                            <div className="space-y-4 mb-6">
                                {precautionaryMeasures.measures.map((measure, index) => (
                                    <div key={measure.measure_id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">{measure.title}</h4>
                                                <p className="text-sm text-slate-400">{measure.category}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                measure.priority === 'IMMEDIATE' ? 'bg-red-500/20 text-red-400' :
                                                measure.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {measure.priority}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 mb-3">{measure.description}</p>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-slate-400">Target Population</p>
                                                <p className="text-white font-semibold">{measure.target_population.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">Duration</p>
                                                <p className="text-white font-semibold">{measure.estimated_duration_hours}h</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">Personnel Needed</p>
                                                <p className="text-white font-semibold">{measure.required_resources.personnel}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setPrecautionaryMeasures(null);
                                    setRiskAnalysis(null);
                                    setProcessingStep('idle');
                                }}
                                className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all font-medium"
                            >
                                Close & Complete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
