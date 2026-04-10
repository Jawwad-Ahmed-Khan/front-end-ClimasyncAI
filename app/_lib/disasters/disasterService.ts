/**
 * ClimaSync.AI — Disaster API Service Layer
 */
import { apiClient } from "../apiClient";
import type { 
  AlertData, 
  AlertUpdateData,
  DisasterEventData,
} from "./disasterTypes";

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export async function getLiveAlerts(limit = 100, offset = 0): Promise<AlertData[]> {
  const response = await apiClient.get<AlertData[]>(`/disasters/alerts?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function verifyAlert(alertId: string, data: AlertUpdateData): Promise<AlertData> {
  const response = await apiClient.patch<AlertData>(`/disasters/alerts/${alertId}/status`, data);
  return response.data;
}

// ---------------------------------------------------------------------------
// Disaster Events
// ---------------------------------------------------------------------------

export async function getActiveDisasters(limit = 100, offset = 0): Promise<DisasterEventData[]> {
  const response = await apiClient.get<DisasterEventData[]>(`/disasters?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function getDisasterById(eventId: string): Promise<DisasterEventData> {
    const response = await apiClient.get<DisasterEventData>(`/disasters/${eventId}`);
    return response.data;
}
