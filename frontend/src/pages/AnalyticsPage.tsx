import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';

const AnalyticsPage: React.FC = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [pageviews, setPageviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sites'|'pageviews'>('sites');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [sitesData, pageviewsData] = await Promise.all([
          api.getAnalyticsSites(),
          api.getAnalyticsPageViews(),
        ]);
        setSites(Array.isArray(sitesData) ? sitesData : sitesData.results || []);
        setPageviews(Array.isArray(pageviewsData) ? pageviewsData : pageviewsData.results || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-teal-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-green-200 mb-8">Track your website performance and user engagement metrics.</p>

        {loading && <div className="text-white">Loading analytics...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        <div className="flex gap-3 mb-6">
          {['sites','pageviews'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded font-semibold ${activeTab === t ? 'bg-white text-blue-900' : 'bg-blue-700 text-white hover:bg-blue-600'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'sites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div key={site.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{site.domain}</h3>

                <div className="space-y-4 mb-6">
                  <div className="border-b pb-3">
                    <p className="text-gray-600 text-sm">Traffic</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {site.monthly_traffic ? `${(site.monthly_traffic / 1000).toFixed(1)}K` : 'N/A'}
                    </p>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-gray-600 text-sm">Backlinks</p>
                    <p className="text-2xl font-bold text-green-600">{site.backlink_count || 0}</p>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-gray-600 text-sm">Indexed Pages</p>
                    <p className="text-2xl font-bold text-purple-600">{site.indexed_pages || 0}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Rank</p>
                    <p className="text-2xl font-bold text-orange-600">{site.rank || 'N/A'}</p>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pageviews' && (
          <div className="space-y-4">
            {pageviews.map((pv) => (
              <div key={pv.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{pv.site_domain || pv.site?.domain}</h4>
                    <p className="text-sm text-gray-600">{pv.url}</p>
                  </div>
                  <div className="text-sm text-gray-500">{pv.timestamp ? new Date(pv.timestamp).toLocaleString() : ''}</div>
                </div>
                <p className="mt-2 text-gray-700">Visitor: {pv.visitor_id || 'anon'} • Duration: {pv.duration || 0}s</p>
              </div>
            ))}
          </div>
        )}

        {sites.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No sites to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
