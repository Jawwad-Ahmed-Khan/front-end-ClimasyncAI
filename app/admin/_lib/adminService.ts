/**
 * ClimaSync.AI — Admin Service
 *
 * Centralized API layer for the Admin Dashboard.
 * All calls go through the shared apiClient which handles auth tokens.
 */

import { apiClient } from "@/app/_lib/apiClient";
import type {
  AdminStats,
  Alert,
  AdminTask,
  DisasterEvent,
  NGOWithPerformance,
  SocialPost,
  Conversation,
  Message,
  ReportData,
} from "./adminTypes";

// ============================================
// ADMIN - DASHBOARD STATS
// ============================================

export async function fetchDashboardStats(): Promise<AdminStats> {
  const { data } = await apiClient.get("/admin/stats");
  return data;
}

// ============================================
// ADMIN - REPORTS
// ============================================

export async function fetchGlobalReport() {
  const { data } = await apiClient.get("/admin/reports");
  return data;
}

export async function fetchDetailedReport(): Promise<ReportData> {
  const { data } = await apiClient.get("/admin/reports/detailed");
  return data;
}

// ============================================
// ADMIN - NGOs
// ============================================

export async function fetchNGOs(
  status?: string,
  limit = 100,
  offset = 0
): Promise<NGOWithPerformance[]> {
  const { data } = await apiClient.get("/admin/ngos", {
    params: { status, limit, offset },
  });
  return data;
}

export async function fetchNGODetails(
  ngoId: string
): Promise<NGOWithPerformance> {
  const { data } = await apiClient.get(`/admin/ngos/${ngoId}/details`);
  return data;
}

export async function updateNGOVerification(
  ngoId: string,
  payload: { verification_status: string; reason?: string }
) {
  const { data } = await apiClient.patch(
    `/admin/ngos/${ngoId}/status`,
    payload
  );
  return data;
}

// ============================================
// ADMIN - AUDIT LOGS
// ============================================

export async function fetchAuditLogs(limit = 100, offset = 0) {
  const { data } = await apiClient.get("/admin/audit-logs", {
    params: { limit, offset },
  });
  return data;
}

// ============================================
// ADMIN - MESSAGING
// ============================================

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get("/admin/messages/conversations");
  return data;
}

export async function fetchConversationMessages(
  conversationId: string,
  limit = 50,
  offset = 0
): Promise<Message[]> {
  const { data } = await apiClient.get(
    `/admin/messages/conversations/${conversationId}`,
    { params: { limit, offset } }
  );
  return data;
}

export async function sendMessage(payload: {
  receiver_id: string;
  content: string;
}): Promise<Message> {
  const { data } = await apiClient.post("/admin/messages/send", payload);
  return data;
}

export async function markConversationRead(conversationId: string) {
  const { data } = await apiClient.post(
    `/admin/messages/conversations/${conversationId}/read`
  );
  return data;
}

// ============================================
// CROSS-MODULE: DISASTERS (used by admin pages)
// ============================================

export async function fetchDisasters(): Promise<DisasterEvent[]> {
  const { data } = await apiClient.get("/disasters/");
  return data.map((d: any) => ({
    id: d.event_id,
    alertId: d.source_alert_id,
    title: d.title,
    description: d.description || "",
    type: d.event_type,
    status: d.event_status,
    location: { lat: 30, lng: 70 },
    locationName: d.location_name || d.district || "Unknown",
    province: d.province || "Unknown",
    severityScore: d.severity_score,
    riskLevel: d.risk_level,
    affectedPopulation: d.affected_population || 0,
    estimatedDamage: d.estimated_damage_pkr || 0,
    precautions: d.precautions || [],
    totalTasks: d.total_tasks || 0,
    completedTasks: d.completed_tasks || 0,
    inProgressTasks: d.in_progress_tasks || 0,
    unallocatedTasks: d.unallocated_tasks || 0,
    detectedAt: new Date(d.detected_at),
    verifiedAt: d.verified_at ? new Date(d.verified_at) : undefined,
    analyzedAt: d.analyzed_at ? new Date(d.analyzed_at) : undefined,
    resolvedAt: d.resolved_at ? new Date(d.resolved_at) : undefined,
  }));
}

