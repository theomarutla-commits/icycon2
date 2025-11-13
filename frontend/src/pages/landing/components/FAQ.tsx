import React, { FC, useState } from 'react';

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

export default FAQ;