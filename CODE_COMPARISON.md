# Before & After Code Comparison

## 1. App.tsx - Root Component

### ❌ BEFORE (State-based, no routing)
```tsx
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { Page } from './types';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  if (user) {
    return <DashboardPage />;
  }

  switch (currentPage) {
    case 'login':
    case 'signup':
      return <AuthPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    case 'landing':
    default:
      return <LandingPage onNavigateToLogin={() => setCurrentPage('login')} 
                          onNavigateToSignup={() => setCurrentPage('signup')} />;
  }
};

export default App;
```

### ✅ AFTER (Route-based with protection)
```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PlaceholderView from './pages/dashboard/views/PlaceholderView';
import SEOPage from './pages/SEOPage';
import SEOSiteDetails from './pages/SEOSiteDetails';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onNavigateToLogin={() => {}} 
                                              onNavigateToSignup={() => {}} />} />
        <Route path="/login" element={<AuthPage currentPage={'login'} 
                                                 setCurrentPage={() => {}} />} />
        <Route path="/signup" element={<AuthPage currentPage={'signup'} 
                                                  setCurrentPage={() => {}} />} />
        <Route path="/app/*" element={user ? <DashboardPage /> : <Navigate to="/login" replace />}>
          <Route index element={<PlaceholderView title="Dashboard" subtitle={`Welcome back!`} />} />
          <Route path="seo" element={<SEOPage />} />
          <Route path="seo/site/:id" element={<SEOSiteDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

**Benefits:**
- Clear route hierarchy
- Built-in auth protection
- Browser history support
- Type-safe route params

---

## 2. DashboardPage.tsx - Layout Component

### ❌ BEFORE (Complex state management & hash listeners)
```tsx
const DashboardPage: FC = () => {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState<AppView>('dashboard');
    const [hash, setHash] = useState<string>(window.location.hash || '');

    useEffect(() => {
        const onHash = () => setHash(window.location.hash || '');
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    const renderActiveView = () => {
        switch(activeView) {
            case 'dashboard':
                return <PlaceholderView title="Dashboard" .../>;
            case 'seo':
                if (hash.startsWith('#seo/site/')) {
                    const parts = hash.split('/');
                    const id = Number(parts[2]);
                    if (!Number.isNaN(id)) 
                        return <SEOSiteDetails siteId={id} onBack={() => { 
                            window.location.hash = '#seo'; 
                            setHash('#seo'); 
                        }} />
                }
                return <SEOPage />
            // ... more cases
            default: return <div>Not Found</div>
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-900">
            <AppNavbar user={user} onLogout={logout} />
            <DashboardSidebar activeView={activeView} onNavigate={setActiveView} />
            <main className="lg:pl-72 pt-24 p-8">
                {renderActiveView()}
            </main>
        </div>
    );
};
```

### ✅ AFTER (Simple layout with Outlet)
```tsx
const DashboardPage: FC = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white font-sans">
            <AppNavbar user={user} onLogout={logout} />
            <DashboardSidebar />
            <main className="lg:pl-72 pt-24 p-8">
                <Outlet />
            </main>
        </div>
    );
};
```

**Benefits:**
- 50+ fewer lines of code
- No hash listeners
- Cleaner separation of concerns
- React Router handles route rendering

---

## 3. DashboardSidebar.tsx - Navigation Component

### ❌ BEFORE (State-based with manual onClick)
```tsx
const NavItem: FC<{ icon: React.ReactNode; label: string; active: boolean; 
                    onClick: () => void; }> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} 
            className={`...${active ? 'bg-[#0052bd] text-white' : '...'}`}>
        {icon}
        <span>{label}</span>
    </button>
);