export async function fetchDisasterById(
  eventId: string
): Promise<DisasterEvent> {
  const { data } = await apiClient.get(`/disasters/${eventId}`);
  const d = data;
  return {
    id: d.event_id,
    alertId: d.source_alert_id,
    title: d.title,
    description: d.description || "",
    type: d.event_type,
    status: d.event_status,
    location: { lat: 30, lng: 70 },
    locationName: d.location_name || d.district || "Unknown",
    province: d.province || "Unknown",
    severityScore: d.severity_score,
    riskLevel: d.risk_level,
    affectedPopulation: d.affected_population || 0,
    estimatedDamage: d.estimated_damage_pkr || 0,
    precautions: d.precautions || [],
    totalTasks: d.total_tasks || 0,
    completedTasks: d.completed_tasks || 0,
    inProgressTasks: d.in_progress_tasks || 0,
    unallocatedTasks: d.unallocated_tasks || 0,
    detectedAt: new Date(d.detected_at),
    verifiedAt: d.verified_at ? new Date(d.verified_at) : undefined,
    analyzedAt: d.analyzed_at ? new Date(d.analyzed_at) : undefined,
    resolvedAt: d.resolved_at ? new Date(d.resolved_at) : undefined,
  };
}

// ============================================
// CROSS-MODULE: ALERTS (used by admin pages)
// ============================================

export async function fetchAlerts(): Promise<Alert[]> {
  const { data } = await apiClient.get("/alerts/");
  return data.map((backendAlert: any) => ({
    id: backendAlert.alert_id,
    title: backendAlert.title,
    type: backendAlert.alert_type,
    source: backendAlert.source_type,
    status: backendAlert.status,
    location: { lat: 30, lng: 70 }, // Default if parsing WKT is complex, or extract
    locationName: backendAlert.location_name || backendAlert.district || "Unknown",
    province: backendAlert.province || "Unknown",
    severity: backendAlert.severity_score,
    confidence: backendAlert.confidence_score,
    detectedAt: new Date(backendAlert.detected_at),
    verifiedAt: backendAlert.verified_at ? new Date(backendAlert.verified_at) : undefined,
    verifiedBy: backendAlert.verified_by,
  }));
}

// ============================================
// CROSS-MODULE: TASKS (used by admin pages)
// ============================================

export async function fetchTasks(): Promise<AdminTask[]> {
  const { data } = await apiClient.get("/tasks/");
  return data.map((t: any) => ({
    id: t.task_id,
    label: t.label,
    description: t.description || "",
    taskType: t.task_type,
    disasterType: t.disaster_type,
    disasterId: t.disaster_event_id,
    disasterTitle: t.disaster_title || "Unknown Disaster",
    requiredQuantity: t.required_quantity || 1,
    priority: t.priority,
    targetLocation: { lat: 30, lng: 70 },
    targetLocationName: t.target_location_name || "Unknown",
    estimatedDuration: t.estimated_duration_hours,
    status: t.status,
    createdBy: t.created_by_type || "ADMIN",
    assignedNgoId: t.assigned_ngo_id,
    assignedNgoName: t.assigned_ngo_name,
    createdAt: new Date(t.created_at),
    startedAt: t.started_at ? new Date(t.started_at) : undefined,
    completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
  }));
}

export async function fetchTasksByEvent(
  eventId: string
): Promise<AdminTask[]> {
  const { data } = await apiClient.get(`/tasks/event/${eventId}`);
  return data.map((t: any) => ({
    id: t.task_id,
    label: t.label,
    description: t.description || "",
    taskType: t.task_type,
    disasterType: t.disaster_type,
    disasterId: t.disaster_event_id,
    disasterTitle: t.disaster_title || "Unknown Disaster",
    requiredQuantity: t.required_quantity || 1,
    priority: t.priority,
    targetLocation: { lat: 30, lng: 70 },
    targetLocationName: t.target_location_name || "Unknown",
    estimatedDuration: t.estimated_duration_hours,
    status: t.status,
    createdBy: t.created_by_type || "ADMIN",
    assignedNgoId: t.assigned_ngo_id,
    assignedNgoName: t.assigned_ngo_name,
    createdAt: new Date(t.created_at),
    startedAt: t.started_at ? new Date(t.started_at) : undefined,
    completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
  }));
}

export async function createTask(payload: Record<string, unknown>) {
  const { data } = await apiClient.post("/tasks/", payload);
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  payload: Record<string, unknown>
) {
  const { data } = await apiClient.patch(`/tasks/${taskId}`, payload);
  return data;
}

// ============================================
// CROSS-MODULE: SOCIAL POSTS (used by admin pages)
// ============================================

export async function fetchSocialPosts(): Promise<SocialPost[]> {
  const { data } = await apiClient.get("/social/");
  return data;
}

export async function createSocialPost(payload: Record<string, unknown>) {
  const { data } = await apiClient.post("/social/", payload);
  return data;
}

export async function updateSocialPost(
  postId: string,
  payload: Record<string, unknown>
) {
  const { data } = await apiClient.patch(`/social/${postId}`, payload);
  return data;
}

export async function deleteSocialPost(postId: string) {
  const { data } = await apiClient.delete(`/social/${postId}`);
  return data;
}
