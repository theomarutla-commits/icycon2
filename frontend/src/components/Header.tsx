import React, { FC } from 'react';
import { User } from '../types';
import { LogoIcon } from './Icons';

export const LandingNavbar: FC<{ onLogin: () => void; onSignup: () => void; }> = ({ onLogin, onSignup }) => (
    <header className="bg-transparent p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-2">
            <LogoIcon />
            <h1 className="text-xl font-bold text-white">IcyCon</h1>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={onLogin} className="text-white hover:text-slate-300 transition-colors text-sm font-semibold">Login</button>
            <button onClick={onSignup} className="bg-[#0052bd] text-white px-4 py-2 rounded-md hover:bg-[#0079d2] transition-colors text-sm font-semibold">
                Sign Up
            </button>
        </div>
    </header>
);

export const AppNavbar: FC<{ user: User | null; onLogout: () => void; }> = ({ user, onLogout }) => (
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