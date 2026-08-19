// Task Status Enum
export enum TaskStatus {
    UNALLOCATED = 'unallocated',
    ASSIGNED = 'assigned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

// Task Type Enum
export enum TaskType {
    MEDICAL_AID = 'Medical Aid',
    FOOD_PROVISION = 'Food Provision',
    SHELTER = 'Shelter',
    WATER_SANITATION = 'Water & Sanitation',
    RESCUE_OPERATIONS = 'Rescue Operations',
    INFRASTRUCTURE_REPAIR = 'Infrastructure Repair',
    PSYCHOLOGICAL_SUPPORT = 'Psychological Support',
}

// Disaster Type Enum
export enum DisasterType {
    FLOOD = 'Flood',
    EARTHQUAKE = 'Earthquake',
    LANDSLIDE = 'Landslide',
    DROUGHT = 'Drought',
    CYCLONE = 'Cyclone',
}

// NGO Interface
export interface NGO {
    id: string;
    name: string;
    logo: string;
    contact: {
        email: string;
        phone: string;
        coordinator: string;
    };
}

// Task Data Interface
export interface TaskData {
    id: string;
    ngo: NGO;
    title: string;
    taskType: TaskType;
    description: string;
    status: TaskStatus;
    progress: number; // 0-100
    location: string;
    disasterType: DisasterType;
    createdAt: Date;
    updatedAt: Date;
    timeline: TimelineEvent[];
    notes: string;
    attachments: Attachment[];
}

// Timeline Event Interface
export interface TimelineEvent {
    id: string;
    date: Date;
    title: string;
    description: string;
    type: 'requested' | 'provided' | 'update' | 'completed';
}

// Attachment Interface
export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'pdf' | 'document';
    uploadedAt: Date;
}

// Metrics Data Interface
export interface MetricsData {
    location: string;
    disasterType: DisasterType;
    affectedArea: {
        value: number;
        unit: string;
    };
    damageAssessment: {
        value: string;
        description: string;
    };
    recoveredPercentage: number;
    aidDeliveredPercentage: number;
    lastUpdated: Date;
}

// Filter Options
export interface FilterOptions {
    location: string;
    disasterType: DisasterType | 'all';
    timeframe: '24h' | 'week' | 'month' | 'all';
    autoUpdate: boolean;
}
