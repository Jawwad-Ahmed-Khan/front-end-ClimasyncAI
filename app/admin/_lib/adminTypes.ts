// ============================================
// ADMIN DASHBOARD TYPES
// ============================================
// TypeScript interfaces for the Admin Dashboard
// Separate from NGO types for platform-wide admin control

// ============================================
// ENUMS & TYPE DEFINITIONS
// ============================================

/**
 * Alert sources for disaster detection
 * Used in: Command Center, Incidents tab
 */
export type AlertSource =
    | 'USGS'           // Earthquake data
    | 'OPEN_METEO'     // Weather predictions
    | 'GOOGLE_FLOOD_HUB'  // Flood alerts
    | 'SOCIAL_MEDIA'   // Social media reports
    | 'MANUAL';        // Admin-created alerts

/**
 * Alert/Disaster status flow
 * NEW → VERIFIED → ANALYZING → ACTIVE → MONITORING → RESOLVED
 */
export type AlertStatus =
    | 'NEW'
    | 'VERIFIED'
    | 'ANALYZING'
    | 'ACTIVE'
    | 'MONITORING'
    | 'RESOLVED'
    | 'FALSE_ALARM';

/**
 * Types of disasters in Pakistan
 */
export type DisasterType =
    | 'FLOOD'
    | 'EARTHQUAKE'
    | 'CYCLONE'
    | 'DROUGHT'
    | 'HEATWAVE';

/**
 * Admin task status (extended flow)
 * DRAFT → PENDING_APPROVAL → UNALLOCATED → PENDING_ACCEPTANCE → ASSIGNED → IN_PROGRESS → COMPLETED
 */
export type AdminTaskStatus =
    | 'DRAFT'
    | 'PENDING_APPROVAL'
    | 'UNALLOCATED'
    | 'PENDING_ACCEPTANCE'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'COMPLETED';

/**
 * Task types for disaster response
 */
export type TaskType =
    | 'AMBULANCE'
    | 'BOAT'
    | 'MEDICAL'
    | 'FOOD'
    | 'EVACUATION'
    | 'SHELTER';

/**
 * Priority levels with icons
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Risk levels for disasters
 */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Social media platforms
 */
export type SocialPlatform = 'TWITTER' | 'FACEBOOK' | 'LINKEDIN' | 'TIKTOK';

/**
 * Social post status flow
 */
export type SocialPostStatus = 'QUEUED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';

/**
 * Volunteer capabilities
 */
export type VolunteerCapability =
    | 'HAS_CAR'
    | 'HAS_MOTORCYCLE'
    | 'FIRST_AID'
    | 'OFFERS_SHELTER'
    | 'OFFERS_FOOD';

/**
 * Admin role levels
 */
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';

/**
 * Verification status for NGOs
 */
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';

// ============================================
// INTERFACES
// ============================================

/**
 * Admin Profile - Platform administrator details
 */
export interface AdminProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: AdminRole;
    phone: string;
    department: string;
    lastActiveAt: Date;
    createdAt: Date;
}

/**
 * Real-time Alert - Incoming disaster notifications
 */
export interface Alert {
    id: string;
    title: string;
    type: DisasterType;
    source: AlertSource;
    status: AlertStatus;
    location: { lat: number; lng: number };
    locationName: string;
    province: string;
    rawData?: Record<string, unknown>;
    severity?: number; // 0-10
    confidence: number; // 0-100% confidence score
    detectedAt: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
}

/**
 * Disaster Event - Verified disaster with risk analysis
 */
export interface DisasterEvent {
    id: string;
    alertId: string;
    title: string;
    description: string;
    type: DisasterType;
    status: AlertStatus;
    location: { lat: number; lng: number };
    locationName: string;
    province: string;
    affectedArea?: {
        type: 'Polygon';
        coordinates: number[][][];
    };
    // Risk Analysis Results
    severityScore: number; // 0-10
    riskLevel: RiskLevel;
    affectedPopulation: number;
    estimatedDamage?: number; // in PKR
    precautions: string[];
    // Task Summary
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    unallocatedTasks: number;
    // Timestamps
    detectedAt: Date;
    verifiedAt?: Date;
    analyzedAt?: Date;
    resolvedAt?: Date;
}

/**
 * Admin Task - Task with admin-specific fields
 */
