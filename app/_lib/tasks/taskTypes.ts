/**
 * ClimaSync.AI — Tasks API Types
 * Matches backend TaskResponse schema exactly.
 */

export type TaskStatus =
  | "draft"
  | "pending_approval"
  | "unallocated"
  | "pending_acceptance"
  | "assigned"
  | "in_progress"
  | "completed";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskType = "ambulance" | "boat" | "medical" | "food" | "evacuation" | "shelter";

export interface TaskStatusHistoryEntry {
  id: string;
  task_id: string;
  old_status: TaskStatus | null;
  new_status: TaskStatus;
  changed_by: string | null;
  change_reason: string | null;
  created_at: string;
}

export interface TaskResponse {
  task_id: string;
  event_id: string | null;
  task_label: string;
  description: string | null;
  task_type: string;
  required_quantity: number | null;
  priority: string;
  target_location: string | null;
  target_location_name: string | null;
  status: string;
  created_by_type: string;
  admin_approved_by: string | null;
  approved_at: string | null;
  assigned_ngo_id: string | null;
  progress: number;
  estimated_duration_hours: number | null;
  proof_image_url: string | null;
  assigned_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  completion_notes: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  history: TaskStatusHistoryEntry[];
}

export interface TaskUpdatePayload {
  status?: TaskStatus;
  progress?: number;
  proof_image_url?: string;
  completion_notes?: string;
  assigned_ngo_id?: string;
  change_reason?: string;
}
