import { NGO, TaskData, MetricsData, TaskStatus, TaskType, DisasterType, TimelineEvent } from '../_types/task';

// Mock NGO Data
export const MOCK_NGOS: NGO[] = [
    {
        id: 'ngo-1',
        name: 'Edhi Foundation',
        logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop',
        contact: {
            email: 'info@edhi.org',
            phone: '+92-21-111-113-344',
            coordinator: 'Ahmed Khan',
        },
    },
    {
        id: 'ngo-2',
        name: 'Saylani Welfare',
        logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
        contact: {
            email: 'contact@saylani.org',
            phone: '+92-21-111-729-526',
            coordinator: 'Fatima Ali',
        },
    },
    {
        id: 'ngo-3',
        name: 'Al-Khidmat Foundation',
        logo: 'https://images.unsplash.com/photo-1616680214084-22670de1bc82?w=200&h=200&fit=crop',
        contact: {
            email: 'help@alkhidmat.org',
            phone: '+92-21-111-252-357',
            coordinator: 'Hassan Raza',
        },
    },
    {
        id: 'ngo-4',
        name: 'JDC Foundation',
        logo: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=200&h=200&fit=crop',
        contact: {
            email: 'info@jdc.org.pk',
            phone: '+92-21-111-543-000',
            coordinator: 'Sarah Ahmed',
        },
    },
    {
        id: 'ngo-5',
        name: 'Akhuwat Foundation',
        logo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=200&fit=crop',
        contact: {
            email: 'contact@akhuwat.org.pk',
            phone: '+92-42-111-225-894',
            coordinator: 'Bilal Sheikh',
        },
    },
];

