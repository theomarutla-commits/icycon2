import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderView from './PlaceholderView';
import { api } from '../../../api/auth';

const SeoOptimisationView = () => {
    const navigate = useNavigate();
    const [seoData, setSeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [newSitemap, setNewSitemap] = useState('');

    useEffect(() => {
        const fetchSEOData = async () => {
            try {
                // Try to fetch sites, keywords, and content
                const [sitesRes, keywordsRes, contentRes] = await Promise.allSettled([
                    api.getSEOSites?.() || Promise.reject('API not available'),
                    api.getSEOKeywords?.() || Promise.reject('API not available'),
                    api.getSEOContent?.() || Promise.resolve([]),
                ]);

                setSeoData({
                    sites: sitesRes.status === 'fulfilled' ? sitesRes.value : [],
                    keywords: keywordsRes.status === 'fulfilled' ? keywordsRes.value : [],
                    content: contentRes.status === 'fulfilled' ? contentRes.value : []
                });
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load SEO data');
            } finally {
                setLoading(false);
            }
        };

        fetchSEOData();
    }, []);

    const handleAddSite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.createSEOSite({ domain: newDomain, sitemaps_url: newSitemap });
            // refresh sites
            const sites = await api.getSEOSites();
            setSeoData((prev: any) => ({ ...prev, sites }));
            setNewDomain('');
            setNewSitemap('');
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add site');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PlaceholderView title="SEO Tools" subtitle="Loading..." />;
    if (error) return <PlaceholderView title="SEO Tools" subtitle={`Error: ${error}`} />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">SEO Optimization</h1>
            <p className="text-slate-400 mb-8">Manage your sites, keywords, and content optimization.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DataCard title="Sites" value={seoData?.sites?.length || 0} />
                <DataCard title="Keyword Clusters" value={seoData?.keywords?.length || 0} />
                <DataCard title="Content Items" value={seoData?.content?.length || 0} />
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Sites Overview</h2>
                <div className="mb-4 flex gap-2">
                    <button onClick={() => setShowAddForm(s => !s)} className="bg-amber-600 px-4 py-2 rounded text-white">{showAddForm ? 'Cancel' : 'Add Site'}</button>
                </div>
                {showAddForm && (
                    <form onSubmit={handleAddSite} className="mb-4 space-y-2">
                        <input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="https://example.com" className="w-full p-2 rounded bg-slate-700" />
                        <input value={newSitemap} onChange={e => setNewSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" className="w-full p-2 rounded bg-slate-700" />
                        <div>
                            <button type="submit" className="bg-emerald-500 px-4 py-2 rounded text-white">Create Site</button>
                        </div>
                    </form>
                )}
                {seoData?.sites && seoData.sites.length > 0 ? (
                    <div className="space-y-2">
                        {seoData.sites.map((site: any) => (
                            <div key={site.id} className="p-3 bg-slate-700 rounded">
                                <p className="font-semibold">{site.domain}</p>
                                <p className="text-sm text-slate-400">Locale: {site.default_locale}</p>
                                <div className="mt-2">
                                    <button onClick={() => navigate(`/app/seo/site/${site.id}`)} className="text-sm text-amber-400">Manage</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400">No sites configured yet</p>
                )}
            </div>
        </div>
    );
};

interface DataCardProps {
    title: string;
    value: number;
}

const DataCard: React.FC<DataCardProps> = ({ title, value }) => (
    <div className="bg-slate-800 rounded-lg p-6">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default SeoOptimisationView;