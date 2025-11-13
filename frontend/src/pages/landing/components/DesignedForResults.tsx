import React, { FC } from 'react';

const DesignedForResults: FC = () => (
    <section className="py-20 px-4 bg-[#002292]">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Designed for Results</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="p-6"><h3 className="text-xl font-bold mb-2 text-[#00deb7]">Increase Visibility</h3><p>Our powerful SEO tools help you understand what your customers are searching for and how to reach them.</p></div>
                <div className="p-6"><h3 className="text-xl font-bold mb-2 text-[#00deb7]">Automate Your Workflow</h3><p>Save hours every week by scheduling social media posts and automating email sequences with our intuitive builders.</p></div>
                <div className="p-6"><h3 className="text-xl font-bold mb-2 text-[#00deb7]">Make Data-Driven Decisions</h3><p>Get a clear view of your performance across all channels with our integrated analytics dashboards.</p></div>
                <div className="p-6"><h3 className="text-xl font-bold mb-2 text-[#00deb7]">Engage Your Audience</h3><p>From social media comments to targeted email campaigns, we provide the tools to build lasting customer relationships.</p></div>
            </div>
        </div>
    </section>
);

export default DesignedForResults;