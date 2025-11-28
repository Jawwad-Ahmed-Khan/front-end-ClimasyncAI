# Project Specification: Pakistan Disaster Response Dashboard (ClimaSync)

## 1\. Project Overview & About

**Application Name:** ClimaSync / Pakistan Disaster Response Dashboard
**Purpose:** A centralized, AI-driven command center for coordinating disaster relief efforts across Pakistan.
**Core Functionality:**
The platform aggregates real-time data on natural disasters (floods, earthquakes, etc.). It acts as a bridge between high-level situational awareness and ground-level NGO operations. Users can search specific locations to view impact metrics (damage, aid status) and track specific relief tasks assigned to various NGOs (Edhi, Saylani, Al-Khidmat, etc.).

**Target Audience:** Government officials, NGO coordinators, and Public Observers.

Here is a clean **Markdown overview** with a proper heading explaining the **purpose of the page**:

---

# 📄 **Overview — Purpose of This Page**

This page is designed to allow users to quickly and easily access detailed information about any location affected by a disaster. The primary purpose of the page is to help users understand the **impact**, **damage**, **recovery status**, and **aid distribution** for a selected area, while also providing visibility into tasks assigned to various NGOs for relief and recovery.

Users can search for a location (e.g., “Lahore”), and the page will display all relevant disaster-related data for that location. In addition, the page visually presents NGO-allocated tasks in the form of interactive cards, showing task progress and completion percentages. Each task can be opened individually to view full details using a dedicated slug-based route.

The page also includes a button to view all **unallocated tasks**, as well as **pagination** for managing long lists. Overall, this page serves as a comprehensive, interactive hub for exploring disaster impact metrics and tracking NGO task progress.

---

-----

## 2\. Technical Stack & Design System

  * **Framework:** Next.js (App Router)
  * **Styling:** Tailwind CSS (Focus on Dark Mode, Glassmorphism, Neon Accents)
  * **Language:** TypeScript
  * **Animation:** Framer Motion (for modal transitions and layout shifts)
  * **Icons:** Lucide-react

### Design Aesthetic

  * **Theme:** "Tactical Dark Mode." Deep slate backgrounds (`bg-slate-900`) with high-contrast neon accents.
  * **Card Style:** "Bento Grid" layout. Cards use semi-transparent backgrounds with subtle borders (Glassmorphism).
  * **Visual Logic:**
      * **Red:** Critical/Unallocated/High Damage.
      * **Yellow:** In Progress/Assigned.
      * **Green:** Completed/Recovered/Safe.
      * **Blue:** Informational/Neutral.

-----

## 3\. File Structure

All page-specific components must be isolated for modularity.

```
src/
└── app/
    └── task/
        ├── page.tsx               # Main Page Entry (Server Component)
        └── _components/
            └── task_component/    # Designated Component Folder
                ├── DashboardHeader.tsx
                ├── HeroMetricsSection.tsx
                ├── FilterBar.tsx
                ├── TaskGrid.tsx
                ├── TaskCard.tsx
                ├── TaskCardSkeleton.tsx
                ├── TaskDetailModal.tsx
                ├── PaginationControl.tsx
                └── UnallocatedBanner.tsx
```

-----

## 4\. Page Layout & Component Specifications

### 4.1. Page Wrapper (`task/page.tsx`)

**Type:** Server Component
**Responsibility:** Fetches initial data based on URL search params (location, disaster type). Wraps the content in a responsive container.
**Structure:**

1.  `<DashboardHeader />`
2.  `<FilterBar />`
3.  `<HeroMetricsSection />`
4.  `<UnallocatedBanner />` 
5.  `<TaskGrid />`
6.  `<PaginationControl />`

-----

### 4.2. Filter Bar (`FilterBar.tsx`)

**Location:** Top of page (sticky).
**Visuals:** Pill-shaped inputs/buttons on a blurred background.
**Functionality:**

  * **Location Search:** Input field. Searching "Lahore" triggers a re-fetch of metrics and tasks.
  * **Dropdowns:** Disaster Type (Flood, Earthquake), Timeframe (Last 24h, Week, Month).
  * **Auto-update:** Toggle switch (red when active) to enable polling for real-time data.

### 4.3. Hero Metrics Section (`HeroMetricsSection.tsx`)

**Visuals:**

  * **Background:** A darkened, stylized satellite map image of the searched area (or general Pakistan map if no search).
  * **Overlay:** Gradient fade-to-black at the bottom.
  * **Typography:** Large, bold headings.

**Sub-Components (Internal):**

1.  **Context Header:** Displays "Pakistan Disaster Response Dashboard" and the dynamic text: "Real-time view of relief operations in [Location Name]."
2.  **Metrics Ribbon:** A horizontal scrollable row of data points.
      * *Affected Area:* (Icon: Users/MapPin) - Value + Unit.
      * *Damage Assessment:* (Icon: AlertTriangle) - Financial or Structural count (Red accent).
      * *Recovered:* (Icon: Activity) - Percentage (Green accent).
      * *Aid Delivered:* (Icon: Truck) - Percentage (Teal accent).
