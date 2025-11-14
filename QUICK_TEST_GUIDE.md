# Quick Start - Test React-Django Integration

## Prerequisites
- Django backend running on `http://127.0.0.1:8000`
- React dev server running on `http://127.0.0.1:3000` (or 5173 if using Vite)
- Database populated with test user accounts

## Step 1: Start Django Backend

```bash
cd icycon
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Step 2: Start React Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v6.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Step 3: Test Login Flow

1. Open browser to `http://localhost:5173/`
2. Click "Sign In" or navigate to `/login`
3. Enter valid credentials (or create new account)
4. **Expected Result**: Redirected to `/app` (Dashboard)

## Step 4: Test Session Persistence

1. While logged in, refresh the page (F5)
2. **Expected Result**: User stays logged in (no redirect to login)
3. Check browser console:
   ```javascript
   localStorage.getItem('authToken')  // Should have a value
   localStorage.getItem('user')       // Should have user object
   ```

## Step 5: Test API Calls

1. Navigate to `/app/seo`
2. Open DevTools (F12) → Network tab
3. Look for requests to `http://127.0.0.1:8000/api/seo/sites/`
4. Click the request and check:
   - **Status**: 200 OK
   - **Request Headers**: Should include `Authorization: Token <your-token>`
5. **Response**: Should show SEO sites data (or empty array if no data)

## Step 6: Test Logout

1. Click profile menu or logout button
2. **Expected Result**: Redirected to landing page `/`
3. Check localStorage:
   ```javascript
   localStorage.getItem('authToken')  // Should be null
   localStorage.getItem('user')       // Should be null
   ```

## Troubleshooting

### Problem: Stuck on loading screen
- Check Django is running and accessible at `http://127.0.0.1:8000`
- Check console for CORS errors
- Clear browser cache and reload

### Problem: "Not authenticated" errors
- Verify you're logged in (check localStorage)
- Check token is being sent in request headers
- Try logging out and back in

### Problem: SEO data not loading
- Check if SEO app has any data in Django admin
- Verify API endpoint: `http://127.0.0.1:8000/api/seo/sites/`
- Check for 404 or 500 errors in Network tab

### Problem: CORS errors
- Ensure `corsheaders` is installed: `pip install django-cors-headers`
- Check `CORS_ALLOWED_ORIGINS` in Django settings includes `http://localhost:3000` and `http://127.0.0.1:3000`
- Restart Django server after settings changes

## Verify Changes

The following files have been updated:

- ✅ `frontend/src/context/AuthContext.tsx` - Now persists auth state
- ✅ `frontend/src/api/auth.ts` - Uses centralized API config
- ✅ `frontend/src/config/api.ts` - NEW: Centralized API configuration
- ✅ `frontend/src/App.tsx` - Handles loading state

## Next: Testing Individual Pages

Once login works:

1. **SEO Page** (`/app/seo`): Should load sites and keywords
2. **ASO Page** (`/app/aso`): Should load apps and listings
3. **Marketplace** (`/app/marketplace`): Should load products
4. **Analytics** (`/app/analytics`): Should load sites data
5. **Social** (`/app/social`): Should load accounts
6. **Email** (`/app/email`): Should load lists

Each page makes API calls to Django backend. Check Network tab to verify requests are working.

## Production Deployment Notes

Before going to production:

1. Set `API_BASE` environment variable or use relative URLs
2. Ensure CORS is properly configured for your domain
3. Implement token refresh logic
4. Add error boundaries for better error handling
5. Set up proper logging and error tracking

See `REACT_DJANGO_FIX_GUIDE.md` for detailed documentation.
