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
// Resilient API helper — returns fallback on network/auth/timeout errors
// ---------------------------------------------------------------------------
async function resilientCall<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      console.warn(`⚠️ [${label}] Auth error (${status}) — please log in. Returning fallback.`);
    } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
      console.warn(`⚠️ [${label}] Request timed out — returning fallback.`);
    } else if (err?.message === 'Network Error') {
      console.warn(`⚠️ [${label}] Network error — backend may be unreachable.`);
    } else {
      console.error(`❌ [${label}] Unexpected error:`, err);
    }
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export async function getLiveAlerts(limit = 100, offset = 0): Promise<AlertData[]> {
  return resilientCall(
    async () => {
      const response = await apiClient.get<AlertData[]>(`alerts?limit=${limit}&offset=${offset}`);
      return response.data;
    },
    [],
    'getLiveAlerts'
  );
}

export async function verifyAlert(alertId: string, data: AlertUpdateData): Promise<AlertData> {
  const response = await apiClient.patch<AlertData>(`alerts/${alertId}/status`, data);
  return response.data;
}

// ---------------------------------------------------------------------------
// Disaster Events
// ---------------------------------------------------------------------------

export async function getActiveDisasters(limit = 100, offset = 0): Promise<DisasterEventData[]> {
  return resilientCall(
    async () => {
      const response = await apiClient.get<DisasterEventData[]>(`disasters?limit=${limit}&offset=${offset}`);
      return response.data;
    },
    [],
    'getActiveDisasters'
  );
}

export async function getDisasterById(eventId: string): Promise<DisasterEventData> {
    const response = await apiClient.get<DisasterEventData>(`disasters/${eventId}`);
    return response.data;
}
