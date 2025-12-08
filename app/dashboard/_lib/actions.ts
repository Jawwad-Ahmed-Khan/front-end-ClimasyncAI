// ============================================
// SIMULATED API ACTIONS
// ============================================
// Mock action functions that simulate API calls
// These will be replaced with real API integration later

import { NGOResources } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// TASK ACTIONS
// ============================================

/**
 * acceptTask
 * NGO accepts a pending task assignment.
 * Changes status: PENDING_ACCEPTANCE → ASSIGNED
 * Used in: Task card, Notification actions
 */
export async function acceptTask(taskId: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    console.log(`[ACTION] Accepting task: ${taskId}`);
    return { success: true, message: 'Task accepted successfully' };
}

/**
 * rejectTask
 * NGO rejects a task assignment.
 * Task returns to UNALLOCATED for reassignment.
 * Used in: Task card, Notification actions
 */
export async function rejectTask(taskId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    console.log(`[ACTION] Rejecting task: ${taskId}`, reason ? `Reason: ${reason}` : '');
    return { success: true, message: 'Task rejected and returned for reassignment' };
}

/**
 * startTask
 * NGO begins working on assigned task.
 * Changes status: ASSIGNED → IN_PROGRESS
 * Used in: Task card
 */
export async function startTask(taskId: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    console.log(`[ACTION] Starting task: ${taskId}`);
    return { success: true, message: 'Task marked as In Progress' };
}

/**
 * updateTaskProgress
 * Updates completion percentage of task.
 * Used in: Task detail modal
 */
export async function updateTaskProgress(taskId: string, progress: number): Promise<{ success: boolean; message: string }> {
    await delay(300);
    console.log(`[ACTION] Updating task ${taskId} progress to ${progress}%`);
    return { success: true, message: `Progress updated to ${progress}%` };
}

/**
 * completeTask
 * Marks task as finished with completion notes.
 * Changes status: IN_PROGRESS → COMPLETED
 * Used in: Task detail modal
 */
export async function completeTask(
    taskId: string,
    notes: string,
    proofImageUrl?: string
): Promise<{ success: boolean; message: string }> {
    await delay(800);
    console.log(`[ACTION] Completing task: ${taskId}`, { notes, proofImageUrl });
    return { success: true, message: 'Task completed successfully' };
}

// ============================================
// NOTIFICATION ACTIONS
// ============================================

/**
 * markNotificationRead
 * Marks single notification as read.
 * Used in: Clicking notification item
 */
export async function markNotificationRead(notificationId: string): Promise<{ success: boolean }> {
    await delay(200);
    console.log(`[ACTION] Marking notification read: ${notificationId}`);
    return { success: true };
}

/**
 * markAllNotificationsRead
 * Marks all notifications as read.
 * Used in: "Mark All Read" button
 */
export async function markAllNotificationsRead(): Promise<{ success: boolean; count: number }> {
    await delay(500);
    console.log('[ACTION] Marking all notifications as read');
    return { success: true, count: 15 };
}

/**
 * acknowledgeTaskUpdate
 * Confirms NGO has seen task modification.
 * Used in: TASK_UPDATED notification action
 */
export async function acknowledgeTaskUpdate(
    notificationId: string,
    taskId: string
): Promise<{ success: boolean; message: string }> {
    await delay(300);
    console.log(`[ACTION] Acknowledging task update: ${taskId} (notification: ${notificationId})`);
    return { success: true, message: 'Update acknowledged' };
}

// ============================================
// RESOURCE MANAGEMENT
// ============================================

/**
 * updateResources
 * Updates NGO's available resources.
 * Used in: Resources tab form submission
 */
export async function updateResources(
    resources: Partial<NGOResources>
): Promise<{ success: boolean; message: string; updatedAt: Date }> {
    await delay(800);
    console.log('[ACTION] Updating resources:', resources);
    return {
        success: true,
        message: 'Resources updated successfully',
        updatedAt: new Date(),
    };
}

// ============================================
// PROFILE ACTIONS
// ============================================

/**
 * updateProfile
 * Updates NGO profile information.
 * Used in: Profile tab form submission
 */
export async function updateProfile(
    profileData: Record<string, unknown>
): Promise<{ success: boolean; message: string }> {
    await delay(800);
    console.log('[ACTION] Updating profile:', profileData);
    return { success: true, message: 'Profile updated successfully' };
}

/**
 * changePassword
 * Changes account password.
 * Used in: Profile tab settings
 */
export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean; message: string }> {
    await delay(600);
    console.log('[ACTION] Changing password');
    if (currentPassword === 'wrong') {
        return { success: false, message: 'Current password is incorrect' };
    }
    return { success: true, message: 'Password changed successfully' };
}

// ============================================
// AREAS MANAGEMENT
// ============================================

/**
 * addSpecialization
 * Adds a new specialization to NGO.
 * Used in: Areas tab
 */
export async function addSpecialization(name: string): Promise<{ success: boolean; id: string }> {
    await delay(400);
    const id = `spec-${Date.now()}`;
    console.log(`[ACTION] Adding specialization: ${name}`);
    return { success: true, id };
}

/**
 * removeSpecialization
 * Removes a specialization from NGO.
 * Used in: Areas tab
 */
export async function removeSpecialization(id: string): Promise<{ success: boolean }> {
    await delay(300);
    console.log(`[ACTION] Removing specialization: ${id}`);
    return { success: true };
}

/**
 * addOperationalArea
 * Adds a new operational area.
 * Used in: Areas tab
 */
export async function addOperationalArea(
    district: string,
    province: string
): Promise<{ success: boolean; id: string }> {
    await delay(400);
    const id = `area-${Date.now()}`;
    console.log(`[ACTION] Adding operational area: ${district}, ${province}`);
    return { success: true, id };
}

/**
 * removeOperationalArea
 * Removes an operational area.
 * Used in: Areas tab
 */
export async function removeOperationalArea(id: string): Promise<{ success: boolean }> {
    await delay(300);
    console.log(`[ACTION] Removing operational area: ${id}`);
    return { success: true };
}
