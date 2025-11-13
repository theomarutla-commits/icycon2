import React, { FC } from 'react';

interface HeroProps {
    onNavigateToSignup: () => void;
}

const Hero: FC<HeroProps> = ({ onNavigateToSignup }) => (
     <section className="min-h-screen flex items-center justify-center text-center bg-[#002292] relative overflow-hidden px-4">
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Your All-In-One Digital Marketing Suite</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-slate-300">Boost your SEO, manage social media, and automate email campaigns from a single, powerful dashboard.</p>
            <button onClick={onNavigateToSignup} className="mt-8 px-8 py-3 bg-[#0052bd] text-white font-semibold rounded-lg shadow-lg hover:bg-[#0079d2] transition-transform transform hover:scale-105">
                Get Started Free
            </button>
        </div>
    </section>
);

export default Hero;