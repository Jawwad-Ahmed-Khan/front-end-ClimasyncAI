# Navbar Component Documentation

## Overview
Premium navigation bar for ClimasyncAI with glassmorphism styling, animated effects, and responsive design.

---

## File Structure

```
app/_components/Navbar/
├── Navbar.tsx         # Main navbar container
├── NavLink.tsx        # Individual navigation link
├── ProfileDropdown.tsx # Profile menu with Login/Register
├── MobileMenu.tsx     # Mobile responsive menu
└── index.ts           # Barrel exports
```

---

## Components

### 1. Navbar.tsx
**Purpose:** Main container with layout, scroll effects, and responsive behavior.

**Key Features:**
- Gradient top border (`via-cyan-500`)
- Logo with glow effect on hover
- Centered pill navigation container
- LIVE status indicator
- Scroll-triggered background change

**Dependencies:**
- `framer-motion` - animations
- `lucide-react` - Menu/X icons
- `next/image`, `next/link`, `next/navigation`

**State:**
```typescript
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

---

### 2. NavLink.tsx
**Purpose:** Reusable navigation link with active state animation.

**Props:**
```typescript
interface NavLinkProps {
    href: string;
    label: string;
    isActive: boolean;
}
```

**Features:**
- Shared animated background (`layoutId="activeNavBg"`)
- Active indicator dot
- Hover scale effects

---

### 3. ProfileDropdown.tsx
**Purpose:** User profile menu with authentication options.

**Features:**
- Animated chevron on toggle
- Glassmorphism dropdown (`bg-slate-950/95 backdrop-blur-2xl`)
- Gradient top accent
- Login/Create Account buttons
- Click outside to close

---

### 4. MobileMenu.tsx
**Purpose:** Full-screen slide-in menu for mobile devices.

**Props:**
```typescript
interface MobileMenuProps {
    navLinks: { href: string; label: string }[];
    pathname: string;
    onClose: () => void;
}
```

**Features:**
- Spring-based slide animation
- Gradient side accent
- Staggered link animations
- Login/Register buttons

---

## Navigation Links

```typescript
const navLinks = [
    { href: "/", label: "Home" },
    { href: "/map", label: "Map" },
    { href: "/task", label: "Task" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
];
```

---

## Styling Patterns

| Element | Classes |
|---------|---------|
| Background | `bg-slate-950/90 backdrop-blur-2xl` |
| Borders | `border-white/10`, `border-cyan-500/30` |
| Gradients | `from-cyan-500 to-blue-500` |
| Shadows | `shadow-2xl shadow-black/50` |
| Animations | `framer-motion` spring transitions |

---

## Usage

```tsx
import { Navbar } from "@/app/_components/Navbar";

// In layout.tsx
<Navbar />
```

---

## Responsive Breakpoints

- **Mobile (<1024px):** Hamburger menu, hidden desktop nav
- **Desktop (≥1024px):** Full navigation, profile dropdown
