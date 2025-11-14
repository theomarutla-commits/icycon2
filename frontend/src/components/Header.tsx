import React, { FC, useState } from 'react';
import { User } from '../types';
import { LogoIcon } from './Icons';

export const LandingNavbar: FC<{ onLogin: () => void; onSignup: () => void; }> = ({ onLogin, onSignup }) => {
    const [open, setOpen] = useState(false);

    const handleLogin = () => {
        setOpen(false);
        onLogin();
    };

    const handleSignup = () => {
        setOpen(false);
        onSignup();
    };

    return (
        <header className="bg-transparent p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
            <div className="flex items-center gap-2">
                <LogoIcon />
                <h1 className="text-xl font-bold text-white">IcyCon</h1>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-4">
                <button onClick={onLogin} className="text-white hover:text-slate-300 transition-colors text-sm font-semibold">Login</button>
                <button onClick={onSignup} className="bg-[#0052bd] text-white px-4 py-2 rounded-md hover:bg-[#0079d2] transition-colors text-sm font-semibold">
                    Sign Up
                </button>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
                <button aria-label="Open menu" onClick={() => setOpen(s => !s)} className="inline-flex items-center justify-center p-2 rounded-md text-white bg-slate-800/40">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="absolute top-14 right-4 left-4 bg-slate-900/95 rounded-md p-4 shadow-lg flex flex-col gap-3 z-40 sm:hidden">
                    <button onClick={handleLogin} className="text-white text-left hover:text-slate-300">Login</button>
                    <button onClick={handleSignup} className="bg-[#0052bd] text-white px-3 py-2 rounded-md text-left hover:bg-[#0079d2]">Sign Up</button>
                </div>
            )}
        </header>
    );
};export const AppNavbar: FC<{ user: User | null; onLogout: () => void; }> = ({ user, onLogout }) => (
  <header className="bg-slate-900/80 backdrop-blur-sm p-4 shadow-lg flex justify-between items-center fixed top-0 left-0 right-0 z-10 lg:pl-72">
    <div className="flex items-center gap-2">
       <div className="text-xl font-bold text-white lg:hidden">IcyCon</div>
    </div>
    <div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-slate-300 hidden sm:inline">{user.email}</span>
          <button onClick={onLogout} className="bg-[#0052bd] text-white px-4 py-2 rounded-md hover:bg-[#0079d2] transition-colors text-sm font-semibold">
            Logout
          </button>
        </div>
      )}
    </div>
  </header>
);