import React, { FC } from 'react';

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

export default PlaceholderView;