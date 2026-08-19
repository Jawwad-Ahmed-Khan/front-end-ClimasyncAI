/**
 * Risk Analysis Service
 * Handles risk analysis requests from admin to backend
 */

import { apiClient } from '../api/apiClient';

export interface RiskAnalysisRequest {
    alert_id: string;
    location: {
        latitude: number;
        longitude: number;
        location_name: string;
        province: string;
    };
    sensor_data: {
        sensor_type: string;
        current_value: number;
        threshold_value: number;
    };
    historical_data?: any;
}

export interface RiskAnalysisResponse {
    analysis_id: string;
    alert_id: string;
    risk_score: number; // 0-100
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    disaster_type: 'FLOOD' | 'EARTHQUAKE' | 'HEATWAVE' | 'STORM' | 'DROUGHT';
    affected_area_km2: number;
    estimated_population_affected: number;
    confidence_score: number; // 0-100
    analysis_summary: string;
    detailed_analysis: {
        severity_factors: string[];
        vulnerability_assessment: string;
        historical_comparison: string;
        prediction_model_output: any;
    };
    recommended_actions: string[];
    timestamp: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

/**
 * Request risk analysis from Risk Analysis Agent
 * POST /api/admin/risk-analysis/request
 */
export async function requestRiskAnalysis(
    data: RiskAnalysisRequest
): Promise<{ analysis_id: string; status: string }> {
    const response = await apiClient.post<{ analysis_id: string; status: string }>(
        '/api/admin/risk-analysis/request',
        data
    );
    return response.data;
}

/**
 * Get risk analysis result
 * GET /api/admin/risk-analysis/:analysisId
 */
export async function getRiskAnalysisResult(analysisId: string): Promise<RiskAnalysisResponse> {
    const response = await apiClient.get<RiskAnalysisResponse>(
        `/api/admin/risk-analysis/${analysisId}`
    );
    return response.data;
}

/**
 * Get all risk analyses
 * GET /api/admin/risk-analysis
 */
export async function getAllRiskAnalyses(
    status?: string,
    limit: number = 50
): Promise<{ analyses: RiskAnalysisResponse[]; total_count: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());

    const response = await apiClient.get<{ analyses: RiskAnalysisResponse[]; total_count: number }>(
        `/api/admin/risk-analysis?${params.toString()}`
    );
    return response.data;
}
