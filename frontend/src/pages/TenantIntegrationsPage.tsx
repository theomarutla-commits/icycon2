import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';

const TenantIntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const data = await api.getTenantIntegrations();
        setIntegrations(Array.isArray(data) ? data : data.results || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load integrations');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Integrations</h1>
        <p className="text-slate-300 mb-6">Connected services for your tenant.</p>

        {loading && <div>Loading integrations...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        <div className="space-y-4 mt-4">
          {integrations.map((i) => (
            <div key={i.id} className="bg-white rounded shadow p-4 text-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{i.name}</h3>
                  <p className="text-sm text-gray-600">Service: {i.service}</p>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-semibold ${i.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {i.is_active ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>
          ))}

          {integrations.length === 0 && !loading && (
            <div className="bg-white rounded shadow p-6 text-center text-slate-700">No integrations found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantIntegrationsPage;
