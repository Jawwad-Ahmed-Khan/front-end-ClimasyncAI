/**
 * Threshold Breach Alert Service
 * Handles threshold breach alerts from Data Collector Agent
 */

import { apiClient } from '../api/apiClient';

export interface ThresholdBreachAlert {
    alert_id: string;
    sensor_type: 'temperature' | 'rainfall' | 'seismic' | 'wind_speed' | 'water_level';
    location: {
        latitude: number;
        longitude: number;
        location_name: string;
        province: string;
    };
    current_value: number;
    threshold_value: number;
    breach_percentage: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: string;
    data_source: string;
    status: 'NEW' | 'ACKNOWLEDGED' | 'ANALYZING' | 'RESOLVED';
}

export interface ThresholdAlertListResponse {
    alerts: ThresholdBreachAlert[];
    total_count: number;
    unacknowledged_count: number;
}

/**
 * Get all threshold breach alerts for admin
 * GET /api/admin/threshold-alerts
 */
export async function getThresholdAlerts(
    status?: string,
    severity?: string,
    limit: number = 50
): Promise<ThresholdAlertListResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    params.append('limit', limit.toString());

    const response = await apiClient.get<ThresholdAlertListResponse>(
        `/api/admin/threshold-alerts?${params.toString()}`
    );
    return response.data;
}

/**
 * Get single threshold alert details
 * GET /api/admin/threshold-alerts/:alertId
 */
export async function getThresholdAlertById(alertId: string): Promise<ThresholdBreachAlert> {
    const response = await apiClient.get<ThresholdBreachAlert>(
        `/api/admin/threshold-alerts/${alertId}`
    );
    return response.data;
}

/**
 * Acknowledge threshold alert
 * POST /api/admin/threshold-alerts/:alertId/acknowledge
 */
export async function acknowledgeThresholdAlert(alertId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
        `/api/admin/threshold-alerts/${alertId}/acknowledge`
    );
    return response.data;
}
