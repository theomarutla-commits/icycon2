import React, { FC } from 'react';
import { LogoIcon } from './Icons';

const Footer: FC = () => (
    <footer className="bg-[#002292] py-12 px-4 text-center text-slate-400">
        <div className="container mx-auto">
            <div className="flex justify-center items-center gap-2 mb-4">
                <LogoIcon />
                <h1 className="text-xl font-bold text-white">IcyCon</h1>
            </div>
            <p>&copy; {new Date().getFullYear()} IcyCon. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;