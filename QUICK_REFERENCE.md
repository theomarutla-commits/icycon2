# Quick Reference - Route-Based Navigation

## Current Server Status

### Frontend
- **URL**: http://localhost:3001/static/frontend/
- **Status**: ✅ Running
- **Dev Tool**: Vite
- **Command**: `npm run dev` (in `frontend/` directory)

### Backend
- **URL**: http://localhost:8000
- **Status**: ✅ Running
- **Framework**: Django
- **Command**: `python manage.py runserver` (in `icycon/` directory)

---

## Route Map

```
PUBLIC ROUTES
├─ /              → Landing Page
├─ /login         → Login Form
└─ /signup        → Sign Up Form

PROTECTED ROUTES (/app/*)
├─ /app                    → Dashboard (home)
├─ /app/seo               → SEO Tools List
│  └─ /app/seo/site/:id   → SEO Site Details
├─ /app/aso               → ASO Tools
├─ /app/marketplace       → Marketplace
├─ /app/analytics         → Analytics
├─ /app/social            → Social Media
├─ /app/email             → Email Engine
├─ /app/profile           → User Profile
└─ /app/account           → Account / Integrations
```

---

## Key Imports

### In Components (importing router hooks)
```tsx
import { useNavigate } from 'react-router-dom';     // For navigation
import { useParams } from 'react-router-dom';       // For URL params
import { NavLink } from 'react-router-dom';         // For links
import { Outlet } from 'react-router-dom';          // For nested routes
```

---

## Common Patterns

### Navigate Programmatically
```tsx
const navigate = useNavigate();
navigate('/app/seo');           // Go to SEO page
navigate('/app/seo/site/5');    // Go to specific site
navigate(-1);                   // Go back
```

### Get URL Parameters
```tsx
const params = useParams();
const siteId = params.id;       // From route /app/seo/site/:id
```

### Create Navigation Link
```tsx
<NavLink to="/app/seo" 
         className={({isActive}) => isActive ? 'active-class' : 'normal-class'}>
    SEO Tools
</NavLink>
```

### Render Nested Routes
```tsx
<Outlet />   // Renders the matched child route component
```

---

## SEO Feature API Endpoints

### List Sites
```javascript
const sites = await api.getSEOSites();
```

### Get Single Site
```javascript
const site = await api.getSEOSite(id);
```

### Create Site
```javascript
await api.createSEOSite({ 
    domain: 'https://example.com',
    sitemaps_url: 'https://example.com/sitemap.xml'
});
```

### Update Site
```javascript
await api.updateSEOSite(id, {
    domain: 'https://example.com',
    sitemaps_url: 'https://example.com/sitemap.xml'
});
```

### Delete Site
```javascript
await api.deleteSEOSite(id);
```

---

## Common Tasks

### Add New Route
1. Add to `App.tsx` routes:
   ```tsx
   <Route path="new-feature" element={<NewFeaturePage />} />
   ```

2. Add to sidebar in `DashboardSidebar.tsx`:
   ```tsx
   <NavLink to="/app/new-feature">New Feature</NavLink>
   ```

3. Create the page component

### Navigate to Detail Page
```tsx
// In list component
const navigate = useNavigate();
<button onClick={() => navigate(`/app/seo/site/${site.id}`)}>
    Manage
</button>
```

### Get Data from Route Parameter
```tsx
const params = useParams();
const id = params.id;  // From :id in route definition
```

### Check if Route is Active
```tsx
<NavLink to="/app/seo" 
         className={({isActive}) => isActive ? 'bg-blue' : 'bg-gray'}>
    SEO
</NavLink>
```

---

## Troubleshooting

### TypeScript: "Cannot find module 'react-router-dom'"
**Fix**: Run `npm install` in frontend directory
```bash
cd frontend
npm install
```

### Dev Server Not Starting
**Check**: 
- Port 3000/3001 available
- `npm install` completed
- No TypeScript errors (`npx tsc --noEmit`)

### API Calls Failing
**Check**:
- Backend running on http://localhost:8000
- Token in localStorage
- CORS enabled in Django
- User assigned to tenant via TenantUser

### Routes Not Working
**Check**:
- Route path matches NavLink `to` prop
- Nested routes inside correct parent
- Protected routes have auth guard
- Correct route parameters in URLs

---

## File Organization

```
frontend/
├── src/
│   ├── App.tsx                    ← Main router setup
│   ├── pages/
│   │   ├── landing/
│   │   │   └── LandingPage.tsx
│   │   ├── signup/
│   │   │   └── SignupPage.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx  ← Layout with Outlet
│   │   │   ├── components/
│   │   │   │   └── DashboardSidebar.tsx  ← NavLinks here
│   │   │   └── views/
│   │   │       ├── SeoOptimisationView.tsx
│   │   │       └── PlaceholderView.tsx
│   │   ├── SEOPage.tsx
│   │   ├── SEOSiteDetails.tsx    ← Uses useParams
│   │   ├── ASOPage.tsx
│   │   ├── MarketplacePage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── SocialPage.tsx
│   │   ├── EmailPage.tsx
│   │   └── TenantIntegrationsPage.tsx
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   └── Header.tsx
│   ├── api/
│   │   └── auth.ts              ← API wrapper with token
│   └── context/
│       └── AuthContext.tsx
└── package.json                  ← react-router-dom here
```

---

## Testing Checklist

- [ ] Can access public routes without login
- [ ] Can login with valid credentials
- [ ] Token stored in localStorage after login
- [ ] Cannot access /app/* without login (redirects to /login)
- [ ] Sidebar highlights current route
- [ ] Click sidebar link navigates to route
- [ ] SEO site list loads from API
- [ ] Click "Manage" navigates to site details
- [ ] Can edit site details
- [ ] Can delete site
- [ ] "Back" button returns to site list
- [ ] Browser back button works
- [ ] URL bookmarking works (paste URL, page loads)
- [ ] Manual URL entry works

---

## Notes

- All auth tokens stored in `localStorage` as `authToken`
- API wrapper in `auth.ts` adds token to all requests
- Protected routes check `useAuth()` context
- Route params are type-safe with TypeScript
- Active route styling automatic via NavLink
- Browser history fully supported
