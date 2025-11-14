# Complete Testing Guide - All Features

## Prerequisites

- Django backend running at `http://127.0.0.1:8000`
- React frontend running at `http://localhost:5173`
- Test user account in Django database

---

## Quick Test (5 Minutes)

### Start Both Servers

**Terminal 1 - Django**:
```bash
cd icycon
python manage.py runserver
```

**Terminal 2 - React**:
```bash
cd frontend
npm run dev
```

### Test Login Flow
1. Open http://localhost:5173/
2. Click "Login" button
3. Enter email and password
4. Click submit
5. **Expected**: Redirected to dashboard

### Test Session Persistence
1. While logged in, press F5 (refresh)
2. **Expected**: Still logged in, no redirect to login

### Test User Display
1. Look at top-right navbar
2. **Expected**: See your email address

---

## Complete Feature Test (15 Minutes)

### Section 1: Landing Page (Home)

| Test | Steps | Expected |
|------|-------|----------|
| Page loads | Visit http://localhost:5173/ | See hero section with IcyCon branding |
| Login button | Click "Login" button | Navigate to /login |
| Signup button | Click "Sign Up" button | Navigate to /signup |
| Responsive | Resize window | Hamburger menu appears on mobile |
| Mobile menu | Click hamburger menu | Dropdown with Login/Signup appears |

### Section 2: Login Page

| Test | Steps | Expected |
|------|-------|----------|
| Navigate to login | Click Login from home | See login form |
| Form validation | Try submit without email | Error message appears |
| Valid login | Enter valid credentials | Redirected to /app/dashboard |
| Invalid login | Enter wrong password | Error message shows |
| Switch to signup | Click "Sign Up" link | Switch to signup form |
| Email display | After login, check navbar | User email shows |
| Loading state | Click submit | Submit button shows spinner |

### Section 3: Signup Page

| Test | Steps | Expected |
|------|-------|----------|
| Navigate to signup | Click Sign Up from home | See signup form |
| Password mismatch | Enter different passwords | Error alert on submit |
| Valid signup | Fill form and submit | Redirected to dashboard |
| Invalid email | Use existing email | Error message shows |
| Auto-generated username | Signup with email | Username extracted from email |

### Section 4: Dashboard

| Test | Steps | Expected |
|------|-------|----------|
| Dashboard loads | After login, see dashboard | Welcome message and data |
| Navbar shows email | Check top-right | User email displayed |
| Sidebar appears | Desktop view | Left sidebar with navigation |
| Mobile sidebar | Mobile view | Sidebar hidden, menu in navbar |
| Navigation links | Click each sidebar link | Navigate to corresponding page |

### Section 5: Navigation

| Test | Steps | Expected |
|------|-------|----------|
| Dashboard link | Click Dashboard | Navigate to /app |
| SEO Tools link | Click SEO Tools | Navigate to /app/seo |
| ASO link | Click ASO | Navigate to /app/aso |
| Marketplace link | Click Marketplace | Navigate to /app/marketplace |
| Analytics link | Click Analytics | Navigate to /app/analytics |
| Social Media link | Click Social Media | Navigate to /app/social |
| Email Engine link | Click Email Engine | Navigate to /app/email |
| Profile link | Click Profile | Navigate to /app/profile |
| Account link | Click Account | Navigate to /app/account |

### Section 6: Authentication & Session

| Test | Steps | Expected |
|------|-------|----------|
| Session persists | Login → Refresh → Navigate | Stay logged in |
| Logout button | Click Logout | Redirected to home |
| Clear localStorage | Logout → Check devtools | localStorage empty |
| Protected route | Type /app in URL bar | Accessible if logged in |
| Redirect if not auth | Clear localStorage → Visit /app | Redirected to /login |

### Section 7: User Data

| Test | Steps | Expected |
|------|-------|----------|
| Email in navbar | Check top-right navbar | User email displayed |
| Profile page | Go to /app/profile | User info displays |
| useAuth hook | In browser devtools | Can access user data |
| Token in storage | DevTools → Application | authToken stored |
| User data in storage | DevTools → Application | user object stored |

### Section 8: API Calls

| Test | Steps | Expected |
|------|-------|----------|
| SEO sites call | Navigate to /app/seo | Network tab shows /api/seo/sites/ |
| Auth header | Check request headers | Authorization: Token ... present |
| Credentials sent | Check request | credentials: 'include' |
| Response 200 | Check response | Status is 200 OK |
| Data displays | Check page | Data renders or empty state |

---

## Advanced Testing

### Section 9: Error Handling

| Test | Steps | Expected |
|------|-------|----------|
| Invalid token | Set bad token in localStorage | Error handling graceful |
| Network down | Close Django server | Error message shows |
| CORS error | Check browser console | No CORS errors |
| Form validation | Submit empty form | Validation errors appear |
| Duplicate email | Signup with existing email | Error message shows |

### Section 10: Browser DevTools

**Console Checks**:
```javascript
// After login, these should work:
localStorage.getItem('authToken')  // Has value
localStorage.getItem('user')       // Valid JSON
JSON.parse(localStorage.getItem('user')).email  // Shows email
```

