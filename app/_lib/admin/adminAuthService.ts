/**
 * Admin Authentication Service
 * Handles admin account creation and authentication
 */

import { apiClient } from '../api/apiClient';

export interface CreateAdminRequest {
    email: string;
    password: string;
    org_name: string;
    full_name: string;
}

export interface AdminAuthResponse {
    user_id: string;
    email: string;
    org_name: string;
    role: 'admin' | 'super_admin';
    access_token: string;
    refresh_token: string;
}

/**
 * Create a new admin account
 * POST /api/admin/auth/create
 */
export async function createAdminAccount(data: CreateAdminRequest): Promise<AdminAuthResponse> {
    const response = await apiClient.post<AdminAuthResponse>('/api/admin/auth/create', data);
    return response.data;
}

/**
 * Admin login
 * POST /api/admin/auth/login
 */
export async function adminLogin(email: string, password: string): Promise<AdminAuthResponse> {
    const response = await apiClient.post<AdminAuthResponse>('/api/admin/auth/login', {
        email,
        password,
    });
    return response.data;
}
