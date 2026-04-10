/**
 * ClimaSync.AI — Tasks API Types
 */

export type TaskStatus = 'UNALLOCATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskResponse {
    task_id: string;
    event_id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    required_role: string;
    latitude: number;
    longitude: number;
    assigned_to?: string;
    progress_percentage: number;
    completion_notes?: string;
    created_at: string;
    updated_at: string;
}

export interface TaskUpdatePayload {
    status?: TaskStatus;
    progress_percentage?: number;
    completion_notes?: string;
}
