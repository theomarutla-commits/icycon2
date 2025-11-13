import React, { FC } from 'react';

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

export default ContactSection;