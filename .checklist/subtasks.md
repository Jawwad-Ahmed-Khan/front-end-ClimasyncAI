# ClimaSync.AI — Auth System Subtasks

## ST-T2.1: authTypes.ts
- Define User interface (user_id, email, role, org_name, is_active, email_verified, verification_status)
- Define AuthTokens interface (access_token, refresh_token, token_type)
- Define LoginCredentials type (email, password)
- Define RegisterData type (org_name, email, password)
- Define VerifyOtpData type (email, otp, org_name)
- Define AuthState interface (user, tokens, isAuthenticated, isLoading, error)
- Define SocialProvider enum (google, facebook, x, github, yahoo)
- Define AuthError type with code and message

## ST-T2.3: authService.ts
- Create axios instance with base URL
- Implement loginAPI(credentials) → API call + error mapping
- Implement registerAPI(data) → API call + error mapping
- Implement verifyOtpAPI(data) → API call + error mapping
- Implement resendOtpAPI(email) → API call + error mapping
- Implement token storage helpers (get/set/clear)
- Implement error response parser

## ST-T2.4: authContext.tsx
- Create AuthContext with Provider
- Implement login action (call service, store tokens, set state)
- Implement register action (call service, return for OTP step)
- Implement verifyOtp action (call service, store tokens, set state)
- Implement logout action (clear all, redirect)
- Implement useEffect for hydrating auth state on mount
- Export AuthProvider component

## ST-T4.1: AuthHeroPanel.tsx
- Disaster management background image (AI generated)
- ClimasyncAI logo + tagline
- Animated gradient overlays
- Statistical trust indicators
- Responsive: hidden on mobile, visible on lg+

## ST-T5.2: Login Page
- Email input with validation
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link (placeholder)
- Sign In button with loading spinner
- Social login section with 5 providers
- "Don't have an account? Register" link
- Error message display
- Form validation before submit

## ST-T5.3: Register Page
- Organization name input
- Email input with validation
- Password input with strength indicator
- Confirm password input with match validation
- Terms & Conditions checkbox
- Create Account button with loading spinner
- Social signup section with 5 providers
- "Already have an account? Login" link

## ST-T5.4: OTP Verification Page
- 6-digit OTP input (individual boxes or single input)
- Resend OTP button with cooldown timer
- Email display (masked partially)
- Back to registration link
- Auto-submit on 6th digit
