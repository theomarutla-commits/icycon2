import React, { useState, useEffect } from 'react';
import { api } from '../../api/auth';

interface SiteAnalyticsProps {
  siteId: number;
  onClose: () => void;
}

const SiteAnalytics: React.FC<SiteAnalyticsProps> = ({ siteId, onClose }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch detailed analytics for the site
        // For now, we'll use the general analytics endpoint
        const data = await api.getAnalyticsSites();
        const siteData = Array.isArray(data) ? data.find(s => s.id === siteId) : data;
        setAnalytics(siteData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [siteId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Site Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="text-gray-600">Loading analytics...</div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {analytics && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Traffic</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.monthly_traffic ? `${(analytics.monthly_traffic / 1000).toFixed(1)}K` : '0'}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Backlinks</p>
                <p className="text-2xl font-bold text-green-600">{analytics.backlink_count || 0}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Indexed Pages</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.indexed_pages || 0}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Rank</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.rank || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-800 mb-2">Key Insights</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Domain Authority: {analytics.domain_authority || 'N/A'}</li>
                <li>• Last Updated: {analytics.last_crawled ? new Date(analytics.last_crawled).toLocaleDateString() : 'Never'}</li>
                <li>• Domain: {analytics.domain}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition font-semibold"
          >
            Close
          </button>
          <button
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition font-semibold"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteAnalytics;
