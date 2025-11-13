import React, { FC } from 'react';
import { LandingNavbar } from '../../components/Header';
import Hero from './components/Hero';
import ServicesCarousel from './components/ServicesCarousel';
import DesignedForResults from './components/DesignedForResults';
import WhyChooseUs from './components/WhyChooseUs';
import ContactSection from './components/ContactSection';
import FAQ from './components/FAQ';
import Footer from '../../components/Footer';

interface LandingPageProps {
    onNavigateToLogin: () => void;
    onNavigateToSignup: () => void;
}

const LandingPage: FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignup }) => (
    <div className="bg-slate-900 text-white">
        <LandingNavbar onLogin={onNavigateToLogin} onSignup={onNavigateToSignup} />
        <Hero onNavigateToSignup={onNavigateToSignup} />
        <section className="py-20 px-4 bg-slate-900">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2">One Platform, Limitless Growth</h2>
                <p className="text-slate-400 mb-12 max-w-2xl mx-auto">IcyCon integrates all the essential tools you need to expand your digital footprint and drive results.</p>
                <ServicesCarousel />
            </div>
        </section>
        <DesignedForResults />
        <WhyChooseUs />
        <ContactSection />
        <FAQ />
        <Footer />
    </div>
);

export default LandingPage;