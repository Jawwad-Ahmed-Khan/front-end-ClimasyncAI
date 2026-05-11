/**
 * Precautionary Measures Service
 * Handles precautionary measure requests from frontend to backend
 */

import { apiClient } from '../api/apiClient';

export interface PrecautionaryRequest {
    analysis_id: string;
    risk_analysis_data: {
        risk_score: number;
        risk_level: string;
        disaster_type: string;
        affected_area_km2: number;
        estimated_population_affected: number;
    };
    location: {
        latitude: number;
        longitude: number;
        location_name: string;
        province: string;
    };
}

export interface PrecautionaryMeasure {
    measure_id: string;
    category: 'EVACUATION' | 'SHELTER' | 'MEDICAL' | 'SUPPLIES' | 'COMMUNICATION' | 'INFRASTRUCTURE';
    priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    target_population: number;
    estimated_duration_hours: number;
    required_resources: {
        personnel: number;
        vehicles: number;
        supplies: string[];
    };
    implementation_steps: string[];
}

export interface PrecautionaryResponse {
    precaution_id: string;
    analysis_id: string;
    disaster_type: string;
    risk_level: string;
    measures: PrecautionaryMeasure[];
    overall_strategy: string;
    timeline: {
        immediate_actions: string[];
        short_term_actions: string[];
        long_term_actions: string[];
    };
    estimated_cost: number;
    generated_at: string;
    status: 'PENDING' | 'GENERATED' | 'APPROVED' | 'IMPLEMENTED';
}

/**
 * Request precautionary measures from Precautionary Agent
 * POST /api/precautionary/request
 */
export async function requestPrecautionaryMeasures(
    data: PrecautionaryRequest
): Promise<{ precaution_id: string; status: string }> {
    const response = await apiClient.post<{ precaution_id: string; status: string }>(
        '/api/precautionary/request',
        data
    );
    return response.data;
}

/**
 * Get precautionary measures result
 * GET /api/precautionary/:precautionId
 */
export async function getPrecautionaryMeasures(precautionId: string): Promise<PrecautionaryResponse> {
    const response = await apiClient.get<PrecautionaryResponse>(
        `/api/precautionary/${precautionId}`
    );
    return response.data;
}

/**
 * Get all precautionary measures
 * GET /api/precautionary
 */
export async function getAllPrecautionaryMeasures(
    status?: string,
    limit: number = 50
): Promise<{ precautions: PrecautionaryResponse[]; total_count: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());

    const response = await apiClient.get<{ precautions: PrecautionaryResponse[]; total_count: number }>(
        `/api/precautionary?${params.toString()}`
    );
    return response.data;
}

/**
 * Approve precautionary measures
 * POST /api/precautionary/:precautionId/approve
 */
export async function approvePrecautionaryMeasures(
    precautionId: string
): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
        `/api/precautionary/${precautionId}/approve`
    );
    return response.data;
}
