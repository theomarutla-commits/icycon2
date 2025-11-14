import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PlaceholderView from './pages/dashboard/views/PlaceholderView';
import SEOPage from './pages/SEOPage';
import SEOSiteDetails from './pages/SEOSiteDetails';
import ASOPage from './pages/ASOPage';
import MarketplacePage from './pages/MarketplacePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SocialPage from './pages/SocialPage';
import EmailPage from './pages/EmailPage';
import ProfilePage from './pages/ProfilePage';
import TenantIntegrationsPage from './pages/TenantIntegrationsPage';


const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateToLogin={() => navigate('/login')} onNavigateToSignup={() => navigate('/signup')} />} />
      <Route path="/login" element={<AuthPage currentPage={'login'} setCurrentPage={() => {}} />} />
      <Route path="/signup" element={<AuthPage currentPage={'signup'} setCurrentPage={() => {}} />} />
      <Route path="/app/*" element={user ? <DashboardPage /> : <Navigate to="/login" replace />}>
        <Route index element={<PlaceholderView title="Dashboard" subtitle={`Welcome back!`} />} />
        <Route path="seo" element={<SEOPage />} />
        <Route path="seo/site/:id" element={<SEOSiteDetails />} />
        <Route path="aso" element={<ASOPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="social" element={<SocialPage />} />
        <Route path="email" element={<EmailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="account" element={<TenantIntegrationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;