**Network Tab Checks**:
```
1. Login request: POST /users/api/auth/login
   - Status: 200
   - Response has "token" and "user"

2. API calls: GET /api/seo/sites/, etc
   - Status: 200
   - Headers have "Authorization: Token ..."
```

**Application Tab Checks**:
```
- Storage → localStorage
  - authToken: populated after login
  - user: contains email and username
```

---

## Verification Checklist

### Critical Features ✅
- [ ] Can navigate to login/signup
- [ ] Can login with valid credentials
- [ ] Redirected to dashboard after login
- [ ] User email shows in navbar
- [ ] Session persists after refresh
- [ ] Can navigate between dashboard pages
- [ ] Can logout
- [ ] LocalStorage cleared after logout

### API Integration ✅
- [ ] Login request succeeds
- [ ] API calls include Authorization header
- [ ] Data loads on pages
- [ ] No CORS errors in console
- [ ] Network requests complete successfully

### User Experience ✅
- [ ] No full page reloads (smooth navigation)
- [ ] Loading states show spinners
- [ ] Error messages display clearly
- [ ] Forms validate on submit
- [ ] Responsive on mobile
- [ ] No console errors

### Data Persistence ✅
- [ ] Token saved to localStorage
- [ ] User data saved to localStorage
- [ ] Token retrieved on page reload
- [ ] User data retrieved on page reload
- [ ] AuthContext has user and token
- [ ] Pages can access user data via useAuth

---

## Test Scenarios

### Scenario 1: New User Sign Up
```
1. Navigate to home page
2. Click "Sign Up"
3. Enter new email, password, confirm password
4. Submit
5. ✅ Account created, logged in, dashboard shows
```

### Scenario 2: Returning User Login
```
1. Navigate to /login
2. Enter existing email and password
3. Submit
4. ✅ Logged in, dashboard shows
5. Press F5 to refresh
6. ✅ Still logged in
```

### Scenario 3: Session Timeout
```
1. Clear localStorage manually
2. Try to navigate to /app
3. ✅ Redirected to /login
```

### Scenario 4: Multi-Tab Session
```
1. Login in Tab A
2. Open same site in Tab B
3. ✅ Tab B should show as logged in (localStorage shared)
```

### Scenario 5: Mobile Navigation
```
1. Open on mobile device
2. Click hamburger menu
3. Click Login/Signup
4. ✅ Navigate to correct page
5. Complete login/signup
6. ✅ Dashboard responsive
```

---

## Performance Checks

| Metric | Target | Check |
|--------|--------|-------|
| Page Load | < 3s | Open DevTools Perf tab |
| Login | < 1s | Network tab POST request |
| Navigation | Instant | Click sidebar links |
| Data Load | < 2s | API response time |
| Memory | Stable | Check memory after 10 navigations |

---

## Troubleshooting

### Issue: Login button does nothing
**Check**:
1. Form submits (watch Network tab)
2. Console for errors
3. Django is running
4. SignupPage.tsx has correct login() call

**Fix**:
1. Verify: `login(response.user, response.token)`
2. Not: `login(user)`

### Issue: Session lost on refresh
**Check**:
1. localStorage has authToken
2. AuthContext useEffect runs
3. isLoading becomes false

**Fix**:
1. Check localStorage isn't disabled
2. Verify useEffect in AuthContext

### Issue: User email doesn't show
**Check**:
1. localStorage has user data
2. useAuth returns user
3. Component renders user.email

**Fix**:
1. Verify user object in localStorage
2. Check component uses useAuth()
3. Use user?.email (optional chaining)

### Issue: Navigation buttons don't work
**Check**:
1. React Router is initialized
2. Navigate function is called
3. Browser history changes

**Fix**:
1. Verify useNavigate() import
2. Check onClick handlers
3. Verify routes in App.tsx

### Issue: API calls fail with 401
**Check**:
1. Token is in localStorage
2. Authorization header sent
3. Token is valid

**Fix**:
1. Try logout and login again
2. Check Django token authentication
3. Verify getAuthHeaders() in config/api.ts

---

## Success Criteria

When you see all of these, you're ready to go:

✅ Login works
✅ User stays logged in after refresh
✅ User email displays in navbar
✅ All navigation buttons work
✅ Dashboard pages load
✅ No console errors
✅ No CORS errors
✅ API calls have Authorization header
✅ Logout works
✅ localStorage has token and user

---

## Sign-Off

Once all tests pass:

```bash
# Run one final complete flow test:
1. Logout if logged in
2. Visit http://localhost:5173
3. Click Sign Up
4. Create new test account
5. Complete dashboard tour
6. Logout
7. Login with same account
8. Press F5 and verify still logged in
9. ✅ COMPLETE SUCCESS!
```

---

## Next Steps

After successful testing:
1. Deploy to staging
2. Run same tests on staging
3. Configure production environment
4. Deploy to production
5. Monitor for errors

See `VERIFICATION_CHECKLIST.md` for production readiness items.
