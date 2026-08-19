/**
 * ClimaSync.AI — Notification API Service Layer
 */
import { apiClient } from "../apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface NotificationData {
  notification_id: string;
  user_id: string | null;
  title: string;
  message: string | null;
  notification_type: string;
  related_task_id: string | null;
  related_event_id: string | null;
  changes: unknown[] | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

export async function getNotifications(
  limit = 100,
  offset = 0,
  unreadOnly = false
): Promise<NotificationData[]> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  if (unreadOnly) params.append("unread_only", "true");

  const response = await apiClient.get<NotificationData[]>(
    `/notifications?${params.toString()}`
  );
  return response.data;
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<{ unread_count: number }>(
    "/notifications/unread-count"
  );
  return response.data.unread_count;
}

export async function markNotificationsRead(
  notificationIds: string[]
): Promise<void> {
  await apiClient.post("/notifications/mark-read", {
    notification_ids: notificationIds,
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}
