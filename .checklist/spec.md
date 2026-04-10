# ClimaSync.AI — Auth System Technical Specification

## API Contract

### Base URL
`NEXT_PUBLIC_API_BASE_URL` = `http://localhost:8000/api/v1`

### POST /auth/register
**Request**: `{ org_name: string, email: string, password: string }`  
**Response 201**: `{ message: string, email: string }`  
**Errors**: 409 (email exists), 422 (validation), 429 (rate limit)

### POST /auth/verify-otp
**Request**: `{ email: string, otp: string, org_name: string }`  
**Response 200**: `{ message, access_token, refresh_token, token_type, user }`  
**Errors**: 401 (invalid OTP), 403 (max attempts), 422 (expired/no pending)

### POST /auth/resend-otp
**Request**: `{ email: string }`  
**Response 200**: `{ message: string }`  
**Errors**: 404 (no account), 422 (already verified), 429 (rate limit)

### POST /auth/login
**Request**: `{ email: string, password: string }`  
**Response 200**: `{ message, access_token, refresh_token, token_type, user }`  
**Errors**: 401 (invalid creds), 403 (disabled/unverified), 429 (rate limit)

### User Object
```typescript
interface User {
  user_id: string;
  email: string;
  role: 'ngo_user' | 'admin' | 'super_admin';
  org_name: string;
  is_active: boolean;
  email_verified: boolean;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
}
```

## Token Strategy
- **Access Token**: 30 min expiry, stored in localStorage
- **Refresh Token**: 7 day expiry, stored in localStorage
- **Token Type**: `bearer`
- **Algorithm**: HS256
- **Auth Header**: `Authorization: Bearer <access_token>`

## Auth Flow

### Registration Flow
1. User fills form → POST /auth/register
2. Backend sends OTP to email
3. User enters OTP → POST /auth/verify-otp
4. Backend returns tokens + user
5. Frontend stores tokens, sets auth state, redirects to dashboard

### Login Flow
1. User fills email + password → POST /auth/login
2. Backend validates → returns tokens + user
3. Frontend stores tokens, sets auth state
4. If `redirect` query param exists, navigate there; else → dashboard

### Logout Flow
1. Clear localStorage tokens
2. Reset auth context state
3. Redirect to home page

## Route Structure
```
Public:     /, /map, /task, /news, /about
Auth:       /login, /register, /verify
Protected:  /dashboard/*, /admin/* (admin role only)
```

## Component Hierarchy
```
AuthProvider (context wrapper)
├── app/layout.tsx (root)
│   ├── Navbar (auth-aware)
│   ├── main > children
│   └── Footer (auth-aware)
├── (auth)/layout.tsx (no navbar/footer)
│   ├── /login → LoginForm
│   ├── /register → RegisterForm
│   └── /verify → OtpVerificationForm
└── ProtectedRoute wrapper
    ├── /dashboard/* (any authenticated user)
    └── /admin/* (admin/super_admin only)
```