const DashboardSidebar: FC<{ activeView: AppView; 
                             onNavigate: (view: AppView) => void }> = 
                        ({ activeView, onNavigate }) => (
    <aside className="...">
        <nav className="flex flex-col gap-2">
            <NavItem icon={<DashboardIcon />} label="Dashboard" 
                     active={activeView === 'dashboard'} 
                     onClick={() => onNavigate('dashboard')} />
            <NavItem icon={<SeoIcon />} label="SEO Tools" 
                     active={activeView === 'seo'} 
                     onClick={() => onNavigate('seo')} />
            // ... more NavItems
        </nav>
    </aside>
);
```

### ✅ AFTER (NavLink components)
```tsx
const DashboardSidebar: FC = () => (
    <aside className="...">
        <nav className="flex flex-col gap-2">
            <NavLink to="/app" end 
                     className={({isActive})=>`...${isActive ? 'bg-[#0052bd] text-white' : '...'}`}>
                <DashboardIcon />
                <span>Dashboard</span>
            </NavLink>
            <NavLink to="/app/seo" 
                     className={({isActive})=>`...${isActive ? 'bg-[#0052bd] text-white' : '...'}`}>
                <SeoIcon />
                <span>SEO Tools</span>
            </NavLink>
            // ... more NavLinks
        </nav>
    </aside>
);
```

**Benefits:**
- Removed NavItem wrapper
- No prop drilling needed
- Automatic active highlighting
- No state management

---

## 4. SeoOptimisationView.tsx - Navigation

### ❌ BEFORE (Hash-based)
```tsx
{seoData?.sites && seoData.sites.length > 0 ? (
    <div className="space-y-2">
        {seoData.sites.map((site: any) => (
            <div key={site.id} className="p-3 bg-slate-700 rounded">
                <p className="font-semibold">{site.domain}</p>
                <p className="text-sm text-slate-400">Locale: {site.default_locale}</p>
                <div className="mt-2">
                    <button onClick={() => { 
                        window.location.hash = `#seo/site/${site.id}` 
                    }} className="text-sm text-amber-400">Manage</button>
                </div>
            </div>
        ))}
    </div>
) : (
    <p className="text-slate-400">No sites configured yet</p>
)}
```

### ✅ AFTER (Route-based)
```tsx
const SeoOptimisationView = () => {
    const navigate = useNavigate();  // Add this hook
    
    // ... rest of component
    
    {seoData?.sites && seoData.sites.length > 0 ? (
        <div className="space-y-2">
            {seoData.sites.map((site: any) => (
                <div key={site.id} className="p-3 bg-slate-700 rounded">
                    <p className="font-semibold">{site.domain}</p>
                    <p className="text-sm text-slate-400">Locale: {site.default_locale}</p>
                    <div className="mt-2">
                        <button onClick={() => navigate(`/app/seo/site/${site.id}`)} 
                                className="text-sm text-amber-400">Manage</button>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-slate-400">No sites configured yet</p>
    )}
};
```

**Benefits:**
- Cleaner navigation syntax
- Browser history preserved
- Type-safe route paths

---

## 5. SEOSiteDetails.tsx - Site Detail View

### ❌ BEFORE (Hash-based props)
```tsx
const SEOSiteDetails: React.FC<{ siteId: number; onBack?: () => void }> = 
                      ({ siteId, onBack }) => {
  const [site, setSite] = useState<any>(null);
  // ...
  
  const handleDelete = async () => {
    if (!confirm('Delete this site? This cannot be undone.')) return;
    try {
      setLoading(true);
      await api.deleteSEOSite(siteId);
      window.location.hash = '#seo';  // ❌ Direct hash manipulation
      if (onBack) onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Site</h2>
        <div className="flex gap-2">
          <button onClick={() => { window.location.hash = '#seo' }} 
                  className="px-3 py-1 rounded bg-slate-700 text-white">Back</button>
        </div>
      </div>
      // ...
    </div>
  );
};
```

### ✅ AFTER (Route-based params)
```tsx
const SEOSiteDetails: React.FC<{ siteId?: number; onBack?: () => void }> = 
                      ({ siteId, onBack }) => {
  const [site, setSite] = useState<any>(null);
  const navigate = useNavigate();  // ✅ Use router
  const params = useParams();
  const routeId = params.id ? Number(params.id) : undefined;
  const id = siteId ?? routeId;  // Support both routes and props
  
  // ...
  
  const handleDelete = async () => {
    if (!confirm('Delete this site? This cannot be undone.')) return;
    try {
      setLoading(true);
      if (!id) throw new Error('No site id');
      await api.deleteSEOSite(id);
      if (onBack) onBack();
      else navigate('/app/seo');  // ✅ Router navigation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Site</h2>
        <div className="flex gap-2">
          <button onClick={() => { 
                    if (onBack) onBack(); 
                    else navigate('/app/seo');  // ✅ Router navigation
                  }} 
                  className="px-3 py-1 rounded bg-slate-700 text-white">Back</button>
        </div>
      </div>
      // ...
    </div>
  );
};
```

**Benefits:**
- Uses route parameters instead of props
- Router-based navigation
- Backward compatible with prop-based usage
- Better type safety with useParams

---

## 6. Authentication Form Update

### ❌ BEFORE (Missing confirmPassword)
```tsx
interface AuthPageProps {
    currentPage: 'login' | 'signup';
    setCurrentPage: (page: Page) => void;
}

const handleAuth = async (email: string, pass: string) => {
    try {
        const authFn = currentPage === 'login' ? api.login : api.signup;
        const { user } = await authFn(email, pass);  // ❌ Missing args for signup
        login(user);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
};
```

### ✅ AFTER (Proper signup flow)
```tsx
const handleAuth = async (email: string, pass: string, confirmPass?: string) => {
    try {
        if (currentPage === 'login') {
            const { user } = await api.login(email, pass);  // ✅ 2 args
            login(user);
        } else {
            const username = email.split('@')[0];  // ✅ Derive username
            const { user } = await api.signup(email, username, pass, confirmPass || pass);  // ✅ 4 args
            login(user);
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
};
```

**Benefits:**
- Proper signup parameters passed
- Username derived from email
- Type-safe parameter handling

---

## Summary of Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Navigation** | Hash-based (#seo) | Route-based (/app/seo) |
| **Component State** | Complex (activeView, hash) | Simple (just layout) |
| **Code Lines** | 60+ lines | 15 lines |
| **Browser History** | Not supported | Full support |
| **Active Highlighting** | Manual prop checking | Automatic NavLink |
| **Type Safety** | Limited | Full with useParams |
| **URL Bookmarking** | Works but fragile | Robust |
| **Mobile Support** | Works | Still works |
| **Debugging** | Hash listeners unclear | Clear route structure |
| **Testing** | Complex state tracking | Simple route testing |
