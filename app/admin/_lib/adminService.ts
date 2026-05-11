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
  return data;
}

export async function fetchDisasterById(
  eventId: string
): Promise<DisasterEvent> {
  const { data } = await apiClient.get(`/disasters/${eventId}`);
  return data;
}

// ============================================
// CROSS-MODULE: ALERTS (used by admin pages)
// ============================================

export async function fetchAlerts(): Promise<Alert[]> {
  const { data } = await apiClient.get("/alerts/");
  return data;
}

// ============================================
// CROSS-MODULE: TASKS (used by admin pages)
// ============================================

export async function fetchTasks(): Promise<AdminTask[]> {
  const { data } = await apiClient.get("/tasks/");
  return data;
}

export async function fetchTasksByEvent(
  eventId: string
): Promise<AdminTask[]> {
  const { data } = await apiClient.get(`/tasks/event/${eventId}`);
  return data;
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
