import React, { FC } from 'react';
import { AppNavbar } from '../../components/Header';
import DashboardSidebar from './components/DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import { Outlet } from 'react-router-dom';


const DashboardPage: FC = () => {
    const { user, logout } = useAuth();

    if (!user) return null; // Should be handled by App router, but as a safeguard.

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

export default DashboardPage;