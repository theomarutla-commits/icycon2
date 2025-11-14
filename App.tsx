import React, { FC, useState, useRef, useEffect, FormEvent, ReactNode } from 'react';

// --- TYPES ---
type User = { email: string };
type Page = 'landing' | 'login' | 'signup' | 'app';
type AppView = 'dashboard' | 'seo' | 'social' | 'email' | 'profile' | 'account' | 'aso' | 'backlinks' | 'blog' | 'marketplace' | 'multilingual';
type SeoTab = 'sites' | 'keywords' | 'content' | 'faqs';
type SocialTab = 'accounts' | 'scheduler' | 'analytics' | 'engagement';
type MarketplaceTab = 'products' | 'services' | 'transactions' | 'vendors';
type EmailTab = 'campaigns' | 'templates' | 'contacts' | 'analytics' | 'flows';

 
// --- ICONS ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>;
const SeoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a14.978 14.978 0 0 0-5.41-1.41m5.41 1.41a14.923 14.923 0 0 1 5.841 2.28m-8.491-3.428a14.979 14.979 0 0 0-5.41-1.41m0 0a14.923 14.923 0 0 1-5.841 2.28m5.841-2.28 2.55-1.02m5.841 2.28a14.929 14.929 0 0 0 5.41 1.41m-5.41-1.41a14.929 14.929 0 0 1 5.41 1.41M3.31 9.39a15 15 0 0 1 17.38 0m-17.38 0a15 15 0 0 0 17.38 0z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.952l2.176.412c.56.105 1.025.54 1.11 1.052M12.558 15.013a1.498 1.498 0 0 1-1.12.923l-2.176.412a1.498 1.498 0 0 1-1.637-1.267 1.498 1.498 0 0 1 .924-1.119l2.176-.412a1.498 1.498 0 0 1 1.638 1.267 1.498 1.498 0 0 1-.924 1.119Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.06 8.034a1.498 1.498 0 0 1-1.267-1.638l.412-2.176a1.498 1.498 0 0 1 1.052-1.11l2.208-.413a1.498 1.498 0 0 1 1.638 1.267l-.412 2.176a1.498 1.498 0 0 1-1.052 1.11l-2.208.413a1.498 1.498 0 0 1-1.267-1.638Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.94 15.966a1.498 1.498 0 0 1-1.638-1.267l-.412-2.176a1.498 1.498 0 0 1 1.267-1.638l2.176-.412a1.498 1.498 0 0 1 1.119.924 1.498 1.498 0 0 1-1.267 1.638l-2.176.412a1.498 1.498 0 0 1-.924-1.119Z" /></svg>;
const LogoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const LocalSeoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const AnswerEngineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>;
const AppStoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
const ContentEngineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>;
const MultilingualIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" /></svg>;
const LinkBuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>;
const CreatorGrowthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>;

// Icons for TailoredStrategies section
const LocationPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DesktopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PublishersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9M7 16h6M7 8h6v4H7V8z" /></svg>;
const FoundationalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GrowthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;

// Icons for Dashboard Analytics
const ClicksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.214a.75.75 0 0 0 1.06 0l4.39-4.39a.75.75 0 0 0 0-1.06l-4.39-4.39a.75.75 0 0 0-1.06 0l-1.214 1.214" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25h-7.5" /></svg>;
const ConversionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;

// Icons for SEO Dashboard
const WebsitePropertiesIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const SitePerformanceIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;

// Icons for Social Dashboard
const XIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>;
const FacebookIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>;
const InstagramIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedInIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>;

// Icons for Marketplace Dashboard
const ProductIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;

// Icons for Email Dashboard
const CampaignsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" /></svg>;
const TemplatesIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75e-08h15c2.485 0 4.5 2.015 4.5 4.5v15c0 2.485-2.015 4.5-4.5 4.5h-15c-2.485 0-4.5-2.015-4.5-4.5v-15c0-2.485 2.015-4.5 4.5-4.5zM4.5 12h15" /></svg>;
const ContactsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.742-.511 7.477 7.477 0 0 0-1.32-8.219l-1.32-1.32a7.477 7.477 0 0 0-8.219-1.32 9.094 9.094 0 0 0-.511 3.742m-2.222 5.688a9.094 9.094 0 0 1-.511-3.742 7.477 7.477 0 0 1 1.32-8.219l1.32-1.32a7.477 7.477 0 0 1 8.219-1.32 9.094 9.094 0 0 1 3.742.511m-9.879 11.238a9.094 9.094 0 0 0-3.742.511 7.477 7.477 0 0 0-1.32-8.219l-1.32-1.32a7.477 7.477 0 0 0-8.219-1.32 9.094 9.094 0 0 0-.511 3.742m2.222 5.688a9.094 9.094 0 0 1 .511-3.742 7.477 7.477 0 0 1-1.32-8.219l-1.32-1.32a7.477 7.477 0 0 1-8.219-1.32 9.094 9.094 0 0 1-3.742-.511" /></svg>;
const FlowsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h10.5M6.75 12h10.5m-10.5 4.5h10.5m-1.5-8.25-3 3-3-3" /></svg>;

