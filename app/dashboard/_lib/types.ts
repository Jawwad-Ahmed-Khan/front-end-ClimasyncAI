// ============================================
// NGO DASHBOARD TYPES
// ============================================
// All TypeScript interfaces for the NGO Dashboard
// These types define the structure of data used throughout the dashboard

// ============================================
// ENUMS & TYPE DEFINITIONS
// ============================================

/**
 * Task status flow: PENDING_ACCEPTANCE → ASSIGNED → IN_PROGRESS → COMPLETED
 * Used in: Task cards, filtering, status badges
 */
export type TaskStatus = 'PENDING_ACCEPTANCE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * Priority levels for tasks
 * Used in: Priority badges, filtering, sorting
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Types of tasks that can be assigned to NGOs
 * Used in: Task icons, filtering
 */
export type TaskType = 'AMBULANCE' | 'BOAT' | 'MEDICAL' | 'FOOD' | 'EVACUATION' | 'SHELTER';

/**
 * Types of disasters in Pakistan
 * Used in: Task context, map markers, filtering
 */
export type DisasterType = 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'DROUGHT' | 'HEATWAVE';

/**
 * Notification types from admin/system
 * Used in: Notification icons, filtering
 */
export type NotificationType = 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'URGENT_REQUEST' | 'DISASTER_ALERT' | 'SYSTEM';

// ============================================
// INTERFACES
// ============================================

/**
 * NGO Profile - Organization details for registered NGOs
 * Used in: Welcome banner, Profile tab, Settings
 */
export interface NGOProfile {
    id: string;
    orgName: string;
    registrationNumber: string;
    headOfOperations: string;
    phone: string;
    email: string;
    baseCity: string;
    baseDistrict: string;
    baseProvince: string;
    baseLocation: { lat: number; lng: number };
    serviceRadiusKm: number;
    isVerified: boolean;
    createdAt: Date;
}

/**
 * Task - A disaster response task assigned to an NGO
 * Used in: Tasks tab, Home tab, Notifications
 */
export interface Task {
    id: string;
    label: string;
    description: string;
    taskType: TaskType;
    disasterType: DisasterType;
    requiredQuantity: number;
    priority: TaskPriority;
    targetLocation: { lat: number; lng: number };
    targetLocationName: string;
    status: TaskStatus;
    assignedAt: Date;
    completedAt?: Date;
    eventId: string;
    eventTitle: string;
    progress?: number;
}

/**
 * Notification - Messages from admin or system
 * Used in: Notifications tab, Home tab recent list
 */
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    relatedTaskId?: string;
    relatedEventId?: string;
    changes?: { field: string; oldValue: string; newValue: string }[];
    createdAt: Date;
}

/**
 * NGO Resources - Inventory of available resources
 * Used in: Resources tab
 */
export interface NGOResources {
    ambulances: number;
    rescueBoats: number;
    trucks: number;
    fourWheelVehicles: number;
    cranes: number;
    doctors: number;
    paramedics: number;
    rescueDivers: number;
    volunteersAvailable: number;
    foodPacketsCapacity: number;
    shelterCapacity: number;
    lastUpdated: Date;
}

/**
 * Dashboard Stats - Summary statistics for home tab
 * Used in: Stat cards on Home tab
 */
export interface DashboardStats {
    activeTasks: number;
    pendingRequests: number;
    completedThisMonth: number;
    responseRate: number;
}

/**
 * Active Disaster - Current disaster events in operational areas
 * Used in: Mini map on Home tab
 */
export interface ActiveDisaster {
    id: string;
    title: string;
    type: DisasterType;
    location: { lat: number; lng: number };
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    affectedPopulation: number;
}

/**
 * Specialization - Areas of expertise for NGO
 * Used in: Areas tab
 */
export interface Specialization {
    id: string;
    name: string;
    icon: string;
}

/**
 * Operational Area - Geographic areas where NGO operates
 * Used in: Areas tab
 */
export interface OperationalArea {
    id: string;
    district: string;
    province: string;
}
