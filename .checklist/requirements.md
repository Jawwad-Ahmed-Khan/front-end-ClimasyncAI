# ClimaSync.AI — Authentication System Requirements

## Functional Requirements

### FR-1: User Registration (NGO)
- FR-1.1: User can register with organization name, email, and password
- FR-1.2: Password must be 8-72 characters
- FR-1.3: On registration, OTP is sent to the user's email
- FR-1.4: User must verify OTP (6-digit) to complete registration
- FR-1.5: User can request OTP resend (rate limited: 5/min)
- FR-1.6: After OTP verification, JWT tokens are returned and user is logged in

### FR-2: User Login
- FR-2.1: User can login with email and password
- FR-2.2: Login returns JWT access + refresh tokens
- FR-2.3: Login returns user profile (user_id, email, role, org_name, is_active, email_verified, verification_status)
- FR-2.4: Failed login returns generic "Invalid email or password" (anti-enumeration)
- FR-2.5: Login is rate-limited (10/min)

### FR-3: Social Login (Placeholder)
- FR-3.1: UI buttons for Google, Facebook, X, GitHub, Yahoo
- FR-3.2: Buttons show "Coming Soon" tooltip or trigger placeholder action
- FR-3.3: Code structure ready for OAuth redirect integration

### FR-4: Session Management
- FR-4.1: Access token stored in localStorage
- FR-4.2: Refresh token stored in localStorage
- FR-4.3: Auto-logout on token expiry
- FR-4.4: Auth state persists across page reloads
- FR-4.5: Logout clears all stored tokens

### FR-5: Protected Routes
- FR-5.1: Dashboard (`/dashboard/*`) requires authentication
- FR-5.2: Admin panel (`/admin/*`) requires admin or super_admin role
- FR-5.3: Unauthenticated users redirected to `/login?redirect=<path>`
- FR-5.4: After login, redirect back to intended page

### FR-6: Navbar Integration
- FR-6.1: Show Login/Register buttons when unauthenticated
- FR-6.2: Show user profile dropdown with name, Dashboard link, and Logout when authenticated
- FR-6.3: Show Admin link when user role is admin/super_admin

### FR-7: Footer Integration
- FR-7.1: Add Login/Register quick links

## Non-Functional Requirements

### NFR-1: Performance
- Pages must load in <2s on 3G
- No layout shift on auth state change
- Lazy-load OTP verification modal

### NFR-2: Security
- Tokens stored client-side only (no cookies for now)
- No sensitive data in URL parameters
- All API calls over HTTPS in production
- Password field never logged or exposed

### NFR-3: Accessibility
- All form fields have labels and aria attributes
- Keyboard navigation support
- Focus management on page navigation
- Error messages associated with fields

### NFR-4: Responsiveness
- Mobile-first design
- Full functionality on mobile, tablet, desktop
- Touch-friendly social login buttons

### NFR-5: Maintainability
- Modular file structure
- TypeScript strict mode
- All components self-contained
- Service layer abstracted from UI
