# Footer Component Documentation

## Overview
Premium footer for ClimasyncAI with brand identity, navigation links, social media, and legal information.

---

## File Structure

```
app/_components/Footer/
├── Footer.tsx    # Main footer component
└── index.ts      # Barrel export
```

---

## Component: Footer.tsx

### Features
- Dark glassmorphism background (`bg-slate-950`)
- Gradient background orbs for visual depth
- Gradient top border accent
- Responsive grid layout

---

## Sections

### 1. Brand Column (Left)
- Logo with hover effect
- Brand name "ClimasyncAI" with gradient text
- Tagline description
- Contact info with icons:
  - MapPin - Location
  - Mail - Email
  - Phone - Phone number

### 2. Link Columns (4 columns)

```typescript
const footerLinks = {
    platform: {
        title: "Platform",
        links: ["Map Dashboard", "Task Management", "News & Alerts", "AI Verification"]
    },
    resources: {
        title: "Resources",
        links: ["Documentation", "API Reference", "Case Studies", "Research"]
    },
    organization: {
        title: "Organization",
        links: ["About Us", "Our Team", "Partners", "Careers"]
    },
    support: {
        title: "Support",
        links: ["Help Center", "Contact Us", "Report Issue", "FAQs"]
    }
};
```

### 3. Bottom Bar
- Social icons (Facebook, Twitter, LinkedIn, Instagram, YouTube)
- Copyright notice with dynamic year
- Legal links (Privacy Policy, Terms of Service)

---

## Social Links

```typescript
const socialLinks = [
    { icon: Facebook, href: "https://facebook.com" },
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
    { icon: Instagram, href: "https://instagram.com" },
    { icon: Youtube, href: "https://youtube.com" },
];
```

---

## Styling Patterns

| Element | Classes |
|---------|---------|
| Background | `bg-slate-950` |
| Gradient Orbs | `bg-cyan-500/5`, `bg-blue-500/5` with `blur-3xl` |
| Top Border | `bg-gradient-to-r from-transparent via-cyan-500/30` |
| Links | `text-slate-400 hover:text-cyan-400` |
| Social Icons | `bg-white/5 hover:bg-white/10 border-white/10` |
| Dividers | `border-white/5` |

---

## Dependencies

- `framer-motion` - hover animations
- `lucide-react` - icons (Facebook, Twitter, etc.)
- `next/image`, `next/link`

---

## Usage

```tsx
import { Footer } from "@/app/_components/Footer";

// In layout.tsx
<Footer />
```

---

## Responsive Layout

| Breakpoint | Layout |
|------------|--------|
| Mobile | Single column, stacked sections |
| Desktop (lg) | 6-column grid (2 for brand, 1 each for links) |

---

## Grid Structure

```
┌──────────────────┬──────┬──────────┬──────────────┬─────────┐
│ BRAND            │ PLAT │ RESOURCE │ ORGANIZATION │ SUPPORT │
│ Logo + Info      │ FORM │   ES     │              │         │
│ (2 cols)         │      │          │              │         │
├──────────────────┴──────┴──────────┴──────────────┴─────────┤
│ [Social Icons]     © Copyright      [Privacy] [Terms]       │
└─────────────────────────────────────────────────────────────┘
```
