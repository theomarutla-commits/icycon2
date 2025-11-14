import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';

const SEOPage: React.FC = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sites');

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setLoading(true);
        const sitesData = await api.getSEOSites();
        const keywordsData = await api.getSEOKeywords();
        
        setSites(Array.isArray(sitesData) ? sitesData : sitesData.results || []);
        setKeywords(Array.isArray(keywordsData) ? keywordsData : keywordsData.results || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load SEO data');
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-orange-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">SEO Optimization</h1>
        <p className="text-amber-200 mb-8">Monitor and improve your website's search engine optimization.</p>

        {loading && <div className="text-white">Loading SEO data...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('sites')}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeTab === 'sites'
                ? 'bg-white text-amber-900'
                : 'bg-amber-700 text-white hover:bg-amber-600'
            }`}
          >
            Sites
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeTab === 'keywords'
                ? 'bg-white text-amber-900'
                : 'bg-amber-700 text-white hover:bg-amber-600'
            }`}
          >
            Keywords
          </button>
        </div>

        {/* Sites Tab */}
        {activeTab === 'sites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div key={site.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{site.domain}</h3>

                <div className="space-y-4 mb-6">
                  <div className="border-b pb-3">
                    <p className="text-gray-600 text-sm">Domain Authority</p>
                    <p className="text-2xl font-bold text-blue-600">{site.domain_authority || 'N/A'}</p>
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
                    <p className="text-gray-600 text-sm">Last Crawled</p>
                    <p className="text-sm font-semibold">
                      {site.last_crawled ? new Date(site.last_crawled).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition">
                  View Analytics
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            {keywords.map((keyword) => (
              <div key={keyword.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{keyword.keyword}</h3>
                    <p className="text-gray-600 text-sm">
                      Domain: {keyword.domain || 'N/A'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded text-sm font-semibold bg-blue-100 text-blue-800">
                    Rank #{keyword.ranking || 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Search Volume</p>
                    <p className="font-bold">{keyword.search_volume || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Difficulty</p>
                    <p className="font-bold">{keyword.difficulty || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Intent</p>
                    <p className="font-bold capitalize">{keyword.intent || 'Mixed'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Traffic Value</p>
                    <p className="font-bold">${keyword.traffic_value || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {((activeTab === 'sites' && sites.length === 0) || 
          (activeTab === 'keywords' && keywords.length === 0)) && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">
              No {activeTab} found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOPage;