// Mock Task Data Generator
export const generateMockTasks = (location: string = 'Pakistan', disasterType: DisasterType = DisasterType.FLOOD): TaskData[] => {
    const tasks: TaskData[] = [
        {
            id: 'task-1',
            ngo: MOCK_NGOS[0],
            title: 'Emergency Medical Aid',
            taskType: TaskType.MEDICAL_AID,
            description: 'Providing emergency ambulances and medical supplies to affected areas. Mobile clinics are being set up for immediate medical assistance.',
            status: TaskStatus.IN_PROGRESS,
            progress: 65,
            location,
            disasterType,
            createdAt: new Date('2024-11-20'),
            updatedAt: new Date('2024-11-25'),
            timeline: [
                {
                    id: 'timeline-1-1',
                    date: new Date('2024-11-20'),
                    title: 'Resources Requested',
                    description: '10 ambulances and 500 medical kits requested',
                    type: 'requested',
                },
                {
                    id: 'timeline-1-2',
                    date: new Date('2024-11-22'),
                    title: 'Partial Resources Provided',
                    description: '5 ambulances and 300 medical kits delivered',
                    type: 'provided',
                },
                {
                    id: 'timeline-1-3',
                    date: new Date('2024-11-25'),
                    title: 'Progress Update',
                    description: 'Mobile clinic serving 200+ patients daily',
                    type: 'update',
                },
            ],
            notes: 'Priority areas: Rural villages with limited access to healthcare facilities.',
            attachments: [],
        },
        {
            id: 'task-2',
            ngo: MOCK_NGOS[1],
            title: 'Food Distribution',
            taskType: TaskType.FOOD_PROVISION,
            description: 'Distributing food packages and cooked meals to displaced families in relief camps.',
            status: TaskStatus.IN_PROGRESS,
            progress: 80,
            location,
            disasterType,
            createdAt: new Date('2024-11-19'),
            updatedAt: new Date('2024-11-25'),
            timeline: [
                {
                    id: 'timeline-2-1',
                    date: new Date('2024-11-19'),
                    title: 'Task Assigned',
                    description: 'Food distribution task assigned to Saylani Welfare',
                    type: 'requested',
                },
                {
                    id: 'timeline-2-2',
                    date: new Date('2024-11-21'),
                    title: 'Distribution Started',
                    description: '5000 food packages distributed',
                    type: 'provided',
                },
            ],
            notes: 'Focus on families with children and elderly members.',
            attachments: [],
        },
        {
            id: 'task-3',
            ngo: MOCK_NGOS[2],
            title: 'Temporary Shelter Setup',
            taskType: TaskType.SHELTER,
            description: 'Setting up temporary shelters and tents for displaced families.',
            status: TaskStatus.COMPLETED,
            progress: 100,
            location,
            disasterType,
            createdAt: new Date('2024-11-18'),
            updatedAt: new Date('2024-11-24'),
            timeline: [
                {
                    id: 'timeline-3-1',
                    date: new Date('2024-11-18'),
                    title: 'Task Assigned',
                    description: 'Shelter setup for 500 families',
                    type: 'requested',
                },
                {
                    id: 'timeline-3-2',
                    date: new Date('2024-11-24'),
                    title: 'Task Completed',
                    description: 'All 500 tents set up and families relocated',
                    type: 'completed',
                },
            ],
            notes: 'Shelters equipped with basic amenities including water and sanitation.',
            attachments: [],
        },
        {
            id: 'task-4',
            ngo: MOCK_NGOS[3],
            title: 'Water Purification',
            taskType: TaskType.WATER_SANITATION,
            description: 'Installing water purification units and providing clean drinking water.',
            status: TaskStatus.ASSIGNED,
            progress: 30,
            location,
            disasterType,
            createdAt: new Date('2024-11-23'),
            updatedAt: new Date('2024-11-25'),
            timeline: [
                {
                    id: 'timeline-4-1',
                    date: new Date('2024-11-23'),
                    title: 'Task Assigned',
                    description: 'Water purification task assigned to JDC Foundation',
                    type: 'requested',
                },
            ],
            notes: 'Critical priority to prevent waterborne diseases.',
            attachments: [],
        },
        {
            id: 'task-5',
            ngo: MOCK_NGOS[4],
            title: 'Rescue Operations',
            taskType: TaskType.RESCUE_OPERATIONS,
            description: 'Conducting rescue operations in flood-affected areas using boats and helicopters.',
            status: TaskStatus.IN_PROGRESS,
            progress: 75,
            location,
            disasterType,
            createdAt: new Date('2024-11-18'),
            updatedAt: new Date('2024-11-25'),
            timeline: [
                {
                    id: 'timeline-5-1',
                    date: new Date('2024-11-18'),
                    title: 'Rescue Initiated',
                    description: 'Rescue teams deployed',
                    type: 'requested',
                },
                {
                    id: 'timeline-5-2',
                    date: new Date('2024-11-25'),
                    title: 'Progress Update',
                    description: '350+ people rescued so far',
                    type: 'update',
                },
            ],
            notes: 'Coordinating with military for helicopter support.',
            attachments: [],
        },
        {
            id: 'task-6',
            ngo: MOCK_NGOS[0],
            title: 'Psychological Support Services',
            taskType: TaskType.PSYCHOLOGICAL_SUPPORT,
            description: 'Providing counseling and psychological support to trauma victims.',
            status: TaskStatus.ASSIGNED,
            progress: 20,
            location,
            disasterType,
            createdAt: new Date('2024-11-24'),
            updatedAt: new Date('2024-11-25'),
            timeline: [],
            notes: 'Team of 10 counselors assigned.',
            attachments: [],
        },
        {
            id: 'task-7',
            ngo: { id: 'unallocated', name: 'Unallocated', logo: '', contact: { email: '', phone: '', coordinator: '' } },
            title: 'Infrastructure Repair',
            taskType: TaskType.INFRASTRUCTURE_REPAIR,
            description: 'Repairing damaged roads and bridges to restore connectivity.',
            status: TaskStatus.UNALLOCATED,
            progress: 0,
            location,
            disasterType,
            createdAt: new Date('2024-11-25'),
            updatedAt: new Date('2024-11-25'),
            timeline: [],
            notes: 'Awaiting NGO assignment.',
            attachments: [],
        },
        {
            id: 'task-8',
            ngo: { id: 'unallocated', name: 'Unallocated', logo: '', contact: { email: '', phone: '', coordinator: '' } },
            title: 'Educational Material Distribution',
            taskType: TaskType.FOOD_PROVISION,
            description: 'Distributing books and educational materials to children in relief camps.',
            status: TaskStatus.UNALLOCATED,
            progress: 0,
            location,
            disasterType,
            createdAt: new Date('2024-11-25'),
            updatedAt: new Date('2024-11-25'),
            timeline: [],
            notes: 'Awaiting NGO assignment.',
            attachments: [],
        },
    ];

    return tasks;
};

// Mock Metrics Data Generator
export const generateMockMetrics = (location: string = 'Pakistan', disasterType: DisasterType = DisasterType.FLOOD): MetricsData => {
    return {
        location,
        disasterType,
        affectedArea: {
            value: 25000,
            unit: 'people',
        },
        damageAssessment: {
            value: 'PKR 2.5 Billion',
            description: 'Estimated infrastructure and property damage',
        },
        recoveredPercentage: 45,
        aidDeliveredPercentage: 68,
        lastUpdated: new Date(),
    };
};

// Get unallocated tasks count
export const getUnallocatedCount = (tasks: TaskData[]): number => {
    return tasks.filter(task => task.status === TaskStatus.UNALLOCATED).length;
};
