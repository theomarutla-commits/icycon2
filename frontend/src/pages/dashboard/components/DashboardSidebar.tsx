import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, SeoIcon, SocialIcon, EmailIcon, SettingsIcon, LogoIcon } from '../../../components/Icons';

const DashboardSidebar: FC = () => (
    <aside className="bg-slate-800/50 border-r border-slate-700 w-64 p-4 fixed top-0 left-0 h-full hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-8 mt-4 ml-2">
             <LogoIcon />
             <h1 className="text-xl font-bold text-white">IcyCon</h1>
        </div>
        <nav className="flex flex-col gap-2">
            <NavLink to="/app" end className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <DashboardIcon />
                <span>Dashboard</span>
            </NavLink>
            <NavLink to="/app/seo" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SeoIcon />
                <span>SEO Tools</span>
            </NavLink>
            <NavLink to="/app/aso" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SocialIcon />
                <span>ASO</span>
            </NavLink>
            <NavLink to="/app/marketplace" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SeoIcon />
                <span>Marketplace</span>
            </NavLink>
            <NavLink to="/app/analytics" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SeoIcon />
                <span>Analytics</span>
            </NavLink>
            <NavLink to="/app/social" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SocialIcon />
                <span>Social Media</span>
            </NavLink>
            <NavLink to="/app/email" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <EmailIcon />
                <span>Email Engine</span>
            </NavLink>
            <div className="my-2 border-t border-slate-700"></div>
            <NavLink to="/app/profile" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SettingsIcon />
                <span>Profile</span>
            </NavLink>
            <NavLink to="/app/account" className={({isActive})=>`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#0052bd] text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                <SettingsIcon />
                <span>Account</span>
            </NavLink>
        </nav>
    </aside>
);

export default DashboardSidebar;