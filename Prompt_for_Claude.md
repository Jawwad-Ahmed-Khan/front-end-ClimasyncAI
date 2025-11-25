# Lead UI/UX Designer & Senior Frontend Engineer - Disaster Management AI Platform

**Role:** Lead UI/UX Designer & Senior Frontend Engineer  
**Task:** Build a high-trust, professional "About Us" page for a Disaster Management AI platform.  
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion (animations), Lucide React (icons).

---

## 1. Design Philosophy & Theme (Light Mode Professional)

The user previously had a dark-mode design that felt too "gaming-oriented." We need to pivot to a Clean, Humanitarian Tech aesthetic.

### Background:
- **Clean White** (`bg-white`) or very subtle off-white (`bg-slate-50`).

### Typography:
- **Headings:** Dark Slate (`text-slate-900`)
- **Body:** Medium Slate (`text-slate-600`)
- High readability is key.

### Color Palette:
- **Primary:** Deep Royal Blue (Trust/Stability) - `blue-600`
- **Secondary:** Teal/Emerald (Recovery/Nature) - `emerald-500`
- **Alert:** Soft Red (Urgency/Disaster) - `rose-500`

### Visual Style:
- Use **Subtle Shadows** (`shadow-sm`, `shadow-lg`) instead of neon glows.
- Use **Rounded corners** (`rounded-2xl`) for a friendly, modern feel.

### Future Proofing:
- Ensure all background colors are applied via Tailwind classes so the user can easily swap `bg-white` to `bg-slate-950` later if they decide to revert.

---

## 2. Folder & File Structure

Create these modular components to keep `app/about/page.tsx` clean:

---
/_components
/about_components
├── hero_section.tsx (Title & Context)
├── mission_vision.tsx (Core values)
├── why_we.tsx (Renamed from "Why We Exist" - Stats grid)
├── WorkflowPipeline.tsx (Renamed from "It Works" - The 6 steps)
├── impact.tsx (The colored cards)
├── partner.tsx (Logo slider)
├── TeamGrid.tsx (Team members)
└── CtaBanner.tsx (Final call to action)
---

---

## 3. Component Specifications (Detailed)

### A. `hero_section.tsx`

**Design:** Clean center-aligned or split layout.  
**Content:**
- **H1:** "Reshaping Disaster Resilience with AI." (More professional than the original text).
- **Subtext:** "An automated system reducing response delays and saving lives through predictive analytics and real-time verification."

**Visual:** Since we don't have a 3D robot, use a clean, abstract tech pattern (like a dotted map grid) in light grey as the background texture.

### B. `mission_vision.tsx`

**Layout:** Side-by-side "Bento Box" style cards.  
**Design:** White cards with border `border-slate-200` and `shadow-sm`.

**Content (Refined):**
- **Mission:** "To eliminate delays, minimize false alarms, and unify coordination using AI-driven verification."
- **Vision:** "Sustainable, automated disaster resilience for Pakistan and the global community."

### C. `why_we.tsx` (Formerly "Why We Exist")

**Critique of original:** The timeline line was messy.

**New Design:** A 3-column Grid of large statistics.

**Data Points:**
- **224 Major Disasters** (1950–2024)
- **$36B+ Economic Losses Incurred**
- **2.5M+ People Displaced** (2022-2025 Analysis)

**Style:** Large bold numbers in Primary Blue. Small descriptive text below.

### D. `work_flow.tsx` (Formerly "It Works")

**Concept:** A horizontal scrolling or flex pipeline showing the data journey.  
**Refined Steps:**
- **Verification Agent** (Icon: `ShieldCheck`)
- **Risk Analysis** (Icon: `Activity`)
- **Protocol Definer** (Renamed from "Precaution Definer" - Icon: `FileText`)
- **Distribution Engine** (Renamed from "Work Distributor" - Icon: `Network`)
- **Task Allocation** (Renamed from "Task Allocator" - Icon: `ClipboardList`)
- **Public Alert System** (Renamed from "Social Agent" - Icon: `Megaphone`)

**Animation:** Use Framer Motion to animate an arrow or line moving through these steps.

### E. `impact.tsx`

**Design:** 4 Cards in a grid.

**Style:** Light background with a colored top border corresponding to the stat type.

**Cards:**
- **Speed:** "70% Faster Verification" (Border: Red)
- **Accuracy:** "80% Fewer False Alarms" (Border: Yellow/Orange)
- **Coordination:** "Optimized NGO Workflows" (Border: Blue)
- **Scale:** "Globally Scalable Model" (Border: Green)

### F. `partner.tsx`

**Constraint:** Images are located in `public/images/logos`.  
**Implementation:** Use an "Infinite Marquee" effect.  
**Placeholders:** Since we don't know the exact filenames, generate an array of dummy paths like `/images/logos/partner1.png`, `/images/logos/partner2.png`, etc., so the user just has to rename their files to match.

### G. `TeamGrid.tsx`

**Constraint:** No images yet.  
**Implementation:** Create a clean "Skeleton" or placeholder design. Use a grey circle `bg-slate-200` with a user icon inside for the avatar.  
**Hover Effect:** Slight zoom on the avatar.

**Roles:**
- **Omer (Team Lead)**
- **Moe (AI Architect)**
- **Sherry (Backend Lead)**
- **David (Data Scientist)**

### H. `CtaBanner.tsx`

**Design:** Full width, `bg-slate-900` (Dark contrast footer) or Primary Blue.  
**Text:** "Ready to modernize disaster response?"  
**Buttons:**
- "Register Organization" (Primary styling)
- "Contact Support" (Secondary/Outline styling)

---

## 4. Code Requirements

### Strict Typing:
- Define interfaces for `TeamMember`, `Stat`, `WorkflowStep`.

### Responsiveness:
- Must look perfect on Mobile (stack columns) and Desktop.

### Animation:
- Use Framer Motion for:
  - Fade-in on scroll (`viewport={{ once: true }}`).
  - Staggered entrance for grid items.

---

## 5. Implementation Plan

Please generate the code in this order:
1. The **Data/Types file** (so we have structured content).
2. The individual **Components** (Hero, Mission, Workflow, Team, etc.).
3. The final **Page.tsx** assembly.

---

### Start by creating the component code.
