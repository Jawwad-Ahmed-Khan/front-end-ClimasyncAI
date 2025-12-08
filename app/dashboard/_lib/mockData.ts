// ============================================
// MOCK DATA GENERATORS
// ============================================
// Functions to generate realistic mock data for the NGO Dashboard
// All data uses Pakistani locations and realistic scenarios

import {
    NGOProfile,
    Task,
    Notification,
    NGOResources,
    DashboardStats,
    ActiveDisaster,
    TaskStatus,
    TaskType,
    DisasterType,
    NotificationType,
    Specialization,
    OperationalArea,
} from './types';

// ============================================
// HELPER DATA - Pakistani Cities & Districts
// ============================================

const pakistanCities = [
    { city: 'Karachi', district: 'Karachi South', province: 'Sindh', lat: 24.8607, lng: 67.0011 },
    { city: 'Lahore', district: 'Lahore', province: 'Punjab', lat: 31.5204, lng: 74.3587 },
    { city: 'Multan', district: 'Multan', province: 'Punjab', lat: 30.1575, lng: 71.5249 },
    { city: 'Sukkur', district: 'Sukkur', province: 'Sindh', lat: 27.7052, lng: 68.8574 },
    { city: 'Hyderabad', district: 'Hyderabad', province: 'Sindh', lat: 25.396, lng: 68.3578 },
    { city: 'Peshawar', district: 'Peshawar', province: 'KPK', lat: 34.0151, lng: 71.5249 },
    { city: 'Quetta', district: 'Quetta', province: 'Balochistan', lat: 30.1798, lng: 66.975 },
    { city: 'Muzaffarabad', district: 'Muzaffarabad', province: 'AJK', lat: 34.3708, lng: 73.4712 },
    { city: 'Swat', district: 'Swat', province: 'KPK', lat: 35.2227, lng: 72.3528 },
    { city: 'Jacobabad', district: 'Jacobabad', province: 'Sindh', lat: 28.2769, lng: 68.4514 },
];

const taskLabels: Record<TaskType, string[]> = {
    AMBULANCE: ['Emergency Medical Transport', 'Patient Evacuation', 'Critical Care Transfer'],
    BOAT: ['Flood Rescue Operation', 'Water Evacuation', 'Supply Distribution by Boat'],
    MEDICAL: ['Medical Camp Setup', 'First Aid Station', 'Emergency Medical Care'],
    FOOD: ['Food Distribution', 'Ration Pack Delivery', 'Community Kitchen Setup'],
    EVACUATION: ['Area Evacuation', 'Safe Zone Transport', 'Emergency Relocation'],
    SHELTER: ['Temporary Shelter Setup', 'Tent City Management', 'Emergency Housing'],
};

const disasterTitles: Record<DisasterType, string[]> = {
    FLOOD: ['Monsoon Flooding', 'River Overflow', 'Flash Flood Emergency'],
    EARTHQUAKE: ['Seismic Event', 'Aftershock Response', 'Building Collapse'],
    CYCLONE: ['Tropical Storm', 'Coastal Emergency', 'Wind Damage Response'],
    DROUGHT: ['Water Scarcity Crisis', 'Agricultural Emergency', 'Drought Relief'],
    HEATWAVE: ['Extreme Heat Emergency', 'Heatstroke Prevention', 'Cooling Center Setup'],
};

// ============================================
// GENERATOR FUNCTIONS
// ============================================

/**
 * generateMockNGOProfile
 * Creates a fake NGO profile for dashboard display.
 * Used in: Home tab welcome banner, Profile tab
 */
export function generateMockNGOProfile(): NGOProfile {
    const baseCity = pakistanCities[0];
    return {
        id: 'ngo-001',
        orgName: 'Pakistan Relief Foundation',
        registrationNumber: 'PRF-2019-0847',
        headOfOperations: 'Ahmed Khan',
        phone: '+92 300 1234567',
        email: 'operations@pakistanrelief.org',
        baseCity: baseCity.city,
        baseDistrict: baseCity.district,
        baseProvince: baseCity.province,
        baseLocation: { lat: baseCity.lat, lng: baseCity.lng },
        serviceRadiusKm: 150,
        isVerified: true,
        createdAt: new Date('2019-03-15'),
    };
}

