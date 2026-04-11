// ============================================
// REAL API ACTIONS
// ============================================

import { NGOResources } from './types';
import { updateTask } from '@/app/_lib/tasks/taskService';
import { markNotificationsRead as apiMarkRead, markAllNotificationsRead as apiMarkAllRead } from '@/app/_lib/notifications/notificationService';
import { updateResourceCapacity, addOperationalArea as apiAddArea, removeOperationalArea as apiRemoveArea, addSpecialization as apiAddSpec, removeSpecialization as apiRemoveSpec } from '@/app/_lib/resources/resourceService';
import { apiClient } from '@/app/_lib/apiClient';

// ============================================
// TASK ACTIONS
// ============================================

export async function acceptTask(taskId: string): Promise<{ success: boolean; message: string }> {
    await updateTask(taskId, { status: 'assigned' as any });
    return { success: true, message: 'Task accepted successfully' };
}

export async function rejectTask(taskId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    await updateTask(taskId, { status: 'unallocated' as any, change_reason: reason });
    return { success: true, message: 'Task rejected and returned for reassignment' };
}

export async function startTask(taskId: string): Promise<{ success: boolean; message: string }> {
    await updateTask(taskId, { status: 'in_progress' as any });
    return { success: true, message: 'Task marked as In Progress' };
}

export async function updateTaskProgress(taskId: string, progress: number): Promise<{ success: boolean; message: string }> {
    await updateTask(taskId, { progress });
    return { success: true, message: `Progress updated to ${progress}%` };
}

export async function completeTask(
    taskId: string,
    notes: string,
    proofImageUrl?: string
): Promise<{ success: boolean; message: string }> {
    await updateTask(taskId, { status: 'completed' as any, completion_notes: notes, proof_image_url: proofImageUrl });
    return { success: true, message: 'Task completed successfully' };
}

// ============================================
// NOTIFICATION ACTIONS
// ============================================

export async function markNotificationRead(notificationId: string): Promise<{ success: boolean }> {
    await apiMarkRead([notificationId]);
    return { success: true };
}

export async function markAllNotificationsRead(): Promise<{ success: boolean; count: number }> {
    await apiMarkAllRead();
    return { success: true, count: 0 };
}

export async function acknowledgeTaskUpdate(
    notificationId: string,
    taskId: string
): Promise<{ success: boolean; message: string }> {
    await apiMarkRead([notificationId]);
    return { success: true, message: 'Update acknowledged' };
}

// ============================================
// RESOURCE MANAGEMENT
// ============================================

export async function updateResources(
    resources: Partial<NGOResources>
): Promise<{ success: boolean; message: string; updatedAt: Date }> {
    const payload: any = {};
    if (resources.ambulances !== undefined) payload.ambulances = resources.ambulances;
    if (resources.rescueBoats !== undefined) payload.rescue_boats = resources.rescueBoats;
    if (resources.trucks !== undefined) payload.trucks = resources.trucks;
    if (resources.fourWheelVehicles !== undefined) payload.four_wheel_vehicles = resources.fourWheelVehicles;
    if (resources.cranes !== undefined) payload.cranes = resources.cranes;
    if (resources.doctors !== undefined) payload.doctors = resources.doctors;
    if (resources.paramedics !== undefined) payload.paramedics = resources.paramedics;
    if (resources.rescueDivers !== undefined) payload.rescue_divers = resources.rescueDivers;
    if (resources.volunteersAvailable !== undefined) payload.volunteers_available = resources.volunteersAvailable;
    if (resources.foodPacketsCapacity !== undefined) payload.food_packets_capacity = resources.foodPacketsCapacity;
    if (resources.shelterCapacity !== undefined) payload.shelter_capacity = resources.shelterCapacity;

    await updateResourceCapacity(payload);
    return {
        success: true,
        message: 'Resources updated successfully',
        updatedAt: new Date(),
    };
}

// ============================================
// PROFILE ACTIONS
// ============================================

export async function updateProfile(
    profileData: Record<string, unknown>
): Promise<{ success: boolean; message: string }> {
    await apiClient.patch('/auth/me', profileData);
    return { success: true, message: 'Profile updated successfully' };
}

export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean; message: string }> {
    // Auth endpoints usually have a specific password change endpoint. 
    // Assuming /auth/password
    try {
        await apiClient.put('/auth/password', { current_password: currentPassword, new_password: newPassword });
        return { success: true, message: 'Password changed successfully' };
    } catch {
        return { success: false, message: 'Current password is incorrect or request failed' };
    }
}

// ============================================
// AREAS MANAGEMENT
// ============================================

export async function addSpecialization(name: string): Promise<{ success: boolean; id: string }> {
    const res = await apiAddSpec(name);
    return { success: true, id: res.id };
}

export async function removeSpecialization(id: string): Promise<{ success: boolean }> {
    await apiRemoveSpec(id);
    return { success: true };
}

export async function addOperationalArea(
    district: string,
    province: string
): Promise<{ success: boolean; id: string }> {
    const res = await apiAddArea(province, district);
    return { success: true, id: res.id };
}

export async function removeOperationalArea(id: string): Promise<{ success: boolean }> {
    await apiRemoveArea(id);
    return { success: true };
}
