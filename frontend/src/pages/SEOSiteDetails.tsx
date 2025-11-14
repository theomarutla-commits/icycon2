import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';
import { useNavigate, useParams } from 'react-router-dom';

const SEOSiteDetails: React.FC<{ siteId?: number; onBack?: () => void }> = ({ siteId, onBack }) => {
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [domain, setDomain] = useState('');
  const [sitemap, setSitemap] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const routeId = params.id ? Number(params.id) : undefined;
  const id = siteId ?? routeId;

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('No site id provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await api.getSEOSite(id);
        setSite(data);
        setDomain(data.domain || '');
        setSitemap(data.sitemaps_url || '');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load site');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('No site id');
      const updated = await api.updateSEOSite(id, { domain, sitemaps_url: sitemap });
      setSite(updated);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this site? This cannot be undone.')) return;
    try {
      setLoading(true);
      if (!id) throw new Error('No site id');
      await api.deleteSEOSite(id);
      if (onBack) onBack();
      else navigate('/app/seo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-white">Loading site...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!site) return <div className="p-4 text-white">No site found</div>;

  return (
    <div className="bg-slate-900 p-6 rounded">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Site</h2>
        <div className="flex gap-2">
          <button onClick={() => { if (onBack) onBack(); else navigate('/app/seo'); }} className="px-3 py-1 rounded bg-slate-700 text-white">Back</button>
        </div>
      </div>

      <div className="mt-4">
        {editing ? (
          <div className="space-y-2">
            <input className="w-full p-2 rounded bg-slate-800 text-white" value={domain} onChange={e => setDomain(e.target.value)} />
            <input className="w-full p-2 rounded bg-slate-800 text-white" value={sitemap} onChange={e => setSitemap(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-emerald-500 px-3 py-1 rounded text-white">Save</button>
              <button onClick={() => setEditing(false)} className="bg-slate-700 px-3 py-1 rounded text-white">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Domain:</strong> {site.domain}</p>
            <p><strong>Sitemap:</strong> {site.sitemaps_url || '—'}</p>
            <p><strong>Locale:</strong> {site.default_locale}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(true)} className="bg-amber-600 px-3 py-1 rounded text-white">Edit</button>
              <button onClick={handleDelete} className="bg-red-600 px-3 py-1 rounded text-white">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOSiteDetails;
