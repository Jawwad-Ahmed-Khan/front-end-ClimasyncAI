/**
 * ClimaSync.AI — Admin API Service Layer
 */
import { apiClient } from "../apiClient";
import type { 
  NgoProfileSnapshot, 
  NgoVerificationUpdate, 
  AuditLogResponse, 
  AdminReportResponse,
  NgoStatus
} from "./adminTypes";

// ---------------------------------------------------------------------------
// Resilient API helper — returns fallback on network/auth/timeout errors
// ---------------------------------------------------------------------------
async function resilientCall<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      console.warn(`⚠️ [${label}] Auth error (${status}) — returning fallback.`);
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

export async function getAdminNgos(status?: NgoStatus, limit = 100, offset = 0): Promise<NgoProfileSnapshot[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  return resilientCall(
    async () => {
      const response = await apiClient.get<NgoProfileSnapshot[]>(`admin/ngos?${params.toString()}`);
      return response.data;
    },
    [],
    'getAdminNgos'
  );
}

export async function verifyAdminNgo(ngoId: string, data: NgoVerificationUpdate): Promise<NgoProfileSnapshot> {
  const response = await apiClient.patch<NgoProfileSnapshot>(`admin/ngos/${ngoId}/status`, data);
  return response.data;
}

export async function getAdminAuditLogs(limit = 100, offset = 0): Promise<AuditLogResponse[]> {
  return resilientCall(
    async () => {
      const response = await apiClient.get<AuditLogResponse[]>(`admin/audit-logs?limit=${limit}&offset=${offset}`);
      return response.data;
    },
    [],
    'getAdminAuditLogs'
  );
}

export async function getAdminGlobalReport(): Promise<AdminReportResponse> {
  return resilientCall(
    async () => {
      const response = await apiClient.get<AdminReportResponse>("admin/reports");
      return response.data;
    },
    {
      total_users: 0, total_ngos: 0, pending_ngos: 0,
      total_alerts: 0, active_disasters: 0,
      system_health: "ok", generated_at: new Date().toISOString()
    } as AdminReportResponse,
    'getAdminGlobalReport'
  );
}