/**
 * generateMockTasks
 * Creates array of fake tasks with various statuses.
 * Used in: Tasks tab grid, Home tab stats
 * @param count - Number of tasks to generate
 * @param status - Optional filter by status
 */
export function generateMockTasks(count: number, status?: TaskStatus): Task[] {
    const statuses: TaskStatus[] = status
        ? [status]
        : ['PENDING_ACCEPTANCE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
    const taskTypes: TaskType[] = ['AMBULANCE', 'BOAT', 'MEDICAL', 'FOOD', 'EVACUATION', 'SHELTER'];
    const disasterTypes: DisasterType[] = ['FLOOD', 'EARTHQUAKE', 'CYCLONE', 'DROUGHT', 'HEATWAVE'];
    const priorities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const tasks: Task[] = [];

    for (let i = 0; i < count; i++) {
        const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
        const disasterType = disasterTypes[Math.floor(Math.random() * disasterTypes.length)];
        const location = pakistanCities[Math.floor(Math.random() * pakistanCities.length)];
        const taskStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const labels = taskLabels[taskType];
        const label = labels[Math.floor(Math.random() * labels.length)];

        const daysAgo = Math.floor(Math.random() * 14);
        const assignedAt = new Date();
        assignedAt.setDate(assignedAt.getDate() - daysAgo);

        tasks.push({
            id: `task-${String(i + 1).padStart(3, '0')}`,
            label,
            description: `Urgent ${taskType.toLowerCase()} support needed for ${disasterType.toLowerCase()} affected area in ${location.city}.`,
            taskType,
            disasterType,
            requiredQuantity: Math.floor(Math.random() * 10) + 1,
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            targetLocation: { lat: location.lat + (Math.random() - 0.5) * 0.1, lng: location.lng + (Math.random() - 0.5) * 0.1 },
            targetLocationName: `${location.district}, ${location.province}`,
            status: taskStatus,
            assignedAt,
            completedAt: taskStatus === 'COMPLETED' ? new Date() : undefined,
            eventId: `event-${Math.floor(Math.random() * 5) + 1}`,
            eventTitle: disasterTitles[disasterType][Math.floor(Math.random() * 3)],
            progress: taskStatus === 'IN_PROGRESS' ? Math.floor(Math.random() * 80) + 10 : undefined,
        });
    }

    return tasks;
}

/**
 * generateMockNotifications
 * Creates array of notifications from admin.
 * Used in: Notifications tab, Home tab recent list
 * @param count - Number of notifications
 * @param unreadOnly - Filter unread only
 */
export function generateMockNotifications(count: number, unreadOnly?: boolean): Notification[] {
    const types: NotificationType[] = ['TASK_ASSIGNED', 'TASK_UPDATED', 'URGENT_REQUEST', 'DISASTER_ALERT', 'SYSTEM'];

    const notificationTemplates: Record<NotificationType, { title: string; message: string }[]> = {
        TASK_ASSIGNED: [
            { title: 'New Task Assigned', message: 'You have been assigned a new emergency response task.' },
            { title: 'Task Assignment', message: 'A new rescue operation has been assigned to your team.' },
        ],
        TASK_UPDATED: [
            { title: 'Task Priority Changed', message: 'The priority level has been updated.' },
            { title: 'Task Location Updated', message: 'The target location has been modified.' },
        ],
        URGENT_REQUEST: [
            { title: 'Urgent: Immediate Response Needed', message: 'Critical situation requires your immediate attention.' },
            { title: 'Emergency Request', message: 'High priority emergency in your operational area.' },
        ],
        DISASTER_ALERT: [
            { title: 'Flood Warning Issued', message: 'Severe flooding expected in Sindh province.' },
            { title: 'Earthquake Alert', message: 'Seismic activity detected in northern regions.' },
        ],
        SYSTEM: [
            { title: 'System Maintenance', message: 'Scheduled maintenance tonight from 2-4 AM.' },
            { title: 'Profile Updated', message: 'Your organization profile has been successfully updated.' },
        ],
    };

    const notifications: Notification[] = [];

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const templates = notificationTemplates[type];
        const template = templates[Math.floor(Math.random() * templates.length)];

        const hoursAgo = Math.floor(Math.random() * 72);
        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() - hoursAgo);

        const isRead = unreadOnly ? false : Math.random() > 0.4;

        notifications.push({
            id: `notif-${String(i + 1).padStart(3, '0')}`,
            title: template.title,
            message: template.message,
            type,
            isRead,
            relatedTaskId: type === 'TASK_ASSIGNED' || type === 'TASK_UPDATED' ? `task-${Math.floor(Math.random() * 20) + 1}` : undefined,
            relatedEventId: type === 'DISASTER_ALERT' ? `event-${Math.floor(Math.random() * 5) + 1}` : undefined,
            changes: type === 'TASK_UPDATED' ? [{ field: 'priority', oldValue: 'MEDIUM', newValue: 'HIGH' }] : undefined,
            createdAt,
        });
    }

    // Sort by date, newest first
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * generateMockResources
 * Creates NGO resource inventory data.
 * Used in: Resources tab
 */