export interface AdminTask {
    id: string;
    label: string;
    description: string;
    taskType: TaskType;
    disasterType: DisasterType;
    disasterId: string;
    disasterTitle: string;
    requiredQuantity: number;
    priority: TaskPriority;
    targetLocation: { lat: number; lng: number };
    targetLocationName: string;
    estimatedDuration?: number; // in hours
    // Admin Fields
    status: AdminTaskStatus;
    createdBy: 'AI' | 'ADMIN';
    approvedBy?: string;
    approvedAt?: Date;
    assignedNgoId?: string;
    assignedNgoName?: string;
    matchingNGOs?: {
        ngoId: string;
        orgName: string;
        matchScore: number;
        specialization: string;
    }[];
    progress?: number; // 0-100
    // Timestamps
    createdAt: Date;
    assignedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
}

/**
 * NGO With Performance - NGO profile with metrics
 */
export interface NGOWithPerformance {
    id: string;
    orgName: string;
    registrationNumber: string;
    headOfOperations: string;
    phone: string;
    email: string;
    logo?: string;
    website?: string;
    baseCity: string;
    baseDistrict: string;
    baseProvince: string;
    baseLocation: { lat: number; lng: number };
    serviceRadiusKm: number;
    specializations: string[];
    // Verification
    verificationStatus: VerificationStatus;
    verifiedAt?: Date;
    suspendedReason?: string;
    // Resources
    resources: {
        ambulances: number;
        rescueBoats: number;
        trucks: number;
        personnel: number;
    };
    // Performance Metrics
    tasksCompleted: number;
    tasksInProgress: number;
    tasksPending: number;
    responseRate: number; // percentage
    avgResponseTime: number; // in minutes
    rating: number; // 1-5 stars
    monthlyTrend: number; // % change vs last month
    // Status
    isOnline: boolean;
    lastActiveAt: Date;
    createdAt: Date;
}

/**
 * Volunteer Profile
 */
export interface Volunteer {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    city: string;
    district: string;
    province: string;
    coordinates: { lat: number; lng: number };
    capabilities: VolunteerCapability[];
    shelterCapacity?: number;
    // Performance
    tasksCompleted: number;
    tasksCurrent?: {
        id: string;
        label: string;
        status: string;
    };
    rating: number; // 1-5
    isActive: boolean;
    lastActiveAt: Date;
    createdAt: Date;
}

/**
 * Message - Admin messaging system
 */
export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    senderType: 'ADMIN' | 'NGO' | 'VOLUNTEER';
    senderName: string;
    senderAvatar?: string;
    receiverId: string;
    receiverType: 'ADMIN' | 'NGO' | 'VOLUNTEER';
    receiverName: string;
    subject?: string;
    content: string;
    relatedDisasterId?: string;
    relatedDisasterTitle?: string;
    relatedTaskId?: string;
    relatedTaskLabel?: string;
    attachments?: {
        id: string;
        name: string;
        url: string;
        type: string;
        size: number;
    }[];
    isRead: boolean;
    createdAt: Date;
}

/**
 * Conversation Thread
 */
export interface Conversation {
    id: string;
    participantId: string;
    participantType: 'NGO' | 'VOLUNTEER';
    participantName: string;
    participantAvatar?: string;
    lastMessage: string;
    lastMessageAt: Date;
    unreadCount: number;
}

/**
 * Social Media Post
 */
export interface SocialPost {
    id: string;
    disasterId: string;
    disasterTitle: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    platforms: SocialPlatform[];
    status: SocialPostStatus;
    scheduledAt?: Date;
    publishedAt?: Date;
    failedReason?: string;
    engagement?: {
        views: number;
        likes: number;
        shares: number;
        comments: number;
    };
    createdBy: 'AI' | 'ADMIN';
    createdAt: Date;
}

/**
 * Admin Dashboard Stats
 */
export interface AdminStats {
    activeDisasters: number;
    newAlerts: number;
    pendingTasks: number;
    unallocatedTasks: number;
    completedThisWeek: number;
    onlineNGOs: number;
    totalVolunteers: number;
    activeVolunteers: number;
}

/**
 * Pipeline Step for AI Analysis Modal
 */
export interface PipelineStep {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    description: string;
    result?: Record<string, unknown>;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}

/**
 * Report Data for Analytics
 */
export interface ReportData {
    disastersByType: { type: DisasterType; count: number }[];
    tasksOverTime: { date: string; completed: number; created: number }[];
    avgResponseTime: { month: string; time: number }[];
    ngoLeaderboard: {
        ngoId: string;
        orgName: string;
        tasksCompleted: number;
        rating: number;
    }[];
    totalDisasters: number;
    totalTasks: number;
    avgCompletionRate: number;
}

/**
 * Timeline Event for Disaster History
 */
export interface TimelineEvent {
    id: string;
    type: 'created' | 'verified' | 'analyzed' | 'task_created' | 'task_assigned' | 'task_completed' | 'resolved';
    title: string;
    description: string;
    user?: string;
    timestamp: Date;
}
