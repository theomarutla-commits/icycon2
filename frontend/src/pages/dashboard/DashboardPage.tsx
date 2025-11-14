import React, { FC, useState } from 'react';
import { AppNavbar } from '../../components/Header';
import DashboardSidebar from './components/DashboardSidebar';
import { AppView } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PlaceholderView from './views/PlaceholderView';
import SeoOptimisationView from './views/SeoOptimisationView';
import ASOPage from '../ASOPage';
import MarketplacePage from '../MarketplacePage';
import AnalyticsPage from '../AnalyticsPage';
import SocialPage from '../SocialPage';
import EmailPage from '../EmailPage';
import SEOPage from '../SEOPage';
import TenantIntegrationsPage from '../TenantIntegrationsPage';


const DashboardPage: FC = () => {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState<AppView>('dashboard');

    if (!user) return null; // Should be handled by App router, but as a safeguard.

    const renderActiveView = () => {
        switch(activeView) {
            case 'dashboard':
                return <PlaceholderView title="Dashboard" subtitle={`Welcome back, ${user.email}!`}>
                    <p className="text-slate-400 mt-2">This will be your central hub for project overviews and key metrics.</p>
                </PlaceholderView>
            case 'seo':
                return <SEOPage />
            case 'aso':
                return <ASOPage />
            case 'marketplace':
                return <MarketplacePage />
            case 'analytics':
                return <AnalyticsPage />
            case 'social':
                return <SocialPage />
            case 'email':
                return <EmailPage />
            case 'profile':
                return <PlaceholderView title="User Profile" subtitle="Update your personal information." />
            case 'account':
                return <TenantIntegrationsPage />
            default:
                return <div>Not Found</div>
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white font-sans">
            <AppNavbar user={user} onLogout={logout} />
            <DashboardSidebar activeView={activeView} onNavigate={setActiveView} />
            <main className="lg:pl-72 pt-24 p-8">
                {renderActiveView()}
            </main>
        </div>
    );
};

export default DashboardPage;