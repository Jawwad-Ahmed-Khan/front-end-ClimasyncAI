# Admin Dashboard - Troubleshooting Guide

This document covers common errors encountered during Admin Dashboard development with Next.js 16 + Turbopack, their causes, and solutions.

---

## Table of Contents
1. [Quick Commands Reference](#quick-commands-reference)
2. [Error: Invalid or Unexpected Token](#error-invalid-or-unexpected-token)
3. [Error: styled-jsx Parsing Failure](#error-styled-jsx-parsing-failure)
4. [Error: Multiline className Strings](#error-multiline-classname-strings)
5. [Error: Module Not Found](#error-module-not-found)
6. [Error: Hydration Mismatch](#error-hydration-mismatch)
7. [Testing Commands](#testing-commands)
8. [Best Practices](#best-practices)

---

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npx tsc --noEmit` | TypeScript syntax check (no output) |
| `Remove-Item -Recurse -Force .next` | Clear Next.js cache (PowerShell) |
| `rm -rf .next` | Clear Next.js cache (Bash/Unix) |

---

## Error: Invalid or Unexpected Token

### Symptoms
```
SyntaxError: Invalid or unexpected token
    at <unknown> (D:\..\.next\dev\server\chunks\ssr\app_admin_*.js:577)
```

### Cause
Turbopack's parser encounters syntax it cannot process. Common causes:
1. `<style jsx>` tags inside components
2. Multiline `className` strings with line breaks
3. Template literals with complex expressions

### Solution

**Step 1: Clear the cache**
```powershell
Remove-Item -Recurse -Force .next
```

**Step 2: Check for styled-jsx tags**
```tsx
// ❌ WRONG - styled-jsx causes Turbopack parsing errors
<style jsx>{`
    @media (max-width: 1023px) {
        main { margin-left: 0 !important; }
    }
`}</style>

// ✅ CORRECT - Use inline styles or Tailwind responsive classes
<div className="ml-0 lg:ml-[280px]">
```

**Step 3: Check for multiline className strings**
```tsx
// ❌ WRONG - Line breaks inside className strings
<div className="fixed top-0 right-0 
                bg-slate-950 border-b">

// ✅ CORRECT - Single line className
<div className="fixed top-0 right-0 bg-slate-950 border-b">
```

**Step 4: Restart dev server**
```bash
npm run dev
```

---

## Error: styled-jsx Parsing Failure

### Symptoms
```
Error: Failed to load chunk server/chunks/ssr/app_admin_*.js
cause: SyntaxError: Invalid or unexpected token
```

### Cause
Next.js 16 with Turbopack does not fully support `styled-jsx` in all contexts. The CSS-in-JS syntax inside template literals can cause parsing failures.

### Solution

**Remove styled-jsx and use alternatives:**

```tsx
// ❌ BEFORE - styled-jsx
<header style={{ left: 80 }}>
    <style jsx>{`
        @media (max-width: 1023px) {
            header { left: 0 !important; }
        }
    `}</style>
</header>

// ✅ AFTER - Responsive with JS + Tailwind
<header 
    className="left-0 lg:left-auto"
    style={{ 
        left: typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (isCollapsed ? 80 : 280) 
            : 0 
    }}
>
```

**Alternative: Use CSS Modules**
```tsx
// styles.module.css
.header {
    left: 0;
}
@media (min-width: 1024px) {
    .header {
        left: 280px;
    }
}

// Component
import styles from './styles.module.css';
<header className={styles.header}>
```

---

## Error: Multiline className Strings

### Symptoms
```
Expected ',', got 'bg'
className: "jsx-..." + " " + "fixed top-20 right-0 z-30 h-16
                      bg-slate-950/90
```

### Cause
When className strings span multiple lines, the JavaScript parser may misinterpret line breaks as statement ends.

### Solution

**Always write className on a single line:**

```tsx
// ❌ WRONG
<div className="w-10 h-10 rounded-xl bg-linear-to-br 
                from-red-500 via-orange-500 to-amber-500 
                flex items-center justify-center">

// ✅ CORRECT
<div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 via-orange-500 to-amber-500 flex items-center justify-center">
```

**For very long classes, use clsx or cn helper:**
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
    "w-10 h-10 rounded-xl",
    "bg-linear-to-br from-red-500 via-orange-500 to-amber-500",
    "flex items-center justify-center"
)}>
```

---

## Error: Module Not Found

### Symptoms
```
Error: Cannot find module '../chunks/ssr/[turbopack]_runtime.js'
Error: ENOENT: no such file or directory, open '.next/dev/server/app/admin/page/build-manifest.json'
```

### Cause
Corrupted `.next` cache or incomplete build artifacts.

### Solution

**Step 1: Stop all Node processes**
```powershell
# PowerShell
taskkill /F /IM node.exe

# Or Bash
pkill -f node
```

**Step 2: Delete .next folder**
```powershell
Remove-Item -Recurse -Force .next
```

**Step 3: Restart dev server**
```bash
npm run dev
```

---

## Error: Hydration Mismatch

### Symptoms
```
Warning: Text content did not match. Server: "..." Client: "..."
Error: Hydration failed because the initial UI does not match
```

### Cause
Component renders different content on server vs client. Common causes:
- Using `Date.now()` or `Math.random()` during render
- Accessing `window` or `document` without checks
- Dynamic data without proper initialization

### Solution

**Use static initial values:**
```tsx
// ❌ WRONG - Random value during render
const [data] = useState(generateRandomData());

// ✅ CORRECT - Static default, dynamic after mount
const [data, setData] = useState(staticDefault);
const [mounted, setMounted] = useState(false);

useEffect(() => {
    setMounted(true);
    setData(generateRandomData());
}, []);

if (!mounted) return null; // or loading skeleton
```

**Check for window before using:**
```tsx
// ❌ WRONG
const width = window.innerWidth;

// ✅ CORRECT
const width = typeof window !== 'undefined' ? window.innerWidth : 0;
```

---

## Testing Commands

### Development Testing
```bash
# Start dev server
npm run dev

# Check TypeScript errors without building
npx tsc --noEmit

# Run ESLint
npm run lint
```

### Production Testing
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Cache Management
```powershell
# Clear Next.js cache (PowerShell)
Remove-Item -Recurse -Force .next

# Clear all caches
Remove-Item -Recurse -Force .next, node_modules\.cache
```

### Full Reset
```bash
# Complete reset and fresh install
rm -rf .next node_modules
npm install
npm run dev
```

---

## Best Practices

### 1. Avoid styled-jsx with Turbopack
Use Tailwind CSS classes or CSS Modules instead.

### 2. Keep className on single lines
Long className strings should use template literals or cn() helpers.

### 3. Initialize state with static values
Use `useEffect` to set dynamic values after mount.

### 4. Check for window/document
Always verify they exist before using browser APIs.

### 5. Clear cache when stuck
Most "weird" errors are solved by deleting `.next`.

### 6. Use TypeScript checks frequently
```bash
npx tsc --noEmit
```

---

## Files Modified During Troubleshooting

| File | Change |
|------|--------|
| `layout.tsx` | Removed styled-jsx, fixed responsive margin |
| `AdminHeader.tsx` | Removed styled-jsx, fixed responsive left position |
| `AdminSidebar.tsx` | Fixed multiline className strings |
| `page.tsx` | Fixed multiline className strings |

---

## Related Documentation

- [Next.js 16 Turbopack](https://nextjs.org/docs/architecture/turbopack)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Hydration Errors](https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content)
