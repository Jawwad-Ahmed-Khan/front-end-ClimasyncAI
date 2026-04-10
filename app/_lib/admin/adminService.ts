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

export async function getAdminNgos(status?: NgoStatus, limit = 100, offset = 0): Promise<NgoProfileSnapshot[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const response = await apiClient.get<NgoProfileSnapshot[]>(`/admin/ngos?${params.toString()}`);
  return response.data;
}

export async function verifyAdminNgo(ngoId: string, data: NgoVerificationUpdate): Promise<NgoProfileSnapshot> {
  const response = await apiClient.patch<NgoProfileSnapshot>(`/admin/ngos/${ngoId}/status`, data);
  return response.data;
}

export async function getAdminAuditLogs(limit = 100, offset = 0): Promise<AuditLogResponse[]> {
  const response = await apiClient.get<AuditLogResponse[]>(`/admin/audit-logs?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function getAdminGlobalReport(): Promise<AdminReportResponse> {
  const response = await apiClient.get<AdminReportResponse>("/admin/reports");
  return response.data;
}
