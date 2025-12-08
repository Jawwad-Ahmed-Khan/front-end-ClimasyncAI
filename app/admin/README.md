# Admin Dashboard - Complete Documentation

A comprehensive disaster response command center for platform administrators built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Technology Stack](#technology-stack)
4. [Data Layer](#data-layer)
5. [Layout System](#layout-system)
6. [Shared Components](#shared-components)
7. [Pages Documentation](#pages-documentation)
8. [Design System](#design-system)
9. [Navigation Flow](#navigation-flow)

---

## Overview

The Admin Dashboard is the platform-wide control center for ClimasyncAI. Unlike the NGO Dashboard (which shows a single organization's view), the Admin Dashboard provides:

- **Real-time disaster monitoring** across all of Pakistan
- **Alert verification** with AI-powered analysis pipeline
- **Task allocation** to NGOs based on capability matching
- **NGO management** including verification and performance tracking
- **Volunteer oversight** with capability filtering
- **Communication hub** for messaging NGOs and volunteers
- **Social media management** for public awareness
- **Analytics & reporting** for platform-wide insights

### Access URL
```
http://localhost:3000/admin
```

---

## Folder Structure

```
app/admin/
├── _lib/                      # Data layer
│   ├── adminTypes.ts          # TypeScript interfaces & enums
│   ├── adminMockData.ts       # Mock data generators
│   └── index.ts               # Barrel export
│
├── _components/               # Shared UI components
│   ├── AdminSidebar.tsx       # Navigation sidebar
│   ├── AdminHeader.tsx        # Top header bar
│   ├── AlertCard.tsx          # Alert display card
│   ├── StatCard.tsx           # Statistics card
│   ├── LiveMap.tsx            # Interactive map
│   ├── PipelineModal.tsx      # AI analysis modal
│   └── index.ts               # Barrel export
│
├── disasters/
│   ├── page.tsx               # Disasters list page
│   └── [id]/
│       └── page.tsx           # Individual disaster detail
│
├── incidents/
│   └── page.tsx               # Alert verification page
│
├── tasks/
│   └── page.tsx               # Task management page
│
├── ngos/
│   └── page.tsx               # NGO management page
│
├── volunteers/
│   └── page.tsx               # Volunteer directory
│
├── messages/
│   └── page.tsx               # Messaging interface
│
├── social/
│   └── page.tsx               # Social media posts
│
├── reports/
│   └── page.tsx               # Analytics dashboard
│
├── layout.tsx                 # Shared layout wrapper
├── page.tsx                   # Command Center (home)
├── TROUBLESHOOTING.md         # Error solutions
└── README.md                  # This file
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **Turbopack** | Fast bundler (dev mode) |

---

## Data Layer

### Location: `app/admin/_lib/`

### adminTypes.ts

Contains 25+ TypeScript interfaces and enums:

#### Enums
```typescript
// Disaster Types
type DisasterType = 'FLOOD' | 'EARTHQUAKE' | 'CYCLONE' | 'DROUGHT' | 'HEATWAVE';

// Alert Status Flow
type AlertStatus = 'NEW' | 'VERIFIED' | 'ANALYZING' | 'ACTIVE' | 'MONITORING' | 'RESOLVED' | 'FALSE_ALARM';

// Task Status Flow
type AdminTaskStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'UNALLOCATED' | 'PENDING_ACCEPTANCE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

// Task Types
type TaskType = 'AMBULANCE' | 'BOAT' | 'MEDICAL' | 'FOOD' | 'EVACUATION' | 'SHELTER';

// Priority Levels
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Risk Levels
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
```

#### Key Interfaces

| Interface | Purpose |
|-----------|---------|
| `AdminProfile` | Admin user data (name, role, department) |
| `Alert` | Incoming disaster alerts from various sources |
| `DisasterEvent` | Verified disasters with full details |
| `AdminTask` | Tasks with allocation info and progress |
| `NGOWithPerformance` | NGO data + performance metrics |
| `Volunteer` | Volunteer profile with capabilities |
| `Conversation` | Messaging thread metadata |
| `Message` | Individual message in a conversation |
| `SocialPost` | Social media post with engagement stats |
| `PipelineStep` | AI analysis step with status |
| `ReportData` | Analytics data for charts |
| `TimelineEvent` | Disaster event timeline entry |

### adminMockData.ts

Contains 15+ generator functions:

| Function | Returns |
|----------|---------|
| `generateMockAdminProfile()` | Single admin profile |
| `generateMockAlerts(count)` | Array of alerts |
| `generateMockDisasters(count, status?)` | Array of disasters |
| `generateMockAdminTasks(count, disasterId?)` | Array of tasks |
| `generateMockNGOsWithPerformance(count)` | Array of NGOs |
| `generateMockVolunteers(count)` | Array of volunteers |
| `generateMockConversations(count)` | Array of conversations |
| `generateMockMessages(convId, count)` | Array of messages |
| `generateMockSocialPosts(count)` | Array of social posts |
| `generateMockAdminStats()` | Dashboard statistics |
| `generateMockPipelineSteps(alertId)` | AI pipeline steps |
| `generateMockReportData()` | Report analytics |
| `generateMockTimelineEvents(disasterId)` | Timeline entries |

#### Utility Functions
```typescript
formatTimeAgo(date: Date): string     // "2 hours ago"
getSeverityColor(score: number): string  // Tailwind color classes
getStatusColor(status): string        // Status badge colors
getPriorityColor(priority): string    // Priority badge colors
```

---

## Layout System

### Location: `app/admin/layout.tsx`

The layout wraps all admin pages and provides:

#### Visual Elements
- **Dark slate background** (`bg-slate-950`)
- **Grid pattern overlay** (subtle 50px grid)
- **Gradient orbs** (decorative blur effects)
- **Fixed header** (search, notifications, profile)
- **Collapsible sidebar** (280px expanded, 80px collapsed)

#### State Management
```typescript
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [adminProfile, setAdminProfile] = useState<AdminProfile>(defaultProfile);
```

#### Responsive Behavior
- Desktop (≥1024px): Sidebar visible, main content offset
- Mobile (<1024px): Sidebar hidden, hamburger menu, full-width content

---

## Shared Components

### Location: `app/admin/_components/`

### AdminSidebar.tsx

**Purpose:** Navigation for all 9 admin tabs

**Features:**
- Collapsible (280px → 80px)
- Active route indicator with animation
- Loading states during navigation
- System status indicator (AI Pipeline health)
- 9 navigation items with icons

**Navigation Items:**
| Tab | Route | Icon |
|-----|-------|------|
| Command Center | `/admin` | LayoutDashboard |
| Incidents | `/admin/incidents` | AlertTriangle |
| Disasters | `/admin/disasters` | MapPinned |
| Tasks | `/admin/tasks` | ClipboardList |
| NGOs | `/admin/ngos` | Building2 |
| Volunteers | `/admin/volunteers` | Users |
| Messages | `/admin/messages` | MessageSquare |
| Social Posts | `/admin/social` | Share2 |
| Reports | `/admin/reports` | BarChart3 |

---

### AdminHeader.tsx

**Purpose:** Fixed header bar with actions

**Features:**
- Search bar with keyboard shortcut hint
- Notification dropdown (unread count badge)
- Live status indicators (AI, Database, Social)
- Profile dropdown with logout option
- Mobile menu toggle button

**Props:**
```typescript
interface AdminHeaderProps {
    adminProfile: AdminProfile;
    unreadNotifications: number;
    onMobileMenuToggle: () => void;
    isSidebarCollapsed: boolean;
}
```

---

### AlertCard.tsx

**Purpose:** Display individual disaster alerts

**Features:**
- Disaster type icon (flood, earthquake, etc.)
- Source badge (USGS, Google Flood Hub, etc.)
- Confidence score with color coding
- Location display
- Time ago formatting
- "Verify" action button for NEW alerts

**Props:**
```typescript
interface AlertCardProps {
    alert: Alert;
    onVerify?: (alertId: string) => void;
    index?: number;  // For staggered animation
}
```

---

### StatCard.tsx

**Purpose:** Display statistics with optional trend

**Features:**
- Icon with colored background
- Large value display
- Subtitle text
- Optional trend indicator (↑ green / ↓ red)
- Hover animation

**Props:**
```typescript
interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: LucideIcon;
    trend?: { value: number; isPositive: boolean };
    color: 'red' | 'amber' | 'emerald' | 'blue' | 'purple' | 'cyan';
    index?: number;
}
```

---

### LiveMap.tsx

**Purpose:** Pakistan map showing disaster locations

**Features:**
- SVG outline of Pakistan
- Pulsing markers for active disasters
- Severity-based color coding
- Tooltip on hover with disaster info
- Legend for marker types
- Location statistics

**Props:**
```typescript
interface LiveMapProps {
    alerts?: Alert[];
    disasters?: DisasterEvent[];
    className?: string;
}
```

---

### PipelineModal.tsx

**Purpose:** Show AI analysis progress for alert verification

**Features:**
- 5-step pipeline visualization
- Animated progress indicators
- Step results display (severity, precautions, tasks)
- Approve/Reject action buttons
- Backdrop blur and slide-in animation

**Steps:**
1. Risk Analysis - Severity and risk level
2. Precautions Generated - Safety recommendations
3. Tasks Defined - Response tasks created
4. Task Allocation - NGO matching in progress
5. Social Posts - Public awareness content

---

## Pages Documentation

### 1. Command Center (`/admin`)

**File:** `app/admin/page.tsx`

**Purpose:** Real-time operational overview

**Components:**
| Section | Description |
|---------|-------------|
| Stats Row | 4 StatCards (Active Disasters, Pending Tasks, Completed This Week, Online NGOs) |
| Alert Feed | Grid of AlertCards showing latest alerts |
| Live Map | Pakistan map with disaster markers |
| Online NGOs | List of currently active NGOs |
| Quick Actions | 4 action cards linking to key pages |

**Data Used:**
- `generateMockAlerts(8)`
- `generateMockAdminStats()`
- `generateMockDisasters(5)`
- `generateMockNGOsWithPerformance(15)`

---

### 2. Incidents Page (`/admin/incidents`)

**File:** `app/admin/incidents/page.tsx`

**Purpose:** Alert verification and triage

**Features:**
- Status tabs: All, New, Verified, Active, Resolved
- Search functionality
- Alert grid with verification actions
- Summary statistics
- Pipeline Modal integration for verification flow

**Workflow:**
1. NEW alerts appear from data sources
2. Admin clicks "Verify" → Opens Pipeline Modal
3. AI analyzes: risk, precautions, tasks, NGO matching
4. Admin approves → Alert becomes ACTIVE disaster

---

### 3. Disasters Page (`/admin/disasters`)

**File:** `app/admin/disasters/page.tsx`

**Purpose:** List all verified disaster events

**Features:**
- Search by name/location
- Status badges (ACTIVE, MONITORING, RESOLVED)
- Severity indicators
- Task progress counters
- Links to individual disaster detail pages

**Card Info:**
- Disaster title and type icon
- Province/City location
- Status badge
- Severity score (1-10)
- Tasks progress (completed/total)

---

### 4. Disaster Detail Page (`/admin/disasters/[id]`)

**File:** `app/admin/disasters/[id]/page.tsx`

**Purpose:** Full detail view of single disaster

**Sections:**
| Section | Content |
|---------|---------|
| Header | Title, status, type, location, severity, affected population |
| Task Summary | Counts by status (completed, in progress, unallocated) |
| Task List | Filterable list with tabs (All, Allocated, Unallocated, Completed) |
| Timeline | Chronological event history |

**Dynamic Route:**
- URL: `/admin/disasters/disaster-0001`
- Parameter: `id` extracted from URL

---

### 5. Tasks Page (`/admin/tasks`)

**File:** `app/admin/tasks/page.tsx`

**Purpose:** Platform-wide task management

**Features:**
- Status tabs: All, Draft, Pending Approval, Unallocated, In Progress, Completed
- Bulk selection with checkboxes
- Bulk actions (Approve, Assign, Delete)
- Search functionality
- Sort by date/priority

**Task Row Info:**
- Task label and disaster link
- Type badge (AMBULANCE, FOOD, etc.)
- Priority badge (CRITICAL, HIGH, MEDIUM, LOW)
- Status with color coding
- Assigned NGO (if any)
- Progress bar (for in-progress)
- Actions dropdown

---

### 6. NGOs Page (`/admin/ngos`)

**File:** `app/admin/ngos/page.tsx`

**Purpose:** NGO verification and performance tracking

**Features:**
- Overview stats (Total, Verified, Pending, Suspended)
- Status tabs for filtering
- Search and sort controls
- Performance metrics display

**NGO Card Info:**
- Organization name and logo
- Verification status badge
- Base location
- Specializations
- Performance: Tasks completed, Response rate, Rating
- Resources: Ambulances, Boats, Trucks, Personnel
- Actions: View, Verify, Suspend, Message

---

### 7. Volunteers Page (`/admin/volunteers`)

**File:** `app/admin/volunteers/page.tsx`

**Purpose:** Volunteer directory with capabilities

**Features:**
- Stats cards (Total, Active, With Car, First Aid Certified)
- Search by name/location
- Capability badges

**Capability Types:**
| Badge | Meaning |
|-------|---------|
| 🚗 Car | Has personal vehicle |
| 🏍 Motorcycle | Has motorcycle |
| ➕ First Aid | First aid certified |
| 🏠 Shelter | Can offer shelter |
| 🍲 Food | Can provide food |

**Volunteer Card Info:**
- Avatar and name
- Location (City, Province)
- Active status indicator
- Capability badges
- Stats: Tasks completed, Rating
- Current task (if any)
- Actions: View, Message

---

### 8. Messages Page (`/admin/messages`)

**File:** `app/admin/messages/page.tsx`

**Purpose:** Communication hub with NGOs and volunteers

**Layout:**
| Panel | Content |
|-------|---------|
| Left (w-80) | Conversation list with unread badges |
| Right | Chat area with message history and input |

**Features:**
- Conversation list sorted by recent activity
- Unread message count per conversation
- Message history with sender differentiation
- Input field with send button
- Related disaster context display

---

### 9. Social Posts Page (`/admin/social`)

**File:** `app/admin/social/page.tsx`

**Purpose:** Manage public awareness posts

**Features:**
- Status tabs: All, Queued, Publishing, Published, Failed
- Platform badges (Twitter, Facebook, LinkedIn, TikTok)
- Engagement metrics for published posts

**Post Card Info:**
- Content preview
- Related disaster
- Target platforms
- Status with icon
- Scheduled time (if queued)
- Engagement: Views, Likes, Shares, Comments
- Actions: Post Now, Schedule, Edit, Delete

---

### 10. Reports Page (`/admin/reports`)

**File:** `app/admin/reports/page.tsx`

**Purpose:** Platform analytics and exports

**Sections:**
| Section | Visualization |
|---------|---------------|
| Overview Stats | 3 StatCards (Total Disasters, Total Tasks, Avg Completion Rate) |
| Disasters by Type | Bar chart by disaster type |
| Tasks Over Time | Line chart (Created vs Completed by month) |
| NGO Leaderboard | Table (Top 10 by tasks completed) |
| Export Options | Data export buttons |

**Export Formats:**
- Disaster Report (PDF)
- Task Summary (Excel)
- NGO Report (PDF)
- Full Analytics (CSV)

---

## Design System

### Colors

| Usage | Color | Tailwind |
|-------|-------|----------|
| Background | Slate 950 | `bg-slate-950` |
| Cards | Slate 900/50 | `bg-slate-900/50` |
| Borders | Slate 800/50 | `border-slate-800/50` |
| Text Primary | White | `text-white` |
| Text Secondary | Slate 400 | `text-slate-400` |
| Text Muted | Slate 500 | `text-slate-500` |

### Status Colors

| Status | Color |
|--------|-------|
| NEW / CRITICAL | Red 400 |
| VERIFIED / ASSIGNED | Blue 400 |
| ANALYZING | Purple 400 |
| ACTIVE / IN_PROGRESS | Emerald 400 |
| MONITORING / PENDING | Amber 400 |
| RESOLVED / COMPLETED | Green 400 |

### Glassmorphism Effect
```css
background: rgba(15, 23, 42, 0.5); /* slate-900/50 */
backdrop-filter: blur(12px);
border: 1px solid rgba(51, 65, 85, 0.5); /* slate-700/50 */
```

### Animations

- **Page transitions:** Fade + slide (Framer Motion)
- **Card hover:** Scale 1.02 + shadow lift
- **Loading:** Spinner with pulse
- **Sidebar:** Width transition 0.3s ease
- **Active indicator:** Layout animation (shared)

---

## Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Command Center ─┬─> Incidents ──> Pipeline Modal ──> Verify│
│        │         │                                          │
│        │         └─> Disasters ──> Disaster Detail ──> Tasks│
│        │                                                    │
│        ├─────────────> Tasks ──────> Assign to NGO          │
│        │                                                    │
│        ├─────────────> NGOs ───────> Verify / Suspend       │
│        │                                                    │
│        ├─────────────> Volunteers ─> View / Message         │
│        │                                                    │
│        ├─────────────> Messages ───> Conversation Thread    │
│        │                                                    │
│        ├─────────────> Social ─────> Schedule / Publish     │
│        │                                                    │
│        └─────────────> Reports ────> Export Data            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Running the Dashboard

### Development
```bash
npm run dev
# Navigate to http://localhost:3000/admin
```

### Production Build
```bash
npm run build
npm run start
```

### Clear Cache (if errors)
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## Future Enhancements

- [ ] Real API integration (replace mock data)
- [ ] WebSocket for real-time updates
- [ ] Map integration (Mapbox/Google Maps)
- [ ] Role-based access control
- [ ] Advanced filtering and search
- [ ] Export functionality implementation
- [ ] Mobile app notifications
- [ ] Audit logging

---

*Documentation generated for ClimasyncAI Admin Dashboard v1.0*
