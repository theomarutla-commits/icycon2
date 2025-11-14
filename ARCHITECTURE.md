# React-Django Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React App (Frontend)                    │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                  index.tsx                           │ │ │
│  │  │  <AuthProvider>                                      │ │ │
│  │  │    <App />                                           │ │ │
│  │  │  </AuthProvider>                                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                  App.tsx                             │ │ │
│  │  │  - Checks isLoading                                  │ │ │
│  │  │  - Routes protected pages                            │ │ │
│  │  │  - Shows loading indicator                           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │             AuthContext.tsx                          │ │ │
│  │  │  - user: User | null                                 │ │ │
│  │  │  - token: string | null                              │ │ │
│  │  │  - isLoading: boolean                                │ │ │
│  │  │  - useEffect: Load from localStorage                 │ │ │
│  │  │  - login(), logout()                                 │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │        ↙️                        ↖️                        │ │
│  │  ┌──────────────────┐  ┌──────────────────┐              │ │
│  │  │  localStorage    │  │  App Routes      │              │ │
│  │  │  - authToken     │  │  - /             │              │ │
│  │  │  - user          │  │  - /login        │              │ │
│  │  │                  │  │  - /app/...      │              │ │
│  │  └──────────────────┘  └──────────────────┘              │ │
│  │                         ↓                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │           Page Components                            │ │ │
│  │  │  - SEOPage                                           │ │ │
│  │  │  - ASOPage                                           │ │ │
│  │  │  - MarketplacePage                                   │ │ │
│  │  │  - etc.                                              │ │ │
│  │  │  (All use useAuth() and call api.*)                  │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │           api/auth.ts                                │ │ │
│  │  │  export const api = {                                │ │ │
│  │  │    login()                                           │ │ │
│  │  │    signup()                                          │ │ │
│  │  │    getSEOSites()                                     │ │ │
│  │  │    getMarketplaceProducts()                          │ │ │
│  │  │    etc...                                            │ │ │
│  │  │  }                                                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │        config/api.ts                                 │ │ │
│  │  │  - API_BASE: http://127.0.0.1:8000                   │ │ │
│  │  │  - getAuthHeaders(token)                             │ │ │
│  │  │  - handleApiError()                                  │ │ │
│  │  │  - apiRequest()                                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Network Requests                           │   │
│  │  (HTTP with Authorization header)                       │   │
│  │                                                          │   │
│  │  POST /users/api/auth/login                             │   │
│  │  POST /users/api/auth/signup                            │   │
│  │  GET  /api/seo/sites/                                   │   │
│  │  GET  /api/aso/apps/                                    │   │
│  │  GET  /api/marketplace/products/                        │   │
│  │  etc.                                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                ↓
                   HTTP/CORS with JSON
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Django Backend                                  │
│                  (http://127.0.0.1:8000)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Django REST Framework Settings                           │   │
│  │ - CORS enabled for frontend                              │   │
│  │ - Token Authentication enabled                           │   │
│  │ - DRF routers and viewsets                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              URL Routing                                 │   │
│  │  urls.py: Main URL config                                │   │
│  │  api_urls.py: API endpoint definitions                   │   │
│  │                                                           │   │
│  │  /users/api/auth/          → users app auth views        │   │
│  │  /api/seo/                 → SEO API endpoints           │   │
│  │  /api/aso/                 → ASO API endpoints           │   │
│  │  /api/marketplace/         → Marketplace endpoints       │   │
│  │  /api/analytics/           → Analytics endpoints        │   │
│  │  etc.                                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         API Views & ViewSets                             │   │
│  │  - Authenticate using Token                              │   │
│  │  - Serialize models to JSON                              │   │
│  │  - Return filtered data                                  │   │
│  │  - Handle POST/PATCH/DELETE                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Database Models                                   │   │
│  │  - User (Custom)                                         │   │
│  │  - SEOSite                                               │   │
│  │  - ASOApp                                                │   │
│  │  - MarketplaceProduct                                    │   │
│  │  - etc.                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        SQLite Database                                   │   │
│  │  (db.sqlite3)                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER LOGS IN                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User enters email & password                                    │
│           ↓                                                       │
│  Components/SignupPage → api.login(email, password)              │
│           ↓                                                       │
│  fetch POST /users/api/auth/login                                │
│  {                                                               │
│    "email": "user@example.com",                                  │
│    "password": "password123"                                     │
│  }                                                               │
│           ↓                                                       │
│  Django authenticates user                                       │
│           ↓                                                       │
│  Returns {                                                       │
│    "token": "abc123def456...",                                   │
│    "user": { "email": "user@example.com", "username": "john" }  │
│  }                                                               │
│           ↓                                                       │
│  api.login() stores in localStorage:                             │
│    localStorage.authToken = "abc123def456..."                    │
│    localStorage.user = {"email": ..., "username": ...}           │
│           ↓                                                       │
│  AuthContext.login() updates state:                              │
│    user = { email, username }                                    │
│    token = "abc123def456..."                                     │
│           ↓                                                       │
│  App redirects to /app (Dashboard)                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## API Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 2. FETCHING DATA (e.g., SEO sites)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page mounts: SEOPage.tsx                                        │
│           ↓                                                       │
│  useEffect calls api.getSEOSites()                               │
│           ↓                                                       │
│  api.getSEOSites() calls:                                        │
│    fetch('http://127.0.0.1:8000/api/seo/sites/', {              │
│      headers: {                                                  │
│        'Authorization': 'Token abc123def456...',                 │
│        'Content-Type': 'application/json'                        │
│      },                                                          │
│      credentials: 'include'                                      │
│    })                                                            │
│           ↓                                                       │
│  Django receives request:                                        │
│    - Extracts token from Authorization header                    │
│    - Verifies token is valid                                     │
│    - Gets user from token                                        │
│    - Queries SEOSite model (filtered by user)                    │
│           ↓                                                       │
│  Returns JSON response:                                          │
│    [                                                             │
│      { "id": 1, "domain": "example.com", ... },                  │
│      { "id": 2, "domain": "test.com", ... }                      │
│    ]                                                             │
│           ↓                                                       │
│  Component receives data                                         │
│  setSites(data)                                                  │
│           ↓                                                       │
│  Component re-renders with SEO sites                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Session Persistence Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 3. PAGE REFRESH (maintaining session)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User refreshes page                                             │
│           ↓                                                       │
│  App remounts, AuthContext initializes                           │
│           ↓                                                       │
│  useEffect in AuthContext runs:                                  │
│    1. Get authToken from localStorage                            │
│       → "abc123def456..."                                        │
│    2. Get user from localStorage                                 │
│       → { "email": "user@example.com", "username": "john" }      │
│    3. Set token state = "abc123def456..."                        │
│    4. Set user state = { email, username }                       │
│    5. Set isLoading = false                                      │
│           ↓                                                       │
│  App.tsx renders:                                                │
│    - isLoading is false, so routes render                        │
│    - useAuth() shows user is logged in                           │
│    - user is not null, so protected routes accessible            │
│           ↓                                                       │
│  User is still logged in! ✅                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 4. ERROR SCENARIOS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  A. Invalid Token                                                │
│     - API returns 401 Unauthorized                               │
│     - Should: Logout and redirect to login                       │
│     - Current: Shows error message                               │
│                                                                  │
│  B. Missing Authorization                                        │
│     - Page accessed without token                                │
│     - Should: Redirect to login before API call                  │
│     - Current: api.js checks for token first                     │
│                                                                  │
│  C. CORS Error                                                   │
│     - Browser blocks cross-origin request                        │
│     - Should: Check Django CORS_ALLOWED_ORIGINS                  │
│     - Solution: ✅ Fixed in settings.py                          │
│                                                                  │
│  D. Network Error                                                │
│     - Server unreachable                                         │
│     - Should: Show error message to user                         │
│     - Current: Try-catch in components                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### ✅ Authentication Persistence
- Token stored in localStorage
- User data cached in state
- Session survives page refresh
- Automatic recovery on app restart

### ✅ API Integration
- Centralized configuration
- Consistent header injection
- Standardized error handling
- Token-based auth for all requests

### ✅ Loading States
- App checks isLoading before rendering
- Prevents flash of redirects
- Shows loading indicator to user
- Smooth UX on app startup

### ✅ Type Safety
- TypeScript interfaces for all API types
- Context provides typed user and token
- Compile-time error checking
- Better IDE autocomplete

### ✅ CORS Handling
- credentials: 'include' on all requests
- Proper header configuration
- Django CORS headers enabled
- Production-ready setup