3.  **Map Toggle:** A button "View Heatmap" that toggles the background from a static image to an interactive map view (using a mapping library provider, represented conceptually here).

### 4.4. Unallocated Tasks Redirect (`UnallocatedBanner.tsx`)

**Visuals:** A distinct, high-urgency strip or floating button.
**Design:**

  * Background: `bg-red-500/20` (Red glass).
  * Border: `border-red-500`.
  * Text: "Warning: [X] Tasks are currently Unallocated."
  * **Action:** Button labeled "View Unallocated" -\> Redirects to `/tasks/unallocated`.

### 4.5. Task Grid (`TaskGrid.tsx`)

**Type:** Client Component (for layout animations).
**Layout:** Responsive CSS Grid.

  * Mobile: 1 column.
  * Tablet: 2 columns.
  * Desktop: 3 or 4 columns.
    **Behavior:**
  * Uses `AnimatePresence` from Framer Motion.
  * When filters change, grid items animate in/out rather than snapping.
  * **Empty State:** If no tasks found, show a polite illustration.

### 4.6. Task Card (`TaskCard.tsx`)

**Visuals:** Dark card with soft glowing borders based on status.
**Props:** `TaskData` object (NGO name, logo, task type, progress %, status, description).

**UI Structure:**

1.  **Header:**
      * **Left:** NGO Logo (Circular) + NGO Name (e.g., Edhi, Al-Khidmat).
      * **Right:** Status Badge (Pill shape).
          * *Assigned:* Yellow text/bg.
          * *Completed:* Green text/bg.
          * *Unallocated:* Red text/bg (if appearing here).
2.  **Body:**
      * **Title:** Task Title (e.g., "Medical Aid", "Food Provision").
      * **Description:** Truncated text (2 lines max). "Providing emergency ambulances..."
3.  **Progress Section:**
      * **Bar:** Slim progress line. Gradient fill from red to green based on %.
      * **Label:** "[X]% Completed".
4.  **Footer (Action Area):**
      * **Icon Group:** Small muted icons for Home, Location, Attachment.
      * **Primary Action:** Button.
          * *If In Progress:* "View Details" or "Update".
          * *If Completed:* "Audit".
      * **Interactive Trigger:** Clicking the card body opens the `TaskDetailModal`.

### 4.7. Task Detail Modal (`TaskDetailModal.tsx`)

**Type:** Client Component (Overlay/Dialog).
**Trigger:** Clicking a `TaskCard`.
**Visuals:** Backdrop blur (`backdrop-blur-md`), centered modal with deep shadow. Matches the "Mobile Clinics" overlay in the provided wireframe.

**Content:**

1.  **Header:** Expanded NGO info and Task Title.
2.  **Tabs/Accordion:**
      * *Contact:* Coordinator phone/email.
      * *Timeline/Activity:* Vertical timeline of updates (e.g., "Resources requested vs provided").
      * *Notes:* Field notes from the ground.
      * *Attachments:* Images/PDFs of receipts or proof of work.
3.  **Actions:**
      * **Update Status:** Dropdown to change progress.
      * **Reassign:** Button to change NGO (Admin only).
      * **Close:** X button or click outside.

### 4.8. Loading Skeletons (`TaskCardSkeleton.tsx`)

**Purpose:** Displayed while data is fetching.
**Visuals:** Pulse animation (`animate-pulse`) using `bg-slate-800`.
**Structure:** Matches the geometry of `TaskCard` (Circle for logo, rectangles for text, line for progress bar) to prevent layout shifts (CLS).

### 4.9. Pagination (`PaginationControl.tsx`)

**Location:** Bottom of the grid.
**Visuals:** Minimalist numbers with "Previous" and "Next" chevrons.
**Behavior:**

  * Active page: Highlighted in primary theme color (e.g., Slate-700).
  * Clicking scrolls the user back to the top of the Grid section smoothly.

-----

## 5\. UX/UI & Visual Logic Enhancements

### Improvements over Wireframe

1.  **Visual Hierarchy:** The wireframe is a bit cluttered. We will increase padding inside cards and reduce font sizes for secondary text (timestamps, detailed descriptions) to let the Status and Progress pop.
2.  **Map Integration:** The wireframe shows a static map background. We will implement a "glass" overlay effect so the text remains readable regardless of the map's complexity.
3.  **Progress Visualization:** Instead of a simple slider, we will use a SVG path animation for the progress bar to make it feel "live."
4.  **Interactive Filters:** The wireframe filters look static. We will add hover states (glow effect) to the city/disaster type chips.

### Lazy Loading Strategy

  * **Images:** All NGO logos and map backgrounds must use `next/image` with `placeholder="blur"`.
  * **Components:** The `TaskDetailModal` should be lazy-loaded using `next/dynamic` so its code is only downloaded when a user actually clicks a card.

### Mobile Responsiveness

  * **Filters:** On mobile, the filter bar should collapse into a "Filter" button that opens a drawer, saving screen real estate.
  * **Grid:** Stacks vertically.
  * **Modal:** On mobile, the Modal acts as a Bottom Sheet (sliding up from the bottom) rather than a centered modal, for better thumb reachability.