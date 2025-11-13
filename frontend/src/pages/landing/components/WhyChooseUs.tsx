import React, { FC } from 'react';

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

export default WhyChooseUs;