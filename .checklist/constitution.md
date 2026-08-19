# ClimaSync.AI — Auth System Constitution

## Architectural Principles

### 1. Separation of Concerns
- **Service Layer** (`authService.ts`): All API communication
- **Context Layer** (`authContext.tsx`): State management
- **UI Layer** (components): Presentation only
- **Guard Layer** (`authGuard.tsx`): Route protection

### 2. Backend Independence
- Frontend MUST work with any backend implementation
- All API calls go through `authService.ts`
- Backend base URL is an environment variable
- No backend code exists in the frontend repo

### 3. Design System Adherence
- **Theme**: Tactical Dark Mode (slate-950 base, cyan/blue accents)
- **Glassmorphism**: Semi-transparent panels with blur
- **Animations**: Framer Motion for transitions
- **Icons**: Lucide React exclusively
- **Fonts**: System Geist Sans / Geist Mono
- **Styling**: Tailwind CSS v4

### 4. Modular Structure
- Each feature in its own directory
- Shared components in `_components/auth/`
- Types in `_lib/auth/authTypes.ts`
- Constants in `_lib/auth/authConstants.ts`

## Coding Standards

### TypeScript
- Strict mode enabled
- All function parameters typed
- All return types declared
- No `any` types
- Use `interface` for object shapes

### Components
- Functional components only
- "use client" directive where needed
- Props interface defined above component
- Default exports for page components
- Named exports for shared components

### State Management
- React Context for auth state
- No external state libraries
- Custom hooks for consuming context

### Error Handling
- All API errors caught in service layer
- Error state managed in context
- User-friendly error messages displayed
- Never expose stack traces

### Git
- Feature branches from `feature/auth-system`
- Descriptive commit messages
- No force pushes to shared branches
