/**
 * ClimaSync.AI — Tasks API Service Layer
 */
import { apiClient } from "../apiClient";
import type { TaskResponse, TaskUpdatePayload } from "./taskTypes";

export async function getTasks(limit = 100, offset = 0): Promise<TaskResponse[]> {
  const response = await apiClient.get<TaskResponse[]>(`/tasks?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function getTaskById(taskId: string): Promise<TaskResponse> {
  const response = await apiClient.get<TaskResponse>(`/tasks/${taskId}`);
  return response.data;
}

export async function updateTask(taskId: string, payload: TaskUpdatePayload): Promise<TaskResponse> {
  const response = await apiClient.patch<TaskResponse>(`/tasks/${taskId}`, payload);
  return response.data;
}
