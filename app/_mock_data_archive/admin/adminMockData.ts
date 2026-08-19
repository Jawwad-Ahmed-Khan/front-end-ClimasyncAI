// ============================================
// ADMIN MOCK DATA GENERATORS
// ============================================
// Functions to generate realistic mock data for the Admin Dashboard
// All data uses Pakistani locations and realistic disaster scenarios

import {
    AdminProfile,
    Alert,
    AlertSource,
    AlertStatus,
    DisasterEvent,
    DisasterType,
    AdminTask,
    AdminTaskStatus,
    TaskType,
    TaskPriority,
    RiskLevel,
    NGOWithPerformance,
    VerificationStatus,
    Volunteer,
    VolunteerCapability,
    Message,
    Conversation,
    SocialPost,
    SocialPlatform,
    SocialPostStatus,
    AdminStats,
    PipelineStep,
    ReportData,
    TimelineEvent,
} from './adminTypes';

// ============================================
// HELPER DATA - Pakistani Cities & Regions
// ============================================

const pakistanLocations = [
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
    { city: 'Rawalpindi', district: 'Rawalpindi', province: 'Punjab', lat: 33.5651, lng: 73.0169 },
    { city: 'Faisalabad', district: 'Faisalabad', province: 'Punjab', lat: 31.4504, lng: 73.135 },
    { city: 'Gwadar', district: 'Gwadar', province: 'Balochistan', lat: 25.1264, lng: 62.3225 },
    { city: 'Gilgit', district: 'Gilgit', province: 'GB', lat: 35.9208, lng: 74.3144 },
    { city: 'Skardu', district: 'Skardu', province: 'GB', lat: 35.2971, lng: 75.6333 },
];

const ngoNames = [
    'Pakistan Relief Foundation',
    'Edhi Foundation',
    'Al-Khidmat Foundation',
    'Aman Foundation',
    'Saylani Welfare Trust',
    'Pakistan Red Crescent',
    'Shahid Afridi Foundation',
    'Chhipa Foundation',
    'JDC Welfare Organization',
    'Ansar Burney Trust',
    'Hands Pakistan',
    'CARE Foundation',
    'Islamic Relief Pakistan',
    'Save the Children Pakistan',
    'UNICEF Pakistan Partners',
];

const volunteerNames = [
    'Ali Hassan', 'Fatima Khan', 'Ahmed Raza', 'Ayesha Malik', 'Bilal Ahmed',
    'Zainab Shah', 'Usman Ali', 'Sana Tariq', 'Hamza Iqbal', 'Maryam Nawaz',
    'Imran Sheikh', 'Hira Qureshi', 'Kashif Mehmood', 'Rabia Aslam', 'Fahad Hussain',
    'Nadia Bukhari', 'Waqar Ahmed', 'Amina Yousaf', 'Rizwan Ahmad', 'Saima Parveen',
];

const disasterTitles: Record<DisasterType, string[]> = {
    FLOOD: ['Monsoon Flooding', 'River Overflow Emergency', 'Flash Flood Warning', 'Urban Flooding', 'Dam Breach Alert'],
    EARTHQUAKE: ['Seismic Activity', 'Aftershock Response', 'Building Collapse', 'Tremor Alert', 'Structural Damage'],
    CYCLONE: ['Tropical Storm', 'Coastal Emergency', 'Wind Damage Response', 'Cyclone Landfall', 'Storm Surge Alert'],
    DROUGHT: ['Water Scarcity Crisis', 'Agricultural Emergency', 'Drought Relief Operation', 'Crop Failure Response', 'Water Shortage'],
    HEATWAVE: ['Extreme Heat Emergency', 'Heatstroke Prevention', 'Heat Warning', 'Temperature Alert', 'Heat Wave Response'],
};

const taskLabels: Record<TaskType, string[]> = {
    AMBULANCE: ['Emergency Medical Transport', 'Patient Evacuation', 'Critical Care Transfer', 'Ambulance Dispatch'],
    BOAT: ['Flood Rescue Operation', 'Water Evacuation', 'Supply Distribution by Boat', 'Stranded Rescue'],
    MEDICAL: ['Medical Camp Setup', 'First Aid Station', 'Emergency Medical Care', 'Health Screening Camp'],
    FOOD: ['Food Distribution', 'Ration Pack Delivery', 'Community Kitchen Setup', 'Nutritional Aid'],
    EVACUATION: ['Area Evacuation', 'Safe Zone Transport', 'Emergency Relocation', 'Mass Evacuation'],
    SHELTER: ['Temporary Shelter Setup', 'Tent City Management', 'Emergency Housing', 'Relief Camp Operation'],
};

