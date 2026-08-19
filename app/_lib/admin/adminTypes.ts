/**
 * ClimaSync.AI — Admin Types
 */

export type NgoStatus = "pending" | "verified" | "rejected" | "suspended";

export interface NgoProfileSnapshot {
  ngo_id: string;
  org_name: string;
  org_email: string;
  registration_number: string;
  verification_status: NgoStatus;
  rating: number;
}

export interface NgoVerificationUpdate {
  status: NgoStatus;
  admin_notes?: string;
}

export interface AuditLogResponse {
  log_id: string;
  admin_id: string;
  action: string;
  target_id: string;
  target_type: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface AdminReportResponse {
  total_users: number;
  total_ngos: number;
  pending_ngos: number;
  total_alerts: number;
  active_disasters: number;
  system_health: string;
  generated_at: string;
}
