import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';

const ASOPage: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'apps'|'keywords'|'listings'>('apps');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [appsData, keywordsData, listingsData] = await Promise.all([
          api.getASOApps(),
          api.getASOKeywords(),
          api.getASOListings(),
        ]);
        setApps(Array.isArray(appsData) ? appsData : appsData.results || []);
        setKeywords(Array.isArray(keywordsData) ? keywordsData : keywordsData.results || []);
        setListings(Array.isArray(listingsData) ? listingsData : listingsData.results || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ASO data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">App Store Optimization</h1>
        <p className="text-blue-200 mb-8">Track and optimize your mobile apps across iOS and Android platforms.</p>

        {loading && <div className="text-white">Loading ASO data...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        <div className="flex gap-3 mb-6">
          {['apps','keywords','listings'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded font-semibold ${activeTab === t ? 'bg-white text-blue-900' : 'bg-blue-700 text-white hover:bg-blue-600'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'apps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {app.icon_url && <img src={app.icon_url} alt={app.name} className="w-full h-48 object-cover" />}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{app.platform}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold">{app.rating || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviews:</span>
                      <span className="font-semibold">{app.reviews_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-semibold">{app.downloads_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Keywords:</span>
                      <span className="font-semibold">{app.keywords_count || 0}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="space-y-4">
            {keywords.map((k) => (
              <div key={k.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{k.keyword}</h4>
                    <p className="text-sm text-gray-600">App: {k.app_name || k.app?.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">Pos: {k.position}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="bg-white rounded-lg shadow p-4">
                <h4 className="font-bold">{l.title || `${l.app_name} Listing`}</h4>
                <p className="text-sm text-gray-600">Locale: {l.locale}</p>
                <p className="mt-2 text-gray-800">{l.description}</p>
              </div>
            ))}
          </div>
        )}

        {apps.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No apps found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ASOPage;