// --- CONSTANTS ---
const icyconServices = [
    {
        title: "Comprehensive SEO Platform",
        icon: <SeoIcon />,
        description: "Full-stack technical, on-page, local, and entity-based SEO to dominate search results.",
        howItWorks: [
            "Conducts full site & crawl health audits (Core Web Vitals, Structured Data).",
            "Deploys deep keyword & SERP intelligence to map user intent.",
            "Automates Search Console tasks for efficient monitoring and insights.",
            "Manages Google Business Profile (GBP) including reviews, Q&A, and posts."
        ],
        signatureFeatures: [
            { title: "Opportunity Graph", description: "Identifies gaps where you can own People Also Ask, snippets, and map packs." },
            { title: "Review AI", description: "Generates tone-safe replies and flags potential fake review waves." }
        ],
        primaryKPIs: ["Organic CVR", "Qualified Clicks", "Snippet & Map Pack Wins", "Time to Index"]
    },
    {
        title: "Answer Engine Optimization (AEO)",
        icon: <AnswerEngineIcon />,
        description: "Optimize your content to be the cited, authoritative source in AI-powered search answers.",
        howItWorks: [
            "Publishes and maintains `llms.txt` to guide AI crawlers to canonical sources.",
            "Auto-creates concise, citeable Q&As and publishes them with structured data.",
            "Enriches pages with datasets, steps, and 'speakable' snippets for answer selection.",
            "Tests content phrasing and structure against generative engines to maximize visibility."
        ],
        signatureFeatures: [
            { title: "Citation Builder", description: "Ensures every claim has a source link and monitors if search engines cite your brand." }
        ],
        primaryKPIs: ["'Answer with Citation' Rate", "Branded Inclusion in AI Overviews", "Assisted Conversions"]
    },
    {
        title: "Social & Community Marketing",
        icon: <SocialIcon />,
        description: "Engage and grow your audience with compliant, high-impact content and community activation.",
        howItWorks: [
            "Plans, creates, and schedules content across major platforms using AI-assisted tools.",
            "Ethically participates in communities (Reddit, Discord) to provide value and build trust.",
            "Generates video scripts and drafts for YouTube, including automated chaptering and optimization.",
            "Uses a 'Timing Oracle' to predict the best post times based on engagement data."
        ],
        signatureFeatures: [
            { title: "Agent 'Riona'", description: "A labeled brand assistant that follows community rules, rate limits posts, and routes sensitive DMs to humans." }
        ],
        primaryKPIs: ["Qualified Social Sessions", "UTM-Attributed Revenue", "Comment Sentiment", "Mod Flags = 0"]
    },
    {
        title: "Email & SMS Revenue Engine",
        icon: <EmailIcon />,
        description: "Drive sales and retention with compliant, automated email and SMS lifecycle flows.",
        howItWorks: [
            "Grows your list with ethical on-site capture, lead magnet split tests, and preference centers.",
            "Deploys automated flows: welcome, activation, win-back, and post-purchase cross-sells.",
            "Ensures deliverability with SPF/DKIM/DMARC checks and spam trap monitoring.",
            "Executes personalized, value-first cold outreach for B2B (where lawful)."
        ],
        signatureFeatures: [
            { title: "Deliverability Radar", description: "Proactively monitors and fixes issues that could land your messages in spam." }
        ],
        primaryKPIs: ["Revenue Per Recipient", "Reply/Meeting Rate (B2B)", "Spam Complaint Rate < 0.1%"]
    },
    {
        title: "Multilingual SEO",
        icon: <MultilingualIcon />,
        description: "Expand globally with an instant, SEO-friendly translation layer and localized strategy.",
        howItWorks: [
            "Implements the optimal URL strategy (ccTLD, subdomain, or subfolder) for your goals.",
            "Automates hreflang tags and multilingual sitemaps to prevent duplicate content issues.",
            "Uses a machine-first, human-QA'd process to translate all content, metadata, and links.",
            "Conducts local keyword research and outreach for each target market."
        ],
        signatureFeatures: [
            { title: "Hreflang Auditor", description: "Automatically finds and resolves common hreflang issues like reciprocity and x-default errors." }
        ],
        primaryKPIs: ["Per-Language Indexed Pages", "Local Keyword Rankings", "Language-Segmented CVR"]
    },
    {
        title: "Ethical Link Building",
        icon: <LinkBuildingIcon />,
        description: "Build authority and drive referral traffic with high-quality links that matter.",
        howItWorks: [
            "Develops Digital PR angles like stats, calculators, and mini-studies to earn media placements.",
            "Secures placements in high-quality, relevant industry directories and resource pages.",
            "Monitors backlink profile health to identify and mitigate risk from toxic links.",
            "Focuses on quality over quantity, avoiding all prohibited link schemes."
        ],
        signatureFeatures: [
            { title: "Digital PR Content Engine", description: "Creates link-worthy assets that journalists and creators want to share." }
        ],
        primaryKPIs: ["Referring Domains (Topical & Authoritative)", "Assisted Rankings & Traffic", "Link Risk Score"]
    },
    {
        title: "Directory Submission at Scale",
        icon: <LocalSeoIcon />,
        description: "Systematically build your presence on high-fit directories and citation sites for your vertical and geo.",
        howItWorks: [
            "Curates and scores directories by topical match, moderation quality, and organic visibility.",
            "Auto-fills profiles using your brand kit to ensure NAP consistency.",
            "Maps and targets adjacent local listings (chambers of commerce, professional registries).",
            "Maintains strict quality control with monthly caps to avoid low-quality mass submissions."
        ],
        signatureFeatures: [
            { title: "Citation Consistency Monitor", description: "Tracks your business listings across the web and flags inconsistencies for correction." }
        ],
        primaryKPIs: ["Referral Sessions", "Citation Consistency Score", "Local Pack Ranking Lifts"]
    },
    {
        title: "Creative Growth Strategies",
        icon: <CreatorGrowthIcon />,
        description: "An always-on idea foundry for creative, zero/low-cost tactics to earn converting traffic.",
        howItWorks: [
            "'Answer Once, Everywhere': Converts a single insight into a doc, FAQ, video, and social post.",
            "Develops micro-tools (like calculators or checkers) that attract links and capture leads.",
            "Monitors rising Google/YouTube trends to create timely, relevant content for your brand.",
            "Identifies and executes on non-traditional growth opportunities to diversify traffic sources."
        ],
        signatureFeatures: [
            { title: "Trend Tailwind System", description: "Automatically drafts content keyed to rising search trends that are aligned to your product story." }
        ],
        primaryKPIs: ["Cost Per Lead (Free Tactics)", "Earned Links from Micro-Tools", "New Keyword Coverage"]
    },
    {
        title: "App Store Optimization (ASO)",
        icon: <AppStoreIcon />,
        description: "Improve discovery and conversion for your iOS & Android apps to drive organic downloads.",
        howItWorks: [
            "Optimizes metadata including titles, subtitles, and descriptions with targeted keywords.",
            "A/B tests creatives (icons, screenshots, preview videos) to maximize conversion.",
            "Manages review velocity with ethical in-app prompts and automated replies.",
            "Ensures full compliance with Apple and Google App Store policies."
        ],
        signatureFeatures: [
            { title: "In-Store A/B Creative Lab", description: "Systematically tests app store assets to find the highest-converting combination." }
        ],
        primaryKPIs: ["Browse/Search CVR", "App Store Category Ranking", "Retention Day 1/7/30"]
    },
    {
        title: "Creator Platform Growth (Whop)",
        icon: <CreatorGrowthIcon />,
        description: "Launch and scale on creator platforms like Whop with optimized listings and affiliate programs.",
        howItWorks: [
            "Sets up and optimizes your Whop store page, including packaging, pricing, and FAQs.",
            "Enables and manages your affiliate program to drive partner-led growth.",
            "Develops a comprehensive launch plan including creator collabs and promotion.",
            "Connects your Discord, courses, and other apps for a seamless user experience."
        ],
        signatureFeatures: [
            { title: "Affiliate Program Kickstarter", description: "Provides briefs, assets, and outreach templates to recruit and activate your first affiliates." }
        ],
        primaryKPIs: ["Page View-to-Trial Rate", "Affiliate Share of Revenue", "Purchase CVR"]
    },
    {
        title: "Trending Blog Engine",
        icon: <ContentEngineIcon />,
        description: "Fuel your content marketing with a high-velocity pipeline of blog posts aligned to search demand.",
        howItWorks: [
            "Mines topics from keyword data, Google Trends, and Search Console gap analysis.",
            "Produces long-form drafts complete with internal links, structured data, and CTAs.",
            "Repurposes blog content into social media posts, videos, and email newsletters.",
            "Schedules publishing to align with peak interest windows for maximum impact."
        ],
        signatureFeatures: [
            { title: "Content Repurposing Hub", description: "Turns every long-form post into 5-10 micro-assets for distribution across all channels." }
        ],
        primaryKPIs: ["Organic Landings Per Post", "CTA Clicks", "Assisted Pipeline/Revenue"]
    }
];


// --- MOCK API ---
const api = {
  login: async (email: string, pass: string) => {
    console.log('Attempting login with:', email, pass);
    if (!email || !pass) {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Please enter email and password.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { email }, token: 'fake-jwt-token' };
  },
  signup: async (email: string, pass: string) => {
    console.log('Attempting signup with:', email, pass);
    if (!email || !pass) {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Please enter email and password.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { email }, token: 'fake-jwt-token' };
  }
};


// --- COMPONENTS ---

// Header Components
const LandingNavbar: FC<{ onLogin: () => void; onSignup: () => void; }> = ({ onLogin, onSignup }) => (
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

const AppNavbar: FC<{ user: User | null; onLogout: () => void; }> = ({ user, onLogout }) => (
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

// Footer Component
const Footer: FC = () => (
    <footer className="bg-[#0d2a4c] py-12 px-4 text-center text-slate-400">
        <div className="container mx-auto">
            <div className="flex justify-center items-center gap-2 mb-4">
                <LogoIcon />
                <h1 className="text-xl font-bold text-white">IcyCon</h1>
            </div>
            <p>&copy; {new Date().getFullYear()} IcyCon. All rights reserved.</p>
        </div>
    </footer>
);

// AuthForm Component
const AuthForm: FC<{
    title: string;
    isLogin: boolean;
    onSubmit: (email: string, pass: string) => void;
    onSwitch: () => void;
    error: string | null;
    loading: boolean;
}> = ({ title, isLogin, onSubmit, onSwitch, error, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        onSubmit(email, password);
    };

    return (
        <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">{title}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#0079d2] focus:border-[#0079d2] outline-none transition" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#0079d2] focus:border-[#0079d2] outline-none transition" />
                </div>
                {!isLogin && (
                     <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#0079d2] focus:border-[#0079d2] outline-none transition" />
                    </div>
                )}
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-[#0052bd] text-white py-3 rounded-md hover:bg-[#0079d2] transition-colors font-semibold disabled:bg-[#002292] disabled:cursor-not-allowed flex items-center justify-center">
                   {loading ? (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : title}
                </button>
            </form>
            <p className="text-center text-slate-400 mt-6">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={onSwitch} className="text-[#009dd3] hover:text-[#00bfc7] font-semibold ml-2">{isLogin ? 'Sign Up' : 'Login'}</button>
            </p>
        </div>
    );
};

// Landing Page Section Components
const Hero: FC<{ onNavigateToSignup: () => void; }> = ({ onNavigateToSignup }) => (
     <section className="min-h-screen flex items-center justify-center text-center bg-[#0d2a4c] relative overflow-hidden px-4">
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">Your All-In-One Digital Marketing Suite</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-slate-300">Boost your SEO, manage social media, and automate email campaigns from a single, powerful dashboard.</p>
            <button onClick={onNavigateToSignup} className="mt-8 px-8 py-3 bg-[#0052bd] text-white font-semibold rounded-lg shadow-lg hover:bg-[#0079d2] transition-transform transform hover:scale-105">
                Get Started Free
            </button>
        </div>
    </section>
);

const CoreSeoServices: FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % icyconServices.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + icyconServices.length) % icyconServices.length);
    };

    const activeService = icyconServices[activeIndex];

    return (
        <section className="py-20 px-4 bg-[#0d2a4c] text-white relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 opacity-5 pointer-events-none">
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" fillOpacity="1" d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,250.7C672,267,768,245,864,208C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            </div>

            <div className="container mx-auto text-center relative z-10">
                <h2 className="text-4xl font-bold">Our Core Growth Services</h2>
                <p className="text-slate-400 mt-2 mb-10 max-w-2xl mx-auto">A comprehensive suite of services designed to build authority, drive traffic, and generate revenue.</p>

                <div className="flex justify-center items-center gap-4 md:gap-8 mb-8 flex-wrap">
                    {icyconServices.map((service, index) => (
                        <button key={service.title} onClick={() => setActiveIndex(index)} className={`px-4 py-2 text-sm md:text-base font-semibold transition-colors duration-300 ${activeIndex === index ? 'text-white border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>
                            {service.title}
                        </button>
                    ))}
                </div>

                <div className="relative h-[650px] md:h-[550px] flex items-center justify-center">
                     <button onClick={handlePrev} className="absolute left-0 md:-left-4 z-20 bg-slate-700/50 rounded-full p-2 text-cyan-400 hover:bg-slate-700/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    </button>
                    
                    <div className="w-full max-w-4xl flex items-center justify-center perspective-1000">
                      <div className="relative w-full h-[600px] md:h-[500px]" style={{ transformStyle: "preserve-3d" }}>
                        {icyconServices.map((service, index) => {
                           const offset = index - activeIndex;
                           const rotateY = offset * 25;
                           const translateZ = -Math.abs(offset) * 150;
                           const opacity = Math.abs(offset) > 1 ? 0 : 1 - (Math.abs(offset) / 1.5);
                           const blur = Math.abs(offset) > 0 ? 'blur(4px)' : 'blur(0px)';
                           const serviceIcon = React.cloneElement(service.icon, {className: "w-8 h-8 text-cyan-400"})

                           return (
                               <div key={service.title} className="absolute w-full h-full transition-all duration-500 ease-in-out" style={{ transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`, opacity: opacity}}>
                                    <div className="w-full h-full bg-slate-800/50 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 md:p-8 text-left overflow-y-auto" style={{ filter: blur}}>
                                        <div className="flex items-start gap-4 mb-4">
                                            {serviceIcon}
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                                <p className="text-slate-300 text-sm">{service.description}</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                                            <div>
                                                <h4 className="font-semibold text-cyan-400 mb-2">How It Works</h4>
                                                <ul className="space-y-2 list-disc list-inside text-slate-300">
                                                    {service.howItWorks.map(item => <li key={item}>{item}</li>)}
                                                </ul>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-cyan-400 mb-2">Signature Features</h4>
                                                     {service.signatureFeatures.map(feature => (
                                                        <div key={feature.title}>
                                                            <p className="font-semibold text-white">{feature.title}</p>
                                                            <p className="text-slate-300">{feature.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-cyan-400 mb-2">Primary KPIs</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {service.primaryKPIs.map(kpi => <span key={kpi} className="bg-slate-700/50 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">{kpi}</span>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                       </div>
                    </div>

                    <button onClick={handleNext} className="absolute right-0 md:-right-4 z-20 bg-slate-700/50 rounded-full p-2 text-cyan-400 hover:bg-slate-700/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

const businessTypes = [
  {
    icon: <LocationPinIcon />,
    title: "Local Services",
    description: "For businesses like dentists, lawyers, and home services. We focus on GBP optimization, local pack rankings, and citation building."
  },
  {
    icon: <ShoppingCartIcon />,
    title: "D2C / eCommerce",
    description: "Targeting product and category page SEO, structured data for products, and content marketing for 'best of' queries."
  },
  {
    icon: <DesktopIcon />,
    title: "SaaS & B2B",
    description: "Driving growth through high-intent content for bottom-of-funnel keywords, GEO for thought leadership, and technical SEO."
  },
  {
    icon: <PublishersIcon />,
    title: "Publishers & Affiliates",
    description: "Maximizing organic traffic through programmatic SEO, content velocity, and optimizing for Core Web Vitals and ad experience."
  }
];

const seoMaturity = [
  {
    icon: <FoundationalIcon />,
    title: "Foundational SEO",
    description: "For new sites or those just starting SEO. Focus on a technical audit, keyword mapping, on-page basics, and GBP setup."
  },
  {
    icon: <GrowthIcon />,
    title: "Growth & Authority",
    description: "For businesses with an established foundation. We build authority through content marketing, digital PR, and GEO."
  },
  {
    icon: <ScaleIcon />,
    title: "Scale & Domination",
    description: "For market leaders. We focus on large-scale content operations, international SEO, and advanced technical optimization."
  }
];

const TailoredStrategies: FC = () => (
    <section className="py-20 px-4 bg-[#0d2a4c] text-white relative">
        <div className="absolute bottom-0 left-0 right-0 opacity-5 pointer-events-none">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" fillOpacity="1" d="M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,250.7C672,267,768,245,864,208C960,171,1056,117,1152,101.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>
        <div className="container mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold">Tailored SEO Strategies for Every Growth Stage</h2>
            <p className="text-slate-400 mt-2 mb-12 max-w-3xl mx-auto">We partner with clients across various industries, delivering bespoke SEO roadmaps that deliver results and compound over time.</p>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 text-left max-w-5xl mx-auto">
                <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white">By Business Type</h3>
                    <div className="space-y-8">
                        {businessTypes.map(item => (
                            <div key={item.title} className="flex items-start gap-4">
                                <div className="text-cyan-400 mt-1 flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                    <p className="text-slate-300">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold mb-6 text-white">By SEO Maturity</h3>
                    <div className="space-y-8">
                        {seoMaturity.map(item => (
                            <div key={item.title} className="flex items-start gap-4">
                                <div className="text-cyan-400 mt-1 flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                    <p className="text-slate-300">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const WhyChooseUs: FC = () => (
    <section className="py-20 px-4 bg-slate-900">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">The IcyCon Advantage</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div><h3 className="text-xl font-bold text-[#009dd3] mb-2">All-in-One</h3><p className="text-slate-400">Stop juggling multiple subscriptions. Get everything you need under one roof.</p></div>
                <div><h3 className="text-xl font-bold text-[#009dd3] mb-2">Intuitive Design</h3><p className="text-slate-400">Our clean, user-friendly interface means you spend less time learning and more time doing.</p></div>
                <div><h3 className="text-xl font-bold text-[#009dd3] mb-2">Dedicated Support</h3><p className="text-slate-400">Our expert team is always here to help you get the most out of the platform.</p></div>
            </div>
        </div>
    </section>
);

const ContactSection: FC = () => (
    <section className="py-20 px-4 bg-slate-800">
        <div className="container mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-slate-400 mb-8">Fill out the form below and a member of our team will get back to you shortly.</p>
            <form className="space-y-4 text-left">
                <div><label className="text-sm font-medium text-slate-300">Name</label><input type="text" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#0079d2]" /></div>
                <div><label className="text-sm font-medium text-slate-300">Email</label><input type="email" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#0079d2]" /></div>
                <div><label className="text-sm font-medium text-slate-300">Message</label><textarea rows={4} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#0079d2]"></textarea></div>
                <button type="submit" className="w-full bg-[#0052bd] text-white py-3 rounded-md hover:bg-[#0079d2] transition-colors font-semibold">Send Message</button>
            </form>
        </div>
    </section>
);

const FaqItem: FC<{ q: string; a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
                <span className="font-medium text-white">{q}</span>
                <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <p className="pb-4 text-slate-300">{a}</p>}
        </div>
    );
};

const FAQ: FC = () => (
    <section className="py-20 px-4 bg-slate-900">
        <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-2">
                <FaqItem q="Who is IcyCon for?" a="IcyCon is designed for small to medium-sized businesses, marketing agencies, and solo entrepreneurs who want to streamline their digital marketing efforts." />
                <FaqItem q="Is there a free trial?" a="Yes, we offer a 14-day free trial on all our plans. No credit card required to get started." />
                <FaqItem q="Can I cancel my subscription at any time?" a="Absolutely. You can cancel your plan at any time from your account dashboard with no questions asked." />
                <FaqItem q="What integrations do you support?" a="We support integrations with all major social media platforms, email providers, and analytics tools. More are being added all the time!" />
            </div>
        </div>
    </section>
);

// Dashboard Components
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
            <div className="my-2 border-t border-slate-700/50"></div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tools</p>
            <NavItem icon={<SeoIcon />} label="SEO Tools" active={activeView === 'seo'} onClick={() => onNavigate('seo')} />
            <NavItem icon={<SocialIcon />} label="Social Media" active={activeView === 'social'} onClick={() => onNavigate('social')} />
            <NavItem icon={<EmailIcon />} label="Email Engine" active={activeView === 'email'} onClick={() => onNavigate('email')} />
            <NavItem icon={<AppStoreIcon />} label="ASO" active={activeView === 'aso'} onClick={() => onNavigate('aso')} />
            <NavItem icon={<LinkBuildingIcon />} label="Backlinks" active={activeView === 'backlinks'} onClick={() => onNavigate('backlinks')} />
            <NavItem icon={<ContentEngineIcon />} label="Blog" active={activeView === 'blog'} onClick={() => onNavigate('blog')} />
            <NavItem icon={<ShoppingCartIcon />} label="Marketplace" active={activeView === 'marketplace'} onClick={() => onNavigate('marketplace')} />
            <NavItem icon={<MultilingualIcon />} label="Multilingual" active={activeView === 'multilingual'} onClick={() => onNavigate('multilingual')} />

            <div className="flex-grow"></div>
            
            <div className="my-2 border-t border-slate-700/50"></div>
            <NavItem icon={<SettingsIcon />} label="Profile" active={activeView === 'profile'} onClick={() => onNavigate('profile')} />
            <NavItem icon={<SettingsIcon />} label="Account" active={activeView === 'account'} onClick={() => onNavigate('account')} />
        </nav>
    </aside>
);

const PageHeader: FC<{title: string; subtitle: string}> = ({title, subtitle}) => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 mt-1">{subtitle}</p>
    </div>
);

const PlaceholderView: FC<{title: string; subtitle: string; children?: React.ReactNode}> = ({title, subtitle, children}) => (
    <>
        <PageHeader title={title} subtitle={subtitle} />
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
             <div className="text-center py-12 border-2 border-dashed border-slate-600 rounded-lg">
                <p className="text-slate-500">Content for this page will be built here.</p>
                {children}
            </div>
        </div>
    </>
);

// --- DASHBOARD ANALYTICS COMPONENTS ---
const StatCard: FC<{ icon: ReactNode; title: string; value: string; change: string; isPositive: boolean }> = ({ icon, title, value, change, isPositive }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      <p className={`mt-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
    </div>
    <div className="bg-slate-700 p-3 rounded-full text-cyan-400">
      {icon}
    </div>
  </div>
);

const LineChart: FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-64 w-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="line-chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0079d2" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0079d2" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polyline fill="url(#line-chart-gradient)" points={`0,100 ${points} 100,100`} />
                <polyline fill="none" stroke="#009dd3" strokeWidth="1" points={points} />
            </svg>
        </div>
    );
};

const BarChart: FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="h-64 w-full flex items-end justify-around gap-4">
            {data.map(item => (
                <div key={item.name} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-full flex items-end">
                       <div className="w-full rounded-t-md" style={{ height: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-xs text-slate-400">{item.name}</p>
                </div>
            ))}
        </div>
    );
};

const DonutChart: FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let accumulatedCircumference = 0;

    return (
        <div className="h-64 w-full flex items-center justify-center gap-8">
            <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
                {data.map((item, index) => {
                    const dashArray = (item.value / total) * circumference;
                    const dashOffset = accumulatedCircumference;
                    accumulatedCircumference += dashArray;
                    return (
                        <circle
                            key={index}
                            r={radius}
                            cx="50"
                            cy="50"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="10"
                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                            strokeDashoffset={-dashOffset}
                        />
                    );
                })}
                 <text x="50" y="52" textAnchor="middle" dy=".3em" className="text-lg font-bold fill-white" style={{transform: 'rotate(90deg)', transformOrigin: 'center'}}>
                    {total.toLocaleString()}
                </text>
                 <text x="50" y="62" textAnchor="middle" dy=".3em" className="text-xs fill-slate-400" style={{transform: 'rotate(90deg)', transformOrigin: 'center'}}>
                    Users
                </text>
            </svg>
            <div className="flex flex-col gap-2">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-300">{item.name}</span>
                        <span className="font-bold text-white">{((item.value / total) * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const RecentActivityFeed: FC<{ activities: { icon: ReactNode, text: string, time: string }[] }> = ({ activities }) => (
    <div className="space-y-4">
        {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
                <div className="bg-slate-700 p-2 rounded-full text-cyan-400">
                    {activity.icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-white">{activity.text}</p>
                </div>
                <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
        ))}
    </div>
);


const DashboardAnalyticsView: FC<{ user: User }> = ({ user }) => {
    const kpiData = [
        { icon: <ClicksIcon />, title: "Qualified Clicks", value: "7,842", change: "+12.5% vs last month", isPositive: true },
        { icon: <ConversionIcon />, title: "Organic CVR", value: "3.21%", change: "+0.8% vs last month", isPositive: true },
        { icon: <AppStoreIcon />, title: "App Downloads", value: "1,203", change: "+21.3% vs last month", isPositive: true },
        { icon: <LinkBuildingIcon />, title: "Referring Domains", value: "89", change: "+5 vs last month", isPositive: true },
    ];

    const lineChartData = Array.from({ length: 30 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: 100 + Math.random() * 200 + i * 10 + Math.sin(i/2) * 50,
    }));

    const barChartData = [
        { name: "Organic", value: 45, color: "#009dd3" },
        { name: "Social", value: 25, color: "#0079d2" },
        { name: "Email", value: 18, color: "#0052bd" },
        { name: "Direct", value: 12, color: "#0d2a4c" },
    ];
    
     const engagementData = [
        { name: "New Users", value: 489, color: "#009dd3" },
        { name: "Returning", value: 1204, color: "#0052bd" },
    ];

    const activityData = [
      { icon: <CreatorGrowthIcon />, text: "New user signup: 'example@email.com'", time: "1m ago" },
      { icon: <ContentEngineIcon />, text: "Published new blog post: '10 SEO Tips for 2024'", time: "2h ago" },
      { icon: <EmailIcon />, text: "Launched 'Summer Sale' email campaign to 5,231 recipients.", time: "8h ago" },
      { icon: <SocialIcon />, text: "Scheduled 5 new posts for next week's social calendar.", time: "1d ago" },
      { icon: <SeoIcon />, text: "Completed weekly site audit. 2 new issues found.", time: "1d ago" },
      { icon: <LinkBuildingIcon />, text: "Acquired new backlink from 'tech-blog.com'", time: "2d ago" },
      { icon: <AppStoreIcon />, text: "A/B test for App Store icon finished. Variant B CVR is +15%.", time: "3d ago"},
    ];

    return (
        <>
            <PageHeader title="Dashboard" subtitle={`Welcome back, ${user.email}! Here's your performance overview.`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {kpiData.map(kpi => <StatCard key={kpi.title} {...kpi} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Qualified Traffic (Last 30 Days)</h3>
                    <LineChart data={lineChartData} />
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
                    <BarChart data={barChartData} />
                </div>
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">User Engagement</h3>
                    <DonutChart data={engagementData} />
                </div>
                 <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <RecentActivityFeed activities={activityData} />
                </div>
            </div>
        </>
    );
};

// --- SEO DASHBOARD COMPONENTS ---
const SeoTabButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
            active
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const SeoDashboardCard: FC<{ icon: ReactNode; title: string; description: string; children: ReactNode; }> = ({ icon, title, description, children }) => (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-full text-white">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-slate-400 text-sm">{description}</p>
                </div>
            </div>
            {children}
        </div>
    </div>
);

const SeoSitesView: FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <SeoDashboardCard
            icon={<WebsitePropertiesIcon />}
            title="Website Properties"
            description="Manage all your website domains, track site health scores, and monitor technical SEO performance across your digital properties."
        >
            <div className="grid grid-cols-2 gap-4 text-center my-6 py-6 border-y border-slate-700">
                <div>
                    <p className="text-4xl font-bold text-cyan-400">3</p>
                    <p className="text-sm text-slate-400">Active Sites</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-cyan-400">92%</p>
                    <p className="text-sm text-slate-400">Health Score</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-4">
                <button className="bg-cyan-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-cyan-600 transition-colors">Manage Sites</button>
                <button className="bg-transparent border border-slate-600 text-slate-300 font-semibold px-6 py-2 rounded-md hover:bg-slate-700 transition-colors">Run Audit</button>
            </div>
        </SeoDashboardCard>
        <SeoDashboardCard
            icon={<SitePerformanceIcon />}
            title="Site Performance"
            description="Track core web vitals, page speed metrics, and user experience indicators that impact your search rankings."
        >
            <div className="grid grid-cols-2 gap-4 text-center my-6 py-6 border-y border-slate-700">
                <div>
                    <p className="text-4xl font-bold text-cyan-400">1.2s</p>
                    <p className="text-sm text-slate-400">Load Time</p>
                </div>
                <div>
                    <p className="text-4xl font-bold text-cyan-400">95</p>
                    <p className="text-sm text-slate-400">Performance</p>
                </div>
            </div>
            <div className="flex items-center justify-center gap-4">
                <button className="bg-cyan-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-cyan-600 transition-colors">View Reports</button>
                <button className="bg-transparent border border-slate-600 text-slate-300 font-semibold px-6 py-2 rounded-md hover:bg-slate-700 transition-colors">Optimize</button>
            </div>
        </SeoDashboardCard>
    </div>
);


const SeoDashboardView: FC = () => {
    const [activeTab, setActiveTab] = useState<SeoTab>('sites');

    const renderContent = () => {
        switch (activeTab) {
            case 'sites':
                return <SeoSitesView />;
            case 'keywords':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Keyword management and tracking tools will be here.</div>;
            case 'content':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Content optimization items and suggestions will be here.</div>;
            case 'faqs':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">FAQ schema management and generation tools will be here.</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <PageHeader
                title="SEO Management Dashboard"
                subtitle="Monitor and optimize all aspects of your SEO strategy from one central location"
            />
            <div className="flex items-center gap-4">
                <SeoTabButton label="SEO SITES" active={activeTab === 'sites'} onClick={() => setActiveTab('sites')} />
                <SeoTabButton label="SEO KEYWORDS" active={activeTab === 'keywords'} onClick={() => setActiveTab('keywords')} />
                <SeoTabButton label="CONTENT ITEMS" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                <SeoTabButton label="SEO FAQS" active={activeTab === 'faqs'} onClick={() => setActiveTab('faqs')} />
            </div>
            {renderContent()}
        </>
    );
};

// --- SOCIAL DASHBOARD COMPONENTS ---
const SocialTabButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
            active
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const SocialAccountCard: FC<{
    icon: ReactNode;
    platform: string;
    username: string;
    followers: string;
    isConnected: boolean;
}> = ({ icon, platform, username, followers, isConnected }) => (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col items-center text-center">
        <div className="text-4xl mb-4 text-white">{icon}</div>
        <h3 className="text-xl font-bold text-white">{platform}</h3>
        <p className="text-sm text-slate-400 mb-4">{username}</p>
        <p className="text-2xl font-bold text-cyan-400 mb-6">{followers}</p>
        <p className="text-xs text-slate-500 mb-1">Followers</p>
        {isConnected ? (
             <button className="w-full bg-transparent border border-slate-600 text-slate-300 font-semibold px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
                Manage
            </button>
        ) : (
            <button className="w-full bg-cyan-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors">
                Connect
            </button>
        )}
    </div>
);


const SocialAccountsView: FC = () => {
    const socialAccounts = [
        { platform: 'X / Twitter', username: '@icycon_app', followers: '12.4K', isConnected: true, icon: <XIcon /> },
        { platform: 'Facebook', username: 'IcyCon', followers: '8.9K', isConnected: true, icon: <FacebookIcon /> },
        { platform: 'Instagram', username: '@icycon', followers: '23.1K', isConnected: true, icon: <InstagramIcon /> },
        { platform: 'LinkedIn', username: 'IcyCon', followers: '4.2K', isConnected: false, icon: <LinkedInIcon /> },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {socialAccounts.map(acc => <SocialAccountCard key={acc.platform} {...acc} />)}
             <div className="bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 p-6 flex flex-col items-center justify-center text-center hover:border-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <h3 className="text-lg font-semibold text-white">Add Account</h3>
                <p className="text-sm text-slate-400">Connect a new social profile.</p>
            </div>
        </div>
    );
};

const SocialDashboardView: FC = () => {
    const [activeTab, setActiveTab] = useState<SocialTab>('accounts');

    const renderContent = () => {
        switch (activeTab) {
            case 'accounts':
                return <SocialAccountsView />;
            case 'scheduler':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Content scheduling and automation tools will be here.</div>;
            case 'analytics':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Analytics and reporting for social media performance will be here.</div>;
            case 'engagement':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Engagement tracking tools for comments and messages will be here.</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <PageHeader
                title="Social Media Dashboard"
                subtitle="Manage accounts, schedule posts, and track your social performance."
            />
            <div className="flex items-center gap-4 flex-wrap">
                <SocialTabButton label="ACCOUNTS" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />
                <SocialTabButton label="SCHEDULER" active={activeTab === 'scheduler'} onClick={() => setActiveTab('scheduler')} />
                <SocialTabButton label="ANALYTICS" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                <SocialTabButton label="ENGAGEMENT" active={activeTab === 'engagement'} onClick={() => setActiveTab('engagement')} />
            </div>
            {renderContent()}
        </>
    );
};

// --- MARKETPLACE DASHBOARD COMPONENTS ---
const MarketplaceTabButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
            active
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const MarketplaceProductsView: FC = () => {
    const products = [
        { name: "SEO Mastery Course", price: 499, sales: 124, status: "Published" },
        { name: "Social Media Toolkit", price: 99, sales: 450, status: "Published" },
        { name: "Email Marketing Templates", price: 49, sales: 832, status: "Published" },
        { name: "Content Strategy Playbook", price: 149, sales: 0, status: "Draft" },
    ];

    return (
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700">
             <div className="p-4 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">All Products</h3>
                <button className="bg-cyan-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors flex items-center text-sm">
                    <ProductIcon />
                    Add Product
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product Name</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Sales</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.name} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</th>
                                <td className="px-6 py-4">${product.price.toLocaleString()}</td>
                                <td className="px-6 py-4">{product.sales.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Published' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="font-medium text-cyan-400 hover:underline">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MarketplaceDashboardView: FC = () => {
    const [activeTab, setActiveTab] = useState<MarketplaceTab>('products');
    
    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <MarketplaceProductsView />;
            case 'services':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Service offerings management will be here.</div>;
            case 'transactions':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Transaction history and management will be here.</div>;
            case 'vendors':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Vendor management tools will be here.</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <PageHeader
                title="Marketplace Dashboard"
                subtitle="Manage your digital products, services, transactions, and vendors."
            />
            <div className="flex items-center gap-4 flex-wrap">
                <MarketplaceTabButton label="PRODUCTS" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                <MarketplaceTabButton label="SERVICES" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                <MarketplaceTabButton label="TRANSACTIONS" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
                <MarketplaceTabButton label="VENDORS" active={activeTab === 'vendors'} onClick={() => setActiveTab('vendors')} />
            </div>
            {renderContent()}
        </>
    );
};

// --- EMAIL DASHBOARD COMPONENTS ---
const EmailTabButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${
            active
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const EmailCampaignsView: FC = () => {
    const campaigns = [
        { name: "Weekly Newsletter - Oct Week 2", status: "Sent", recipients: 12530, openRate: "24.5%", clickRate: "3.1%" },
        { name: "Flash Sale Announcement", status: "Sent", recipients: 8200, openRate: "35.2%", clickRate: "8.9%" },
        { name: "New Feature Launch", status: "Draft", recipients: 0, openRate: "N/A", clickRate: "N/A" },
        { name: "Abandoned Cart Reminder", status: "Automated", recipients: 432, openRate: "45.8%", clickRate: "12.3%" },
    ];

    return (
        <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700">
             <div className="p-4 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Recent Campaigns</h3>
                <button className="bg-cyan-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors flex items-center text-sm">
                    <CampaignsIcon />
                    New Campaign
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Campaign Name</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Recipients</th>
                            <th scope="col" className="px-6 py-3">Open Rate</th>
                            <th scope="col" className="px-6 py-3">Click Rate</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => (
                            <tr key={campaign.name} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{campaign.name}</th>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                         campaign.status === 'Sent' ? 'bg-green-900/50 text-green-300' :
                                         campaign.status === 'Draft' ? 'bg-yellow-900/50 text-yellow-300' :
                                         'bg-blue-900/50 text-blue-300'
                                     }`}>
                                        {campaign.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{campaign.recipients.toLocaleString()}</td>
                                <td className="px-6 py-4">{campaign.openRate}</td>
                                <td className="px-6 py-4">{campaign.clickRate}</td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="font-medium text-cyan-400 hover:underline">View</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const EmailDashboardView: FC = () => {
    const [activeTab, setActiveTab] = useState<EmailTab>('campaigns');
    
    const renderContent = () => {
        switch (activeTab) {
            case 'campaigns':
                return <EmailCampaignsView />;
            case 'templates':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Email template management will be here.</div>;
            case 'contacts':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Contact list management will be here.</div>;
            case 'analytics':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Email analytics and reporting will be here.</div>;
            case 'flows':
                return <div className="mt-8 text-center text-slate-500 p-12 bg-slate-800 rounded-lg border border-slate-700">Custom email automation flows will be here.</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <PageHeader
                title="Email Engine Dashboard"
                subtitle="Manage campaigns, templates, contacts, and automated flows."
            />
            <div className="flex items-center gap-4 flex-wrap">
                <EmailTabButton label="CAMPAIGNS" active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} />
                <EmailTabButton label="TEMPLATES" active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
                <EmailTabButton label="CONTACTS" active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
                <EmailTabButton label="ANALYTICS" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                <EmailTabButton label="FLOWS" active={activeTab === 'flows'} onClick={() => setActiveTab('flows')} />
            </div>
            {renderContent()}
        </>
    );
};


// --- PAGE COMPONENTS ---

// Landing Page
const LandingPage: FC<{
    onNavigateToLogin: () => void;
    onNavigateToSignup: () => void;
}> = ({ onNavigateToLogin, onNavigateToSignup }) => (
    <div className="bg-slate-900 text-white">
        <LandingNavbar onLogin={onNavigateToLogin} onSignup={onNavigateToSignup} />
        <Hero onNavigateToSignup={onNavigateToSignup} />
        <CoreSeoServices />
        <TailoredStrategies />
        <WhyChooseUs />
        <ContactSection />
        <FAQ />
        <Footer />
    </div>
);

// Auth Page
const AuthPage: FC<{
    currentPage: 'login' | 'signup';
    setCurrentPage: (page: Page) => void;
    login: (user: User) => void;
}> = ({ currentPage, setCurrentPage, login }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAuth = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const authFn = currentPage === 'login' ? api.login : api.signup;
            const { user } = await authFn(email, pass);
            login(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const isLogin = currentPage === 'login';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
            <AuthForm
                title={isLogin ? 'Login' : 'Login'}
                isLogin={isLogin}
                onSubmit={handleAuth}
                onSwitch={() => setCurrentPage(isLogin ? 'signup' : 'login')}
                error={error}
                loading={loading}
            />
        </div>
    );
};


// Dashboard Page
const DashboardPage: FC<{ user: User; logout: () => void; }> = ({ user, logout }) => {
    const [activeView, setActiveView] = useState<AppView>('dashboard');

    const renderActiveView = () => {
        switch(activeView) {
            case 'dashboard':
                return <DashboardAnalyticsView user={user} />;
            case 'seo':
                return <SeoDashboardView />
            case 'social':
                return <SocialDashboardView />
            case 'email':
                return <EmailDashboardView />
             case 'aso':
                return <PlaceholderView title="App Store Optimization" subtitle="Track keywords, performance, and competitors for your mobile apps." />
            case 'backlinks':
                return <PlaceholderView title="Backlinks Management" subtitle="Track, manage, and analyze your backlink profile." />
            case 'blog':
                return <PlaceholderView title="Blog Management" subtitle="Create, schedule, and optimize blog content." />
            case 'marketplace':
                return <MarketplaceDashboardView />
            case 'multilingual':
                return <PlaceholderView title="Multilingual Support" subtitle="Manage translations and language-specific SEO." />
            case 'profile':
                return <PlaceholderView title="User Profile" subtitle="Update your personal information." />
            case 'account':
                return <PlaceholderView title="Account & Billing" subtitle="Manage your subscription and payment details." />
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


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };
  
  if (user) {
    return <DashboardPage user={user} logout={handleLogout} />;
  }

  switch (currentPage) {
    case 'login':
    case 'signup':
      return <AuthPage currentPage={currentPage} setCurrentPage={setCurrentPage} login={handleLogin} />;
    case 'landing':
    default:
      return <LandingPage onNavigateToLogin={() => setCurrentPage('login')} onNavigateToSignup={() => setCurrentPage('signup')} />;
  }
};

export default App;