const precautions = [
    'Evacuate low-lying areas immediately',
    'Stock emergency supplies for 72 hours',
    'Move to higher ground if near water bodies',
    'Avoid travel unless absolutely necessary',
    'Keep emergency contact numbers accessible',
    'Prepare first aid kits and medications',
    'Secure loose objects and outdoor furniture',
    'Turn off gas and electricity if flooding imminent',
    'Stay indoors during extreme weather',
    'Monitor official channels for updates',
    'Keep documents in waterproof containers',
    'Charge mobile phones and power banks',
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - randomInt(0, daysAgo));
    date.setHours(randomInt(0, 23), randomInt(0, 59), 0, 0);
    return date;
}

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// ADMIN PROFILE
// ============================================

export function generateMockAdminProfile(): AdminProfile {
    return {
        id: 'admin-001',
        name: 'Bilal Ahmed',
        email: 'bilal@climasync.ai',
        avatar: '/avatars/admin.jpg',
        role: 'SUPER_ADMIN',
        phone: '+92 300 9876543',
        department: 'Operations Command',
        lastActiveAt: new Date(),
        createdAt: new Date('2024-01-15'),
    };
}

// ============================================
// ALERTS
// ============================================

export function generateMockAlerts(count: number): Alert[] {
    const sources: AlertSource[] = ['USGS', 'OPEN_METEO', 'GOOGLE_FLOOD_HUB', 'SOCIAL_MEDIA', 'MANUAL'];
    const statuses: AlertStatus[] = ['NEW', 'VERIFIED', 'ANALYZING', 'ACTIVE', 'MONITORING', 'RESOLVED'];
    const types: DisasterType[] = ['FLOOD', 'EARTHQUAKE', 'CYCLONE', 'DROUGHT', 'HEATWAVE'];

    const alerts: Alert[] = [];
    for (let i = 0; i < count; i++) {
        const type = randomItem(types);
        const location = randomItem(pakistanLocations);
        const source = randomItem(sources);
        const status = randomItem(statuses);
        const titles = disasterTitles[type];

        alerts.push({
            id: `alert-${String(i + 1).padStart(4, '0')}`,
            title: `${randomItem(titles)} in ${location.city}`,
            type,
            source,
            status,
            location: {
                lat: location.lat + (Math.random() - 0.5) * 0.2,
                lng: location.lng + (Math.random() - 0.5) * 0.2
            },
            locationName: `${location.district}, ${location.city}`,
            province: location.province,
            severity: status === 'NEW' ? undefined : randomInt(3, 10),
            confidence: randomInt(65, 99),
            detectedAt: randomDate(7),
            verifiedAt: status !== 'NEW' ? randomDate(5) : undefined,
            verifiedBy: status !== 'NEW' ? 'Admin Bilal' : undefined,
        });
    }

    // Sort by detection time, newest first
    return alerts.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
}

// ============================================
// DISASTERS
// ============================================

export function generateMockDisasters(count: number, status?: AlertStatus): DisasterEvent[] {
    const statuses: AlertStatus[] = status
        ? [status]
        : ['ACTIVE', 'MONITORING', 'RESOLVED'];
    const types: DisasterType[] = ['FLOOD', 'EARTHQUAKE', 'CYCLONE', 'DROUGHT', 'HEATWAVE'];
    const riskLevels: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const disasters: DisasterEvent[] = [];
    for (let i = 0; i < count; i++) {
        const type = randomItem(types);
        const location = randomItem(pakistanLocations);
        const disasterStatus = randomItem(statuses);
        const titles = disasterTitles[type];
        const severityScore = randomInt(4, 10);
        const totalTasks = randomInt(5, 25);
        const completedTasks = randomInt(0, totalTasks - 2);
        const inProgressTasks = randomInt(0, totalTasks - completedTasks);
        const unallocatedTasks = totalTasks - completedTasks - inProgressTasks;

        disasters.push({
            id: `disaster-${String(i + 1).padStart(4, '0')}`,
            alertId: `alert-${String(i + 1).padStart(4, '0')}`,
            title: `${randomItem(titles)} - ${location.province} 2024`,
            description: `Severe ${type.toLowerCase()} situation affecting ${location.district} area. Emergency response initiated. Multiple teams deployed for rescue and relief operations.`,
            type,
            status: disasterStatus,
            location: {
                lat: location.lat,
                lng: location.lng,
            },
            locationName: `${location.city}, ${location.province}`,
            province: location.province,
            severityScore,
            riskLevel: riskLevels[Math.min(Math.floor(severityScore / 2.5), 3)],
            affectedPopulation: randomInt(5000, 500000),
            estimatedDamage: randomInt(10, 500) * 1000000, // PKR
            precautions: precautions.slice(0, randomInt(4, 8)),
            totalTasks,
            completedTasks,
            inProgressTasks,
            unallocatedTasks,
            detectedAt: randomDate(14),
            verifiedAt: randomDate(13),
            analyzedAt: randomDate(12),
            resolvedAt: disasterStatus === 'RESOLVED' ? randomDate(2) : undefined,
        });
    }

    return disasters;
}

// ============================================
// ADMIN TASKS
// ============================================

export function generateMockAdminTasks(count: number, disasterId?: string): AdminTask[] {
    const statuses: AdminTaskStatus[] = [
        'DRAFT', 'PENDING_APPROVAL', 'UNALLOCATED',
        'PENDING_ACCEPTANCE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'
    ];
    const taskTypes: TaskType[] = ['AMBULANCE', 'BOAT', 'MEDICAL', 'FOOD', 'EVACUATION', 'SHELTER'];
    const disasterTypes: DisasterType[] = ['FLOOD', 'EARTHQUAKE', 'CYCLONE', 'DROUGHT', 'HEATWAVE'];
    const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const tasks: AdminTask[] = [];
    for (let i = 0; i < count; i++) {
        const taskType = randomItem(taskTypes);
        const disasterType = randomItem(disasterTypes);
        const location = randomItem(pakistanLocations);
        const status = randomItem(statuses);
        const labels = taskLabels[taskType];
        const priority = randomItem(priorities);

        const isAssigned = ['PENDING_ACCEPTANCE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(status);
        const assignedNgo = isAssigned ? randomItem(ngoNames) : undefined;

        // Generate matching NGOs for unallocated tasks
        const matchingNGOs = status === 'UNALLOCATED' ?
            Array.from({ length: randomInt(2, 5) }, (_, idx) => ({
                ngoId: `ngo-${idx + 1}`,
                orgName: ngoNames[idx],
                matchScore: randomInt(65, 98),
                specialization: taskType,
            })).sort((a, b) => b.matchScore - a.matchScore) : undefined;

        tasks.push({
            id: `task-${String(i + 1).padStart(4, '0')}`,
            label: randomItem(labels),
            description: `Urgent ${taskType.toLowerCase()} support needed for ${disasterType.toLowerCase()} affected area in ${location.city}. Immediate response required.`,
            taskType,
            disasterType,
            disasterId: disasterId || `disaster-${randomInt(1, 5).toString().padStart(4, '0')}`,
            disasterTitle: `${randomItem(disasterTitles[disasterType])} - ${location.province}`,
            requiredQuantity: randomInt(1, 10),
            priority,
            targetLocation: {
                lat: location.lat + (Math.random() - 0.5) * 0.1,
                lng: location.lng + (Math.random() - 0.5) * 0.1,
            },
            targetLocationName: `${location.district}, ${location.province}`,
            estimatedDuration: randomInt(2, 48),
            status,
            createdBy: Math.random() > 0.3 ? 'AI' : 'ADMIN',
            approvedBy: ['UNALLOCATED', 'PENDING_ACCEPTANCE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(status) ? 'Admin Bilal' : undefined,
            approvedAt: ['UNALLOCATED', 'PENDING_ACCEPTANCE', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(status) ? randomDate(5) : undefined,
            assignedNgoId: isAssigned ? `ngo-${randomInt(1, 10)}` : undefined,
            assignedNgoName: assignedNgo,
            matchingNGOs,
            progress: status === 'IN_PROGRESS' ? randomInt(10, 90) : status === 'COMPLETED' ? 100 : undefined,
            createdAt: randomDate(10),
            assignedAt: isAssigned ? randomDate(7) : undefined,
            startedAt: ['IN_PROGRESS', 'COMPLETED'].includes(status) ? randomDate(5) : undefined,
            completedAt: status === 'COMPLETED' ? randomDate(1) : undefined,
        });
    }

    return tasks;
}

// ============================================
// NGOs WITH PERFORMANCE
// ============================================

export function generateMockNGOsWithPerformance(count: number): NGOWithPerformance[] {
    const specializations = ['Flood Response', 'Medical Aid', 'Evacuation', 'Food Distribution', 'Shelter Management', 'Search & Rescue'];
    const verificationStatuses: VerificationStatus[] = ['VERIFIED', 'PENDING', 'SUSPENDED'];

    const ngos: NGOWithPerformance[] = [];
    for (let i = 0; i < Math.min(count, ngoNames.length); i++) {
        const location = pakistanLocations[i % pakistanLocations.length];
        const verificationStatus = i < count - 2 ? 'VERIFIED' : randomItem(verificationStatuses);
        const isOnline = Math.random() > 0.3;

        ngos.push({
            id: `ngo-${String(i + 1).padStart(3, '0')}`,
            orgName: ngoNames[i],
            registrationNumber: `NGO-${2015 + i}-${String(randomInt(1000, 9999))}`,
            headOfOperations: `${randomItem(['Dr.', 'Mr.', 'Ms.'])} ${randomItem(volunteerNames.map(n => n.split(' ')[1]))}`,
            phone: `+92 ${randomInt(300, 399)} ${randomInt(1000000, 9999999)}`,
            email: `contact@${ngoNames[i].toLowerCase().replace(/\s+/g, '')}.org`,
            logo: `/logos/ngo-${i + 1}.png`,
            website: `https://${ngoNames[i].toLowerCase().replace(/\s+/g, '')}.org`,
            baseCity: location.city,
            baseDistrict: location.district,
            baseProvince: location.province,
            baseLocation: { lat: location.lat, lng: location.lng },
            serviceRadiusKm: randomInt(50, 300),
            specializations: specializations.slice(0, randomInt(2, 5)),
            verificationStatus,
            verifiedAt: verificationStatus === 'VERIFIED' ? randomDate(60) : undefined,
            suspendedReason: verificationStatus === 'SUSPENDED' ? 'Pending document verification' : undefined,
            resources: {
                ambulances: randomInt(2, 20),
                rescueBoats: randomInt(0, 15),
                trucks: randomInt(3, 25),
                personnel: randomInt(50, 500),
            },
            tasksCompleted: randomInt(20, 200),
            tasksInProgress: randomInt(0, 10),
            tasksPending: randomInt(0, 5),
            responseRate: randomInt(75, 99),
            avgResponseTime: randomInt(15, 120),
            rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
            monthlyTrend: randomInt(-15, 25),
            isOnline,
            lastActiveAt: isOnline ? new Date() : randomDate(3),
            createdAt: randomDate(365),
        });
    }

    return ngos;
}

// ============================================
// VOLUNTEERS
// ============================================

export function generateMockVolunteers(count: number): Volunteer[] {
    const allCapabilities: VolunteerCapability[] = ['HAS_CAR', 'HAS_MOTORCYCLE', 'FIRST_AID', 'OFFERS_SHELTER', 'OFFERS_FOOD'];

    const volunteers: Volunteer[] = [];
    for (let i = 0; i < count; i++) {
        const name = volunteerNames[i % volunteerNames.length];
        const location = randomItem(pakistanLocations);
        const isActive = Math.random() > 0.3;
        const hasCurrentTask = isActive && Math.random() > 0.5;

        volunteers.push({
            id: `vol-${String(i + 1).padStart(4, '0')}`,
            userId: `user-${String(i + 1).padStart(6, '0')}`,
            name,
            email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
            phone: `+92 ${randomInt(300, 399)} ${randomInt(1000000, 9999999)}`,
            avatar: `/avatars/volunteer-${(i % 10) + 1}.jpg`,
            city: location.city,
            district: location.district,
            province: location.province,
            coordinates: { lat: location.lat, lng: location.lng },
            capabilities: allCapabilities.filter(() => Math.random() > 0.5),
            shelterCapacity: Math.random() > 0.7 ? randomInt(2, 15) : undefined,
            tasksCompleted: randomInt(0, 50),
            tasksCurrent: hasCurrentTask ? {
                id: `task-${randomInt(1, 100)}`,
                label: randomItem(taskLabels.EVACUATION),
                status: 'IN_PROGRESS',
            } : undefined,
            rating: Number((3 + Math.random() * 2).toFixed(1)),
            isActive,
            lastActiveAt: isActive ? new Date() : randomDate(14),
            createdAt: randomDate(180),
        });
    }

    return volunteers;
}

// ============================================
// MESSAGES & CONVERSATIONS
// ============================================

export function generateMockConversations(count: number): Conversation[] {
    const conversations: Conversation[] = [];

    for (let i = 0; i < count; i++) {
        const isNgo = i < count / 2;
        const name = isNgo ? ngoNames[i] : volunteerNames[i];

        conversations.push({
            id: `conv-${String(i + 1).padStart(4, '0')}`,
            participantId: isNgo ? `ngo-${i + 1}` : `vol-${i + 1}`,
            participantType: isNgo ? 'NGO' : 'VOLUNTEER',
            participantName: name,
            participantAvatar: `/avatars/${isNgo ? 'ngo' : 'volunteer'}-${(i % 10) + 1}.jpg`,
            lastMessage: randomItem([
                'Thank you for the update.',
                'We have dispatched the team.',
                'Please confirm the location.',
                'Task completed successfully.',
                'Need more resources urgently.',
                'Standing by for instructions.',
            ]),
            lastMessageAt: randomDate(5),
            unreadCount: randomInt(0, 5),
        });
    }

    return conversations.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

export function generateMockMessages(conversationId: string, count: number): Message[] {
    const messages: Message[] = [];

    for (let i = 0; i < count; i++) {
        const isFromAdmin = i % 2 === 0;

        messages.push({
            id: `msg-${String(i + 1).padStart(6, '0')}`,
            threadId: conversationId,
            senderId: isFromAdmin ? 'admin-001' : 'ngo-001',
            senderType: isFromAdmin ? 'ADMIN' : 'NGO',
            senderName: isFromAdmin ? 'Admin Bilal' : 'Pakistan Relief Foundation',
            senderAvatar: `/avatars/${isFromAdmin ? 'admin' : 'ngo-1'}.jpg`,
            receiverId: isFromAdmin ? 'ngo-001' : 'admin-001',
            receiverType: isFromAdmin ? 'NGO' : 'ADMIN',
            receiverName: isFromAdmin ? 'Pakistan Relief Foundation' : 'Admin Bilal',
            content: randomItem([
                'Please provide an update on the current task status.',
                'We have deployed 3 ambulances to the affected area.',
                'The team will reach the location within 30 minutes.',
                'Additional resources have been allocated to your team.',
                'Thank you for the swift response. Keep up the good work.',
                'Need immediate backup at the flood relief camp.',
                'All families have been evacuated successfully.',
                'Please confirm receipt of the supply kit.',
            ]),
            relatedDisasterId: 'disaster-0001',
            relatedDisasterTitle: 'Monsoon Flooding - Sindh 2024',
            isRead: i < count - 2,
            createdAt: new Date(Date.now() - (count - i) * 3600000),
        });
    }

    return messages;
}

// ============================================
// SOCIAL POSTS
// ============================================

export function generateMockSocialPosts(count: number): SocialPost[] {
    const allPlatforms: SocialPlatform[] = ['TWITTER', 'FACEBOOK', 'LINKEDIN', 'TIKTOK'];
    const statuses: SocialPostStatus[] = ['QUEUED', 'PUBLISHING', 'PUBLISHED', 'FAILED'];

    const posts: SocialPost[] = [];
    for (let i = 0; i < count; i++) {
        const status = randomItem(statuses);
        const type = randomItem(['FLOOD', 'EARTHQUAKE', 'HEATWAVE'] as DisasterType[]);

        posts.push({
            id: `post-${String(i + 1).padStart(4, '0')}`,
            disasterId: `disaster-${randomInt(1, 5).toString().padStart(4, '0')}`,
            disasterTitle: `${randomItem(disasterTitles[type])} - ${randomItem(pakistanLocations).province}`,
            content: randomItem([
                '🚨 ALERT: Emergency response underway in affected areas. Stay safe and follow official guidelines. #DisasterResponse #Pakistan',
                '🙏 Our teams are on ground providing relief to affected families. Donate now to help more. #HumanitarianAid',
                '📢 Important safety update: Avoid low-lying areas due to flood risk. Emergency helpline: 1166 #FloodSafety',
                '✅ Update: 500+ families evacuated safely. Thank you to all volunteers and partner NGOs. #ReliefOperations',
                '🏥 Medical camps established in multiple locations. Free healthcare for all affected residents. #HealthCare',
            ]),
            imageUrl: `/images/disaster-${randomInt(1, 5)}.jpg`,
            platforms: allPlatforms.filter(() => Math.random() > 0.3),
            status,
            scheduledAt: status === 'QUEUED' ? new Date(Date.now() + randomInt(1, 48) * 3600000) : undefined,
            publishedAt: status === 'PUBLISHED' ? randomDate(7) : undefined,
            failedReason: status === 'FAILED' ? 'API rate limit exceeded' : undefined,
            engagement: status === 'PUBLISHED' ? {
                views: randomInt(1000, 50000),
                likes: randomInt(100, 5000),
                shares: randomInt(50, 1000),
                comments: randomInt(10, 200),
            } : undefined,
            createdBy: Math.random() > 0.4 ? 'AI' : 'ADMIN',
            createdAt: randomDate(14),
        });
    }

    return posts;
}

// ============================================
// ADMIN STATS
// ============================================

export function generateMockAdminStats(): AdminStats {
    return {
        activeDisasters: randomInt(3, 8),
        newAlerts: randomInt(2, 12),
        pendingTasks: randomInt(15, 45),
        unallocatedTasks: randomInt(5, 20),
        completedThisWeek: randomInt(25, 80),
        onlineNGOs: randomInt(8, 15),
        totalVolunteers: randomInt(500, 2000),
        activeVolunteers: randomInt(100, 400),
    };
}

// ============================================
// PIPELINE STEPS
// ============================================

export function generateMockPipelineSteps(alertId: string): PipelineStep[] {
    return [
        {
            id: `step-1-${alertId}`,
            name: 'Risk Analysis',
            status: 'completed',
            description: 'AI analyzing severity, risk level, and affected population',
            result: {
                severityScore: randomInt(6, 10),
                riskLevel: 'HIGH',
                affectedPopulation: randomInt(10000, 100000),
            },
            startedAt: new Date(Date.now() - 120000),
            completedAt: new Date(Date.now() - 90000),
        },
        {
            id: `step-2-${alertId}`,
            name: 'Precautions Generated',
            status: 'completed',
            description: 'Generating recommended safety precautions',
            result: {
                precautions: precautions.slice(0, 5),
            },
            startedAt: new Date(Date.now() - 90000),
            completedAt: new Date(Date.now() - 60000),
        },
        {
            id: `step-3-${alertId}`,
            name: 'Tasks Defined',
            status: 'completed',
            description: 'Auto-generating response tasks based on disaster type',
            result: {
                tasksCount: randomInt(5, 12),
            },
            startedAt: new Date(Date.now() - 60000),
            completedAt: new Date(Date.now() - 30000),
        },
        {
            id: `step-4-${alertId}`,
            name: 'Task Allocation',
            status: 'in_progress',
            description: 'Matching tasks to capable NGOs in the area',
            startedAt: new Date(Date.now() - 30000),
        },
        {
            id: `step-5-${alertId}`,
            name: 'Social Posts',
            status: 'pending',
            description: 'Generating public awareness posts for social media',
        },
    ];
}

// ============================================
// REPORTS
// ============================================

export function generateMockReportData(): ReportData {
    const types: DisasterType[] = ['FLOOD', 'EARTHQUAKE', 'CYCLONE', 'DROUGHT', 'HEATWAVE'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();

    return {
        disastersByType: types.map(type => ({
            type,
            count: randomInt(5, 30),
        })),
        tasksOverTime: Array.from({ length: 12 }, (_, i) => ({
            date: months[(currentMonth - 11 + i + 12) % 12],
            completed: randomInt(20, 100),
            created: randomInt(25, 120),
        })),
        avgResponseTime: Array.from({ length: 6 }, (_, i) => ({
            month: months[(currentMonth - 5 + i + 12) % 12],
            time: randomInt(20, 90),
        })),
        ngoLeaderboard: ngoNames.slice(0, 10).map((name, i) => ({
            ngoId: `ngo-${i + 1}`,
            orgName: name,
            tasksCompleted: randomInt(20, 150),
            rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        })).sort((a, b) => b.tasksCompleted - a.tasksCompleted),
        totalDisasters: randomInt(50, 150),
        totalTasks: randomInt(500, 1500),
        avgCompletionRate: randomInt(75, 95),
    };
}

// ============================================
// TIMELINE EVENTS
// ============================================

export function generateMockTimelineEvents(disasterId: string): TimelineEvent[] {
    const baseTime = Date.now();

    return [
        {
            id: `event-1-${disasterId}`,
            type: 'created',
            title: 'Alert Detected',
            description: 'Initial alert received from USGS monitoring system',
            timestamp: new Date(baseTime - 7200000),
        },
        {
            id: `event-2-${disasterId}`,
            type: 'verified',
            title: 'Alert Verified',
            description: 'Alert verified by Admin Bilal and marked as genuine',
            user: 'Admin Bilal',
            timestamp: new Date(baseTime - 6600000),
        },
        {
            id: `event-3-${disasterId}`,
            type: 'analyzed',
            title: 'Risk Analysis Complete',
            description: 'AI completed risk assessment: High severity, ~50,000 affected',
            timestamp: new Date(baseTime - 6000000),
        },
        {
            id: `event-4-${disasterId}`,
            type: 'task_created',
            title: '8 Tasks Generated',
            description: 'AI automatically generated 8 response tasks',
            timestamp: new Date(baseTime - 5400000),
        },
        {
            id: `event-5-${disasterId}`,
            type: 'task_assigned',
            title: 'Tasks Allocated',
            description: '6 tasks assigned to 4 NGOs, 2 tasks pending allocation',
            user: 'Admin Bilal',
            timestamp: new Date(baseTime - 4800000),
        },
        {
            id: `event-6-${disasterId}`,
            type: 'task_completed',
            title: 'First Task Completed',
            description: 'Pakistan Relief Foundation completed evacuation task',
            timestamp: new Date(baseTime - 3600000),
        },
    ];
}

// ============================================
// UTILITY EXPORTS
// ============================================

/**
 * Format time ago (e.g., "2 minutes ago", "3 hours ago")
 */
export function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

/**
 * Get severity color class based on score
 */
export function getSeverityColor(score: number): string {
    if (score >= 8) return 'text-red-400 bg-red-500/20';
    if (score >= 6) return 'text-orange-400 bg-orange-500/20';
    if (score >= 4) return 'text-amber-400 bg-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/20';
}

/**
 * Get status color class
 */
export function getStatusColor(status: AlertStatus | AdminTaskStatus): string {
    const colors: Record<string, string> = {
        NEW: 'text-red-400 bg-red-500/20 border-red-500/30',
        VERIFIED: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        ANALYZING: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
        ACTIVE: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        MONITORING: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
        RESOLVED: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
        FALSE_ALARM: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
        DRAFT: 'text-slate-400 bg-slate-500/20 border-slate-500/30',
        PENDING_APPROVAL: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
        UNALLOCATED: 'text-red-400 bg-red-500/20 border-red-500/30',
        PENDING_ACCEPTANCE: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        ASSIGNED: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
        IN_PROGRESS: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
        COMPLETED: 'text-green-400 bg-green-500/20 border-green-500/30',
    };
    return colors[status] || 'text-slate-400 bg-slate-500/20';
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: TaskPriority): string {
    const colors: Record<TaskPriority, string> = {
        LOW: 'text-slate-400 bg-slate-500/20',
        MEDIUM: 'text-blue-400 bg-blue-500/20',
        HIGH: 'text-orange-400 bg-orange-500/20',
        CRITICAL: 'text-red-400 bg-red-500/20',
    };
    return colors[priority];
}