export function generateMockResources(): NGOResources {
    return {
        ambulances: 8,
        rescueBoats: 12,
        trucks: 6,
        fourWheelVehicles: 15,
        cranes: 2,
        doctors: 24,
        paramedics: 45,
        rescueDivers: 8,
        volunteersAvailable: 150,
        foodPacketsCapacity: 5000,
        shelterCapacity: 200,
        lastUpdated: new Date(),
    };
}

/**
 * generateMockStats
 * Creates dashboard statistics.
 * Used in: Home tab stat cards
 */
export function generateMockStats(): DashboardStats {
    return {
        activeTasks: 12,
        pendingRequests: 5,
        completedThisMonth: 28,
        responseRate: 94,
    };
}

/**
 * generateMockActiveDisasters
 * Creates list of disasters in NGO's operational areas.
 * Used in: Home tab mini map
 */
export function generateMockActiveDisasters(): ActiveDisaster[] {
    return [
        {
            id: 'disaster-001',
            title: 'Sindh Monsoon Flooding 2024',
            type: 'FLOOD',
            location: { lat: 27.7052, lng: 68.8574 },
            severity: 'CRITICAL',
            affectedPopulation: 125000,
        },
        {
            id: 'disaster-002',
            title: 'Punjab Heatwave Emergency',
            type: 'HEATWAVE',
            location: { lat: 30.1575, lng: 71.5249 },
            severity: 'HIGH',
            affectedPopulation: 450000,
        },
        {
            id: 'disaster-003',
            title: 'Balochistan Drought Crisis',
            type: 'DROUGHT',
            location: { lat: 30.1798, lng: 66.975 },
            severity: 'MEDIUM',
            affectedPopulation: 85000,
        },
    ];
}

/**
 * generateMockSpecializations
 * Creates list of NGO specializations.
 * Used in: Areas tab
 */
export function generateMockSpecializations(): Specialization[] {
    return [
        { id: 'spec-001', name: 'Flood Response', icon: '🌊' },
        { id: 'spec-002', name: 'Medical Aid', icon: '🏥' },
        { id: 'spec-003', name: 'Evacuation', icon: '🚁' },
        { id: 'spec-004', name: 'Food Distribution', icon: '🍚' },
        { id: 'spec-005', name: 'Shelter Management', icon: '🏕️' },
        { id: 'spec-006', name: 'Water Rescue', icon: '⛵' },
    ];
}

/**
 * generateMockOperationalAreas
 * Creates list of operational areas.
 * Used in: Areas tab
 */
export function generateMockOperationalAreas(): OperationalArea[] {
    return [
        { id: 'area-001', district: 'Karachi South', province: 'Sindh' },
        { id: 'area-002', district: 'Sukkur', province: 'Sindh' },
        { id: 'area-003', district: 'Hyderabad', province: 'Sindh' },
        { id: 'area-004', district: 'Multan', province: 'Punjab' },
        { id: 'area-005', district: 'Lahore', province: 'Punjab' },
    ];
}
