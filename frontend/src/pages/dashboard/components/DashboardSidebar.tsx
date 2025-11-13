import React, { FC } from 'react';
import { AppView } from '../../../types';
import { DashboardIcon, SeoIcon, SocialIcon, EmailIcon, SettingsIcon, LogoIcon } from '../../../components/Icons';

const NavItem: FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void; }> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
        {icon}
        <span>{label}</span>
    </button>
);

const DashboardSidebar: FC<{ activeView: AppView; onNavigate: (view: AppView) => void }> = ({ activeView, onNavigate }) => (
    <aside className="bg-slate-800/50 border-r border-slate-700 w-64 p-4 fixed top-0 left-0 h-full hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-8 mt-4 ml-2">
             <LogoIcon />
             <h1 className="text-xl font-bold text-white">IcyCon</h1>
        </div>
        <nav className="flex flex-col gap-2">
            <NavItem icon={<DashboardIcon />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavItem icon={<SeoIcon />} label="SEO Tools" active={activeView === 'seo'} onClick={() => onNavigate('seo')} />
            <NavItem icon={<SocialIcon />} label="Social Media" active={activeView === 'social'} onClick={() => onNavigate('social')} />
            <NavItem icon={<EmailIcon />} label="Email Engine" active={activeView === 'email'} onClick={() => onNavigate('email')} />
            <div className="my-2 border-t border-slate-700"></div>
            <NavItem icon={<SettingsIcon />} label="Profile" active={activeView === 'profile'} onClick={() => onNavigate('profile')} />
            <NavItem icon={<SettingsIcon />} label="Account" active={activeView === 'account'} onClick={() => onNavigate('account')} />
        </nav>
    </aside>
);

export default DashboardSidebar;