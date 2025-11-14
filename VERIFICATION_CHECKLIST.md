# Verification Checklist

## Pre-Flight Checks

Before testing, verify all files are in place:

### ✅ Modified Files
- [ ] `frontend/src/context/AuthContext.tsx` - Has `useEffect` and `isLoading`
- [ ] `frontend/src/App.tsx` - Has loading state check
- [ ] `frontend/src/api/auth.ts` - Imports from config and adds `credentials`

### ✅ New Files
- [ ] `frontend/src/config/api.ts` - Exists with all exports

### ✅ Documentation
- [ ] `REACT_DJANGO_FIX_GUIDE.md` - Created
- [ ] `QUICK_TEST_GUIDE.md` - Created
- [ ] `INTEGRATION_FIX_SUMMARY.md` - Created
- [ ] `ARCHITECTURE.md` - Created
- [ ] `CHANGES_MADE.md` - Created

---

## File Existence Verification

Run these commands to verify all files exist:

```bash
# Check modified files
ls -la frontend/src/context/AuthContext.tsx
ls -la frontend/src/App.tsx
ls -la frontend/src/api/auth.ts

# Check new files
ls -la frontend/src/config/api.ts

# Check documentation
ls -la REACT_DJANGO_FIX_GUIDE.md
ls -la QUICK_TEST_GUIDE.md
ls -la INTEGRATION_FIX_SUMMARY.md
ls -la ARCHITECTURE.md
ls -la CHANGES_MADE.md
```

---

## Code Verification

### 1. AuthContext.tsx Verification

Should contain:
- ✅ `import { useEffect }` in imports
- ✅ `token: string | null` in AuthContextType
- ✅ `isLoading: boolean` in AuthContextType
- ✅ `const [token, setToken] = useState<string | null>(null);`
- ✅ `const [isLoading, setIsLoading] = useState(true);`
- ✅ `useEffect(() => { ... }, [])` hook
- ✅ `localStorage.getItem('authToken')` call
- ✅ `JSON.parse(localStorage.getItem('user'))` call

Check with:
```bash
grep -n "useEffect\|token: string\|isLoading" frontend/src/context/AuthContext.tsx
```

### 2. App.tsx Verification

Should contain:
- ✅ `const { user, isLoading } = useAuth();`
- ✅ `if (isLoading) { return ... }`
- ✅ Loading indicator UI

Check with:
```bash
grep -n "isLoading\|Loading\.\.\." frontend/src/App.tsx
```

### 3. api/auth.ts Verification

Should contain:
- ✅ Import: `import { API_BASE, apiRequest, getAuthHeaders } from '../config/api';`
- ✅ Multiple instances of `credentials: 'include'`
- ✅ No hardcoded `const API_BASE = ...`

Check with:
```bash
grep -n "import.*config/api\|credentials: 'include'" frontend/src/api/auth.ts | head -5
```

### 4. config/api.ts Verification

Should export:
- ✅ `export const API_BASE`
- ✅ `export const getCommonHeaders`
- ✅ `export const getAuthHeaders`
- ✅ `export const handleApiError`
- ✅ `export const apiRequest`

Check with:
```bash
grep -n "^export" frontend/src/config/api.ts
```

---

## TypeScript Compilation Check

No TypeScript errors should appear:

```bash
cd frontend
# Try running type check (if available)
npx tsc --noEmit
```

Expected result: No errors

---

## Import Path Verification

Verify imports in auth.ts:

```bash
grep "import.*config/api" frontend/src/api/auth.ts
```

Expected output:
```
import { API_BASE, apiRequest, getAuthHeaders } from '../config/api';
```

---

## Runtime Verification Steps

1. **Start Django:**
   ```bash
   cd icycon
   python manage.py runserver
   ```
   
   Verify: Terminal shows "Starting development server at http://127.0.0.1:8000/"

2. **Start React:**
   ```bash
   cd frontend
   npm run dev
   ```
   
   Verify: Terminal shows "Local: http://localhost:5173/"

3. **Test Login:**
   - Navigate to http://localhost:5173/login
   - Enter credentials
   - Should redirect to /app

