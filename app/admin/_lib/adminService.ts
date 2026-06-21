/**
 * ClimaSync.AI — Admin Service
 *
 * Centralized API layer for the Admin Dashboard.
 * All calls go through the shared apiClient which handles auth tokens.
 */

import { apiClient } from "@/app/_lib/apiClient";
import type { AxiosError } from "axios";

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
  return resilientCall(
    async () => { const { data } = await apiClient.get("admin/stats"); return data; },
    { total_users: 0, total_ngos: 0, pending_ngos: 0, total_alerts: 0, active_disasters: 0, system_health: 'ok', generated_at: new Date().toISOString() } as unknown as AdminStats,
    'fetchDashboardStats'
  );
}

// ============================================
// ADMIN - RISK ANALYSIS
// ============================================

export async function triggerRiskAnalysis(alert: Alert) {
    try {
        const payload = {
            breach_id: alert.id,
            disaster_kind: alert.type === 'EARTHQUAKE' ? 'earthquake' : 'flood',
            location_name: alert.locationName || "Unknown Location",
            district: alert.rawData?.district || "Unknown District",
            province: alert.rawData?.province || alert.province || "khyber_pakhtunkhwa",
            latitude: alert.location.lat !== 0 ? alert.location.lat : 35.48,
            longitude: alert.location.lng !== 0 ? alert.location.lng : 72.58,
            observed_value: alert.severity || 4.5,
            threshold_value: 4.0,
            breach_severity: alert.severity > 7 ? "critical" : "warning",
            metric_name: "water_level_meters",
            observation_time: alert.detectedAt.toISOString(),
            source_api: "usgs",
            is_forecast_breach: false,
            forecast_horizon_h: null,
            gauge_id: null,
            usgs_event_id: null,
            weather_location_id: null
        };

        const { data } = await apiClient.post("risk-analysis/assess", payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
            console.error("API Validation Error (422) - Payload sent:", payload);
            console.error("API Validation Error (422) - Details:", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

// ============================================
// ADMIN - REPORTS
// ============================================

export async function fetchGlobalReport() {
  const { data } = await apiClient.get("admin/reports");
  return data;
}

export async function fetchDetailedReport(): Promise<ReportData> {
  const { data } = await apiClient.get("admin/reports/detailed");
  return {
    totalDisasters: data.total_disasters || 0,
    totalTasks: data.total_tasks || 0,
    avgCompletionRate: data.avg_completion_rate || 0,
    disastersByType: (data.disasters_by_type || []).map((d: any) => ({
      type: d.type,
      count: d.count,
    })),
    tasksOverTime: (data.tasks_over_time || []).map((t: any) => ({
      date: t.date,
      completed: t.completed,
    })),
    ngoLeaderboard: (data.ngo_leaderboard || []).map((n: any) => ({
      ngoId: n.ngo_id,
      orgName: n.org_name,
      tasksCompleted: n.tasks_completed || 0,
      rating: n.rating || 0,
    })),
  };
}

// ============================================
// ADMIN - NGOs
// ============================================

export async function fetchNGOs(
  status?: string,
  limit = 100,
  offset = 0
): Promise<NGOWithPerformance[]> {
  const params = new URLSearchParams();
  if (status && status !== 'ALL') params.append("status", status.toLowerCase());
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  return resilientCall(
    async () => { const { data } = await apiClient.get(`admin/ngos?${params.toString()}`); return data; },
    [],
    'fetchNGOs'
  );
}

export async function fetchNGODetails(
  ngoId: string
): Promise<NGOWithPerformance> {
  const { data } = await apiClient.get(`admin/ngos/${ngoId}/details`);
  return data;
}

export async function updateNGOVerification(
  ngoId: string,
  payload: { verification_status: string; reason?: string }
) {
  const { data } = await apiClient.patch(
    `admin/ngos/${ngoId}/status`,
    payload
  );
  return data;
}

// ============================================
// ADMIN - AUDIT LOGS
// ============================================

export async function fetchAuditLogs(limit = 100, offset = 0) {
  const { data } = await apiClient.get("admin/audit-logs", {
    params: { limit, offset },
  });
  return data;
}

// ============================================
// ADMIN - MESSAGING
// ============================================

export async function fetchConversations(): Promise<Conversation[]> {
  return resilientCall(
    async () => { const { data } = await apiClient.get("admin/messages/conversations"); return data; },
    [],
    'fetchConversations'
  );
}

export async function fetchConversationMessages(
  conversationId: string,
  limit = 50,
  offset = 0
): Promise<Message[]> {
  const { data } = await apiClient.get(
    `admin/messages/conversations/${conversationId}`,
    { params: { limit, offset } }
  );
  return data;
}

export async function sendMessage(payload: {
  receiver_id: string;
  content: string;
}): Promise<Message> {
  const { data } = await apiClient.post("admin/messages/send", payload);
  return data;
}

export async function markConversationRead(conversationId: string) {
  const { data } = await apiClient.post(
    `admin/messages/conversations/${conversationId}/read`
  );
  return data;
}

// ============================================
// CROSS-MODULE: DISASTERS (used by admin pages)
// ============================================

export async function fetchDisasters(): Promise<DisasterEvent[]> {
  return resilientCall(
    async () => {
      const { data } = await apiClient.get("disasters");
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
    },
    [],
    'fetchDisasters'
  );
}

export async function fetchDisasterById(
  eventId: string
): Promise<DisasterEvent> {
  const { data } = await apiClient.get(`disasters/${eventId}`);
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
  const { data } = await apiClient.get("alerts");
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
  return resilientCall(
    async () => {
      const { data } = await apiClient.get("tasks?limit=100&offset=0");
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
    },
    [],
    'fetchTasks'
  );
}

export async function fetchTasksByEvent(
  eventId: string
): Promise<AdminTask[]> {
  const { data } = await apiClient.get(`tasks/event/${eventId}`);
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
  const { data } = await apiClient.post("tasks", payload);
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  payload: Record<string, unknown>
) {
  const { data } = await apiClient.patch(`tasks/${taskId}`, payload);
  return data;
}

// ============================================
// CROSS-MODULE: SOCIAL POSTS (used by admin pages)
// ============================================

export async function fetchSocialPosts(): Promise<SocialPost[]> {
  const { data } = await apiClient.get("social");
  return data.map((p: any) => ({
    id: p.social_post_id,
    content: p.content_text || "",
    status: p.status.toUpperCase() as SocialPostStatus,
    platforms: p.platforms.map((plt: string) => plt.toUpperCase() as SocialPlatform),
    disasterId: p.event_id,
    disasterTitle: "Disaster Alert", // Usually enriched in view or separate call
    engagement: {
      views: p.engagement_views || 0,
      likes: p.engagement_likes || 0,
      shares: p.engagement_shares || 0,
      comments: p.engagement_comments || 0,
    },
    createdAt: new Date(p.created_at),
  }));
}

export async function createSocialPost(payload: Record<string, unknown>) {
  const { data } = await apiClient.post("social", payload);
  return data;
}

export async function updateSocialPost(
  postId: string,
  payload: Record<string, unknown>
) {
  const { data } = await apiClient.patch(`social/${postId}`, payload);
  return data;
}

export async function deleteSocialPost(postId: string) {
  const { data } = await apiClient.delete(`social/${postId}`);
  return data;
}
