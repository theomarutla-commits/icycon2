import React, { useEffect, useState } from 'react';
import PlaceholderView from './PlaceholderView';
import { api } from '../../../api/auth';

const SeoOptimisationView = () => {
    const [seoData, setSeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSEOData = async () => {
            try {
                // Try to fetch sites, keywords, and content
                const [sitesRes, keywordsRes, contentRes] = await Promise.allSettled([
                    api.getAnalyticsSites?.() || Promise.reject('API not available'),
                    fetch(`${window.location.origin}/api/seo/keywords/`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        }
                    }).then(r => r.json()),
                    fetch(`${window.location.origin}/api/seo/content/`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('authToken')}`,
                        }
                    }).then(r => r.json())
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
                {seoData?.sites && seoData.sites.length > 0 ? (
                    <div className="space-y-2">
                        {seoData.sites.map((site: any) => (
                            <div key={site.id} className="p-3 bg-slate-700 rounded">
                                <p className="font-semibold">{site.domain}</p>
                                <p className="text-sm text-slate-400">Locale: {site.default_locale}</p>
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