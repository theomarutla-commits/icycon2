# React-Django Integration Fixes - Complete Guide

## Issues Fixed

### 1. **AuthContext Not Persisting User State** ✅
**Problem**: When refreshing the page, the user was lost because AuthContext didn't check localStorage on initialization.

**Solution**: Updated `AuthContext.tsx` to:
- Initialize auth state from localStorage on mount
- Added `useEffect` hook to load stored token and user on app startup
- Export `token` alongside `user` for better type safety
- Added `isLoading` state to prevent premature route guards

### 2. **No Centralized API Configuration** ✅
**Problem**: API_BASE was hardcoded, CORS headers weren't consistent, and error handling was scattered.

**Solution**: Created `frontend/src/config/api.ts` with:
- Centralized `getApiBase()` function for environment-based URLs
- `getCommonHeaders()` and `getAuthHeaders()` for consistent header management
- `apiRequest()` utility for standardized API calls
- Improved error handling with JSON parsing fallbacks

### 3. **Missing credentials in API Calls** ✅
**Problem**: `credentials: 'include'` was missing, preventing CORS cookies from being sent.

**Solution**: Added `credentials: 'include'` to all fetch requests in `auth.ts`.

### 4. **Loading State Not Handled** ✅
**Problem**: Routes rendered before AuthContext loaded stored credentials, causing flash of redirect.

**Solution**: Added `isLoading` state to AuthContext and loading check in App component.

## File Changes Summary

### Modified Files:

#### 1. `frontend/src/context/AuthContext.tsx`
```typescript
// Key additions:
- Added useEffect for localStorage initialization
- Added token state and isLoading state
- Login now accepts both user and token parameters
- Auto-recovery of session on app mount
```

#### 2. `frontend/src/api/auth.ts`
```typescript
// Key additions:
- Import centralized API config
- Added credentials: 'include' to all requests
- Using getAuthHeaders() from config
```

#### 3. `frontend/src/config/api.ts` (NEW FILE)
```typescript
// Exports:
- API_BASE: Dynamic URL based on environment
- getCommonHeaders(): Standard headers
- getAuthHeaders(token): Auth headers with token
- handleApiError(): Centralized error handling
- apiRequest(): Standardized fetch utility
```

#### 4. `frontend/src/App.tsx`
```typescript
// Key additions:
- Check isLoading before rendering routes
- Show loading indicator while auth state initializes
- Better UX preventing flashing redirects
```

## Testing the Integration

### Test 1: Authentication Persistence
1. Start Django backend: `python manage.py runserver`
2. Start React frontend: `npm run dev`
3. Login with valid credentials
4. Refresh the page (F5 or Cmd+R)
5. **Expected**: User should remain logged in

### Test 2: API Calls Work
1. While logged in, navigate to SEO page (`/app/seo`)
2. Check browser Network tab for API calls
3. **Expected**: Requests should go to `http://127.0.0.1:8000/api/seo/sites/`
4. **Expected**: Authorization header should contain token

### Test 3: CORS Handling
1. Open browser console
2. Navigate between pages
3. **Expected**: No CORS errors in console
4. **Expected**: Requests include `Authorization: Token <token>`

### Test 4: Error Handling
1. Logout and try accessing `/app/*` routes
2. **Expected**: Redirected to `/login`
3. Clear localStorage and refresh
4. **Expected**: Redirected to landing page

## Environment Configuration

For production or different environments, create a `.env` file:

```bash
# .env file in frontend directory
REACT_APP_API_BASE=https://api.yourdomain.com
```

The `getApiBase()` function will use this in development, and use relative URLs in production.

## Django Backend Requirements

Ensure Django is configured correctly:

```python
# settings.py should have:
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    # Add production domain
]

INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]
```

## Debugging Tips

### Check localStorage in Browser
```javascript
// In browser console:
console.log(localStorage.getItem('authToken'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### Check API Responses
1. Open DevTools > Network tab
2. Filter by XHR/Fetch
3. Click on API request
4. Check Response and Headers tabs
5. Look for `Authorization: Token ...` in Request Headers

### Check React State
```javascript
// In browser console during development:
console.log('Auth context state:', {
  user: localStorage.getItem('user'),
  token: localStorage.getItem('authToken'),
});
```

## Common Issues and Solutions

### Issue: "Not authenticated" errors
**Solution**: 
- Ensure user is logged in first
- Check `localStorage.getItem('authToken')` is not null
- Verify token is being sent in request headers

### Issue: CORS errors
**Solution**:
- Check Django CORS_ALLOWED_ORIGINS includes React dev server
- Add `credentials: 'include'` to fetch requests ✅ (Already done)
- Verify CSRF tokens if applicable

### Issue: 404 errors on API calls
**Solution**:
- Verify API_BASE is correct (should be `http://127.0.0.1:8000`)
- Check Django URLconf includes the `/api/` routes
- Verify API endpoints are registered in `icycon/api_urls.py`

### Issue: Session lost on page refresh
**Solution**:
- AuthContext now handles this with localStorage ✅
- If still having issues, check browser localStorage is not disabled
- Verify cookies are being set properly

## Next Steps

1. **Test all flows** with the fixes in place
2. **Add error boundary** to catch rendering errors
3. **Implement token refresh** logic when token expires
4. **Add loading states** to individual page components
5. **Implement proper logout** that clears all state

## Files to Review

Before deploying to production:
- [ ] `frontend/src/config/api.ts` - API configuration
- [ ] `frontend/src/context/AuthContext.tsx` - Auth state management
- [ ] `frontend/src/api/auth.ts` - API client functions
- [ ] `frontend/src/App.tsx` - Root component with loading state
- [ ] Django `settings.py` - CORS and auth configuration
- [ ] Django `icycon/api_urls.py` - API endpoint definitions