4. **Test Persistence:**
   - Refresh page (F5)
   - Should stay on /app, not redirect to login
   - Check localStorage:
     ```javascript
     localStorage.getItem('authToken')  // Has value
     localStorage.getItem('user')       // Has value
     ```

5. **Test API Calls:**
   - Navigate to http://localhost:5173/app/seo
   - Open DevTools → Network tab
   - Look for request to /api/seo/sites/
   - Verify:
     - Status is 200 OK
     - Authorization header present
     - Response is JSON array

6. **Test Error Handling:**
   - Clear localStorage:
     ```javascript
     localStorage.clear()
     ```
   - Refresh page
   - Should redirect to landing page

---

## Browser Console Checks

When logged in, these should work:

```javascript
// Check token
localStorage.getItem('authToken')
// Output: "abc123def456..." (some token value)

// Check user
JSON.parse(localStorage.getItem('user'))
// Output: { email: "user@example.com", username: "john", ... }

// Check API base
// Open Network tab and look at request URLs
// Should start with http://127.0.0.1:8000 (or empty in production)
```

---

## Network Tab Verification

When making API calls, verify:

Request:
- ✅ URL contains `/api/...` endpoint
- ✅ Method is GET, POST, PATCH, or DELETE as appropriate
- ✅ Status is 200 OK (or appropriate status)

Request Headers:
- ✅ `Authorization: Token <token-value>`
- ✅ `Content-Type: application/json`

Response:
- ✅ Valid JSON data
- ✅ Appropriate for the endpoint

---

## Error Scenarios to Test

1. **Invalid Token:**
   - Clear localStorage
   - Try accessing /app
   - Should redirect to /login

2. **Expired Token:**
   - Set token to invalid value in localStorage
   - Try to load data
   - Should show error (or redirect to login)

3. **Network Error:**
   - Disconnect internet or close Django server
   - Try to load data
   - Should show error message

4. **CORS Error:**
   - Should NOT see CORS errors in console
   - If you do, check Django CORS settings

---

## Performance Checks

- [ ] App loads in < 3 seconds
- [ ] Page navigation is smooth
- [ ] No console warnings or errors
- [ ] API requests complete in < 1 second
- [ ] No memory leaks on page refresh

---

## Browser Compatibility

Test in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Edge

All should work the same way.

---

## Mobile Testing

If applicable:
- [ ] Responsive design works
- [ ] Touch events work
- [ ] localStorage works on mobile
- [ ] API calls work on mobile

---

## Production Readiness Checklist

Before deploying:

- [ ] All environment variables configured
- [ ] CORS allowed origins set correctly
- [ ] API_BASE configured for production domain
- [ ] Token refresh logic implemented (if needed)
- [ ] Error boundaries added
- [ ] Logging set up
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Database backups working
- [ ] Error tracking set up (Sentry, etc.)

---

## Issues Found During Testing

Document any issues found:

```
Issue: ___________________________________
Steps to Reproduce:
1. ___________________________________
2. ___________________________________
3. ___________________________________

Expected: ___________________________________
Actual: ___________________________________
Solution: ___________________________________
```

---

## Sign-Off

When all checks pass, you can confidently use:

- ✅ React app with authentication
- ✅ Session persistence across refreshes
- ✅ Proper API integration with Django
- ✅ Type-safe authentication
- ✅ Good error handling
- ✅ Production-ready setup

---

## Support Files

If issues arise, refer to:
- `REACT_DJANGO_FIX_GUIDE.md` - Detailed guide
- `ARCHITECTURE.md` - System overview
- `QUICK_TEST_GUIDE.md` - Testing procedures
- `CHANGES_MADE.md` - What was changed
- `INTEGRATION_FIX_SUMMARY.md` - Executive summary

---

## Questions?

Common issues and solutions:

**Q: Session lost on refresh**
A: Check localStorage is not disabled, verify AuthContext useEffect

**Q: API returns 401**
A: Check Authorization header is being sent, verify token is valid

**Q: CORS errors**
A: Check Django CORS_ALLOWED_ORIGINS, verify credentials: 'include'

**Q: Data not loading**
A: Check API endpoint exists in Django, verify user has permissions

**Q: Loading stuck**
A: Check Django is running, check isLoading state in React DevTools
