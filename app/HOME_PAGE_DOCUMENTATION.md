# Home Page Documentation

## Overview
The Home page (`app/page.tsx`) is the main landing page for ClimaSync.AI. It serves as the primary entry point for visitors, showcasing the platform's value proposition through an engaging hero slider, key achievements, workflow visualization, problem-solution comparisons, partner testimonials, and a final call-to-action. The page uses modern UI patterns including carousels, animations, and responsive layouts.

---

## Page Structure

The home page is composed of **6 sequential sections**, each implemented as an independent component:

1. **Image_slider** - Animated hero carousel with overlay text and CTAs
2. **Key_Milstone** - Grid showcasing key metrics and achievements
3. **Workflow** - Five-step workflow process visualization
4. **WhyThisProject** - Interactive problem/solution carousel
5. **TestimonialsLogos** - Partner logo marquee
6. **JoinUs** - Final call-to-action banner with background image

---

## Main Page File

**Location:** [app/page.tsx](file:///d:/ClimasycnAI/climasyncai/app/page.tsx)

```tsx
export default function Home() {
  return (
    <div>
      <Image_slider/>
      <Key_Milstone/>
      <Workflow/>
      <WhyThisProject/>
      <TestimonialsLogos/>
      <JoinUs/>
    </div>
  );
}
```

**Key Points:**
- Simple container component with a `div` wrapper
- All components are imported from `@/app/_components/home_components/`
- Sections render sequentially for a natural storytelling flow
- No margins or padding on the wrapper (handled by individual components)

---

## Design System

**Location:** [app/_types/const_types.tsx](file:///d:/ClimasycnAI/climasyncai/app/_types/const_types.tsx)

The shared design system provides consistent styling across home page components:

### Text Styles
```tsx
Text_Styles = {
  Heading_1: "text-3xl md:text-5xl font-bold text-center text-gray-900 mb-12 md:mb-20"
  paragraph: "text-sm md:text-base font-medium text-gray-600 leading-relaxed"
  Heading_2: "text-2xl md:text-3xl font-extrabold"
}
```

### Container Styles
```tsx
DIV_Styles = {
  Container: "w-full bg-white px-4"
  Section_Padding: "py-12 md:py-24"
  Section_Bottom_Only: "pb-12 md:pb-24"
}
```

### Layout System
```tsx
Layout = {
  maxWidth: "max-w-7xl mx-auto"
  Grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12 justify-items-center"
}
```

**Grid Breakpoints:**
- **Mobile (xs):** 1 column
- **Small (sm):** 2 columns
- **Medium (md):** 3 columns
- **Large (lg+):** 5 columns

---

## Component Details

### 1. Image_slider Component

**Location:** [app/_components/home_components/image_slider.tsx](file:///d:/ClimasycnAI/climasyncai/app/_components/home_components/image_slider.tsx)

**Purpose:** Hero carousel showcasing disaster management imagery with overlay text and call-to-action buttons

**Key Features:**
- Full-width hero section (85vh height)
- Auto-playing carousel using Embla Carousel
- Dark overlay (40% black) for text readability
- Two prominent CTA buttons
- Responsive typography with drop shadows

**Carousel Configuration:**
- **Library:** `embla-carousel-react` with `Autoplay` plugin
- **Loop:** Infinite loop enabled
- **Delay:** 3000ms (3 seconds per slide)
- **Stop on Interaction:** False (continues playing)

**Image Slides:**
1. `/images/home/slide1.webp`
2. `/images/home/slide2.webp`
3. `/images/home/slide3.webp`

**Hero Content:**
- **Heading:** "AI-Powered Disaster Management for Pakistan"
- **Tagline:** "Verify. Analyze. Respond. Save Lives."
- **CTA Buttons:**
  - "View Live Map" (blue, primary)
  - "Register NGO" (white, secondary)

**Button Handlers:**
- `Handle_View_Live_Map()` - TODO: Navigate to live map page
- `Handle_Register_NGo()` - TODO: Navigate to NGO registration

**Styling Details:**
- Height: 85vh on all devices
- Background: Sliding images with object-cover
- Overlay: Black with 40% opacity (`bg-black/40`)
- Text colors: White with drop shadows
- Buttons: Rounded-full with hover scale (110%)
- Bottom gradient: 15% height from black/60 to transparent

**Layout Structure:**
```
Container (relative, 85vh)
  └─ Embla Carousel (h-full, background layer)
      └─ Image slides
  └─ Text Overlay (absolute, z-10, centered)
      └─ Heading + Tagline + Buttons
  └─ Bottom Gradient (absolute, bottom)
```

---

### 2. Key_Milstone Component

**Location:** [app/_components/home_components/key_Milstone.tsx](file:///d:/ClimasycnAI/climasyncai/app/_components/home_components/key_Milstone.tsx)

**Purpose:** Showcase key platform achievements and metrics in an icon-based grid

**Key Features:**
- Responsive grid layout (2 → 3 → 5 columns)
- Icon images with hover scale effect
- Large metric numbers with descriptive labels
- Uses shared design system styles

**Milestone Data:**
1. **200+ Reports Verified**
   - Icon: `/images/home/report.png`
   - Color: Blue-900

2. **50+ NGOs Registered**
   - Icon: `/images/home/ngo.png`
   - Color: Blue-900

3. **80+ Cities Reached**
   - Icon: `/images/home/city.png`
   - Color: Blue-900

4. **1.2M Families Assisted**
   - Icon: `/images/home/family.png`
   - Color: Blue-900

5. **USD 10M Funds Optimized**
   - Icon: `/images/home/money.png`
   - Color: Blue-900

**Grid Layout:**
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 5 columns (all in one row)
- Gap: 6px horizontal, 12px vertical

**Card Structure:**
- Icon container: 20x20 (mobile) → 24x24 (desktop)
- Hover effect: Scale 110%
- Title: `Text_Styles.Heading_2` in blue-900
- Description: `Text_Styles.paragraph`

**Container:**
- Uses `DIV_Styles.Container` + `DIV_Styles.Section_Padding` + `DIV_Styles.Section_Bottom_Only`
- Max-width wrapper using `Layout.maxWidth`

**Developer Note:**
Code includes a comment about future API integration for fetching milestone data dynamically.

---

### 3. Workflow Component

**Location:** [app/_components/home_components/workflow.tsx](file:///d:/ClimasycnAI/climasyncai/app/_components/home_components/workflow.tsx)

**Purpose:** Visualize the five-step AI workflow process with numbered cards

**Key Features:**
- Section heading: "Our Workflow"
- Five workflow cards with animated gradient badges
- Responsive grid layout
- Custom CSS animation for gradient movement
- Hover effects with shadow

**Workflow Steps:**
1. **Verification**
   - Description: "Validate disaster reports & data sources."

2. **Risk Analysis**
   - Description: "AI-driven assessment of disaster severity & impact."

3. **Precaution**
   - Description: "Proactive planning & resource allocation for safety."

4. **Work Dist.** (Work Distribution)
   - Description: "Efficient assignment of tasks to response teams."

5. **NGO & Alerts**
   - Description: "Seamless coordination with NGOs & public alerts."

**Card Styling:**
- Max width: 280px
- Min height: 224px (mobile) → 240px (desktop)
- Border: 2px gray-200, rounded-2xl
- Background: White
- Hover: Shadow-lg and border-gray-300

**Number Badge:**
- Positioned: Absolute, -top-7
- Size: 14x14 outer (gradient), 12x12 inner (white)
- Gradient: Cyan-400 → Blue-500 → Purple-600
- Animation: Custom `gradient-move` keyframe (3s, infinite)

**Custom Animation:**
```css
@keyframes gradient-move {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```
- Background-size: 200% 200%
- Creates a flowing gradient effect

**Grid Layout:**
- Uses `Layout.Grid` (1 → 2 → 3 → 5 columns)
- Items centered using `justify-items-center`

**Typography:**
- Title: Modified `Text_Styles.Heading_2` with responsive sizing
- Description: Text-sm → text-base, gray-500, font-medium

---

### 4. WhyThisProject Component

**Location:** [app/_components/home_components/why_this_project.tsx](file:///d:/ClimasycnAI/climasyncai/app/_components/home_components/why_this_project.tsx)

**Purpose:** Interactive carousel comparing current problems with ClimaSync.AI solutions

**Key Features:**
- Dual-axis carousel (horizontal on mobile, vertical on desktop)
- Problem/solution comparison layout
- Split-screen design (image left, content right)
- Auto-playing with manual controls
- Custom navigation indicators

**Carousel Configuration:**
- **Library:** Embla Carousel with Autoplay plugin
- **Mobile:** Horizontal scroll (axis: 'x')
- **Desktop:** Vertical scroll (axis: 'y') at 768px breakpoint
- **Loop:** Infinite loop enabled
- **Autoplay delay:** 5000ms (5 seconds)
- **Duration:** 40ms transition

**Project Data (3 slides):**

**Slide 1: Verification**
- **Image:** Unsplash landscape photo
- **Problem:** "Unverified & Scattered Information"
  - Traditional systems rely on slow manual checks, causing false alarms and delays
- **Solution:** "Agentic Verification"
  - Verification Agent cross-checks sensor, API, and human data with trusted models

**Slide 2: Risk Assessment**
- **Image:** Unsplash disaster response photo
- **Problem:** "Slow & Fragmented Response Planning"
  - Pakistan lacks automated system for quick risk assessment
- **Solution:** "Automated Risk & Precaution"
  - Risk Analysis Agent scores hazards, Precaution Definer generates safety steps

**Slide 3: Resource Allocation**
- **Image:** Unsplash relief efforts photo
- **Problem:** "Duplicated Relief Efforts & Wastage"
  - Poor coordination between NGOs causes task duplication
- **Solution:** "Intelligent Resource Allocation"
  - Task Allocator Agent assigns responsibilities based on needs and capacity

**Component Structure:**

**Header:**
- Badge: "ClimaSync.AI Core" (emerald-100 background, emerald-700 text)
- Heading: "Why This Project?"

**Carousel Layout:**
- Container height: 650px (mobile), 600px (desktop)
- Each slide: 100% width/height
- Grid: 1 column mobile, 2 columns desktop (50/50 split)

**Left Half: Image**
- Height: 256px (mobile), 100% (desktop)
- Background: Slate-200
- Image: Object-cover with hover scale (105%)
- Slide counter badge: Top-left corner (e.g., "1 / 3")
- Mobile gradient overlay: Black/20 from bottom

**Right Half: Content**
- Padding: 6px (mobile) → 10px (tablet) → 16px (desktop)
- Vertical spacing: 4-6px between blocks
- Background: White

**Problem Block:**
- Background: Red-50 with red-100 border
- Left accent: 1px wide red-500 vertical bar
- Icon: XCircle (red-500) in white rounded background
- Label: "CURRENT STATE" (red-900, uppercase, bold)
- Title: Problem title (gray-900, bold)
- Description: Problem description (slate-600)
- Hover: Shadow-md and red-200 border

**Arrow Divider:**
- Shown only on desktop
- ArrowRight icon rotated 90° (pointing down)
- Gray-300 color

**Solution Block:**
- Background: Emerald-50 with emerald-100 border
- Left accent: 1px wide emerald-500 vertical bar
- Icon: CheckCircle2 (emerald-600) in white rounded background
- Label: "OUR SOLUTION" (emerald-900, uppercase, bold)
- Title: Solution title (gray-900, bold)
- Description: Solution description (slate-600)
- Hover: Shadow-md and emerald-200 border

**Desktop Controls (Vertical):**
- Positioned: Right side, vertically centered
- Up button (ChevronUp)
- Vertical indicator dots (2px → 8px when active)
- Down button (ChevronDown)
- Buttons: White with shadow, emerald-600 on hover

**Mobile Controls (Horizontal):**
- Positioned: Bottom center
- Horizontal indicator dots (2px → 8px when active)
- Emerald-500 when active, slate-300/80 when inactive

**Developer Note:**
Code includes commented instructions for replacing `<img>` with Next.js `<Image>` component for optimization:
```tsx
<Image 
  src={item.image} 
  alt={item.solution.title}
  fill
  className="object-cover transition-transform duration-700 hover:scale-105"
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={index === 0} 
/>
```

**Local Style Override:**
This component includes local definitions of `DIV_Styles`, `Layout`, and `Text_Styles` for self-containment, rather than importing from `const_types.tsx`.

---

### 5. TestimonialsLogos Component

**Location:** [app/_components/home_components/testimonials.tsx](file:///d:/ClimasycnAI/climasyncai/app/_components/home_components/testimonials.tsx)

**Purpose:** Showcase partner organizations through an infinite scrolling logo marquee

**Key Features:**
- Dark background section (gray-950)
- Section heading: "Testimonials"
- Infinite horizontal scrolling marquee
- Circular white logo containers
- Pause animation on hover

**Partner Logos (4 partners):**
1. Blue Crest - `/images/logos/pakistan.png`
2. Red Crest - `/images/logos/sindh.png`
3. NDMA - `/images/logos/ndma.png`
4. NGO - `/images/logos/pdma.jpg`

**Marquee Implementation:**
- Partners duplicated 4 times for seamless loop
- Two identical sets rendered for infinite scroll effect
- Animation class: `animate-marquee`
- Pause on hover: `hover:[animation-play-state:paused]`

**Logo Container:**
- Size: 24x24 (mobile) → 32x32 (desktop)
- Shape: Circular (rounded-full)
- Background: White
- Shadow: lg
- Hover: Scale 105%
- Image padding: 5px (p-5)

**Section Styling:**
- Background: Gray-950
- Text color: White
- Padding: 16px (mobile) → 24px (desktop)
- Bottom margin: 16px (mobile) → 20px (desktop)
- Overflow: Hidden (for marquee)

**Layout:**
- Container: Max-width 7xl, horizontal padding
- Heading: 3xl → 5xl, bold, centered, 12px bottom margin
- Gap between logos: 8px (mobile) → 16px (desktop)

---

### 6. JoinUs Component

**Location:** [app/_components/home_components/join_us.tsx](file:///d:/ClimasycnAI/climasyncai/app/_components/home_components/join_us.tsx)

**Purpose:** Final call-to-action section encouraging visitors to register or learn more

**Key Features:**
- Full-width background image
- Horizontal flip applied to image (scale-x-[-1])
- Dark gradient overlay for text readability
- Centered text and button layout
- Two CTA buttons

**Background:**
- Image: `/images/home/join_back.webp`
- Image positioning: Object-cover with object-top
- Horizontal flip: `scale-x-[-1]` (mirrored)
- Overlay: Linear gradient from black/80 to transparent (left to right)

**Content:**
- **Heading:** "Join us in building disaster resilience for Pakistan and beyond."
  - Uses `Text_Styles.Heading_1` in white
  - Custom margins: 8px (mobile) → 12px (desktop)
- **Max-width:** 4xl, centered
- **Vertical padding:** 20px (py-20)

**CTA Buttons:**
1. **Register NGO** (Primary)
   - Background: Blue-600
   - Hover: Blue-700
   - Size: Full width mobile, 200px desktop
   - Height: 50px
   - Border radius: xl

2. **Learn More** (Secondary)
   - Background: Gray-100
   - Hover: White
   - Text color: Blue-600
   - Size: Full width mobile, 200px desktop
   - Height: 50px
   - Border radius: xl

**Button Layout:**
- Flex column on mobile
- Flex row on small screens and up
- Gap: 4px (mobile), 8px (desktop)
- Full width on mobile, auto width on desktop

**Container:**
- Uses `DIV_Styles.Container`
- Additional classes: `relative bg-[#F9F9F9]`

**Z-Index Layering:**
1. Background image (z-0, implicit)
2. Dark gradient overlay (z-0, explicit)
3. Content (z-10)

---

## Dependencies

### NPM Packages
- `react` - Core React library
- `next` - Next.js framework
- `next/image` - Optimized image component
- `embla-carousel-react` - Carousel/slider library
- `embla-carousel-autoplay` - Autoplay plugin for Embla
- `lucide-react` - Icon library (used in WhyThisProject)

### Internal Dependencies
- `@/app/_types/const_types` - Shared style constants (Text_Styles, DIV_Styles, Layout)

---

## Assets Required

### Images

All images should be placed in the `public/images/` directory:

**Home Slider:**
- `/images/home/slide1.webp` - Hero carousel slide 1
- `/images/home/slide2.webp` - Hero carousel slide 2
- `/images/home/slide3.webp` - Hero carousel slide 3

**Key Milestones:**
- `/images/home/report.png` - Reports verified icon
- `/images/home/ngo.png` - NGOs registered icon
- `/images/home/city.png` - Cities reached icon
- `/images/home/family.png` - Families assisted icon
- `/images/home/money.png` - Funds optimized icon

**Join Us:**
- `/images/home/join_back.webp` - Background image for final CTA section

**Partner Logos:**
- `/images/logos/pakistan.png` - Pakistan logo
- `/images/logos/sindh.png` - Sindh logo
- `/images/logos/ndma.png` - NDMA logo
- `/images/logos/pdma.jpg` - PDMA logo

**Why This Project:**
- Uses external Unsplash images (currently)
- Consider replacing with local images for better performance and reliability

---

## Styling & Animations

### Color Scheme
- **Primary Blue:** Blue-600 (CTAs, accents)
- **Problem/Alert:** Red-50, Red-500 (problem blocks)
- **Solution/Success:** Emerald-50, Emerald-500 (solution blocks)
- **Neutral:** Gray/Slate shades (text, backgrounds)
- **Dark Sections:** Gray-950 (testimonials background)

### Animation Patterns

**1. Carousel Animations:**
- Embla Carousel handles smooth slide transitions
- Autoplay with configurable delays
- Loop mode for infinite scrolling

**2. Hover Effects:**
- Icons: Scale 110% on hover
- Cards: Shadow increase, border color change
- Buttons: Background color change, scale 110%
- Images: Scale 105% on hover (700ms transition)

**3. Custom Gradient Animation (Workflow):**
- Moving gradient on number badges
- 3-second infinite loop
- Background position shifts from 0% → 100% → 0%

**4. Marquee Animation (Testimonials):**
- Infinite horizontal scroll
- Seamless loop using duplicated content
- Pauses on hover

### Responsive Breakpoints
- **Mobile:** Default (< 640px)
- **Small:** `sm:` (≥ 640px)
- **Medium:** `md:` (≥ 768px)
- **Large:** `lg:` (≥ 1024px)

### Typography Scale
- **H1:** 3xl (mobile) → 5xl (desktop)
- **H2:** 2xl (mobile) → 3xl (desktop)
- **Body:** sm → base (mobile to desktop)

---

## Development Notes

### TODOs

1. **Image_slider Component:**
   - Implement `Handle_View_Live_Map()` - Add navigation to live map page
   - Implement `Handle_Register_NGo()` - Add navigation to NGO registration

2. **WhyThisProject Component:**
   - Replace external Unsplash images with local images
   - Replace `<img>` tags with Next.js `<Image>` component (see commented code)

3. **JoinUs Component:**
   - Add click handlers for "Register NGO" and "Learn More" buttons

4. **Key_Milstone Component:**
   - Future: Fetch milestone data from API (see code comment)
   - Consider creating interface for KeyMilestone type

5. **General:**
   - Add ARIA labels for better accessibility
   - Consider adding loading states for carousels
   - Test carousel behavior on various touch devices

### Best Practices
1. **Image Optimization:** Utilize Next.js `Image` component for automatic optimization and lazy loading
2. **Carousel Performance:** Embla Carousel is lightweight and performant; ensure autoplay delays balance UX and engagement
3. **Responsive Testing:** Test grid layouts at all breakpoints (especially the 1→2→3→5 progression)
4. **Accessibility:** Add `aria-label` to carousel controls and icon-only buttons
5. **Maintainability:** Use shared `const_types` styles consistently across components

### Known Issues
- **WhyThisProject:** Currently uses `<img>` instead of Next.js `<Image>` (see TODO)
- **Local Style Duplication:** WhyThisProject has local style definitions instead of importing from `const_types`

---

## LLM Context Summary

When working with this home page:

1. **File Structure:** Main page orchestrates 6 independent section components
2. **Styling System:** Most components use shared styles from `const_types.tsx`
3. **Carousel Library:** Both Image_slider and WhyThisProject use Embla Carousel
4. **Responsive Patterns:** Mobile-first design with specific breakpoints at sm/md/lg
5. **Image Format:** Uses WebP for photos, PNG/JPG for logos
6. **Color System:** Blue (primary), Red (problems), Emerald (solutions), Gray (neutral)
7. **Grid System:** Unique 1→2→3→5 column progression for milestones/workflow
8. **Animation Style:** Subtle hover effects, smooth transitions, auto-playing carousels

**When modifying:**
- Keep section order intact for storytelling flow
- Use `const_types` styles for consistency (except WhyThisProject which has local styles)
- Test carousel behavior on both desktop and mobile
- Ensure images are optimized (WebP format preferred)
- Maintain responsive grid pattern (1→2→3→5 columns)
- Consider performance impact of autoplay carousels
- Add handlers for all TODO button clicks

**Component Dependencies:**
- **Image_slider:** Embla Carousel + Autoplay
- **WhyThisProject:** Embla Carousel + Autoplay + Lucide Icons
- **TestimonialsLogos:** CSS marquee animation
- **Key_Milstone, Workflow, JoinUs:** Shared const_types

---

## Quick Reference

### Component Order
```
Image_slider → Key_Milstone → Workflow → WhyThisProject → TestimonialsLogos → JoinUs
```

### Background Styling
```
Hero: Image carousel → Milestones: White → Workflow: White → Why: Slate-50 → Testimonials: Gray-950 → Join: Image with gradient
```

### Carousel Components
- **Image_slider:** Horizontal, 3 slides, 3s delay
- **WhyThisProject:** Horizontal (mobile) / Vertical (desktop), 3 slides, 5s delay
- **TestimonialsLogos:** Marquee, 4 logos (x4 duplicated), infinite scroll

### Grid Layouts
- **Key_Milstone:** 1→2→3→5 columns (5 items)
- **Workflow:** 1→2→3→5 columns (5 items)
- **WhyThisProject:** 1 column mobile, 2 columns desktop (split screen)

### File Locations
- Main Page: `app/page.tsx`
- Components: `app/_components/home_components/*.tsx`
- Shared Styles: `app/_types/const_types.tsx`
- Hero Images: `public/images/home/slide*.webp`
- Milestone Icons: `public/images/home/*.png`
- Join Background: `public/images/home/join_back.webp`
- Partner Logos: `public/images/logos/*`

### Button Handlers (TODOs)
- `Handle_View_Live_Map()` - Image_slider
- `Handle_Register_NGo()` - Image_slider
- Register NGO button - JoinUs
- Learn More button - JoinUs
