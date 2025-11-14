import React, { useState } from 'react';
import { api } from '../../api/auth';

interface ExportAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ExportAnalyticsModal: React.FC<ExportAnalyticsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<'csv'|'json'>('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  if (!isOpen) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = { format };
      if (startDate) payload.start_date = startDate;
      if (endDate) payload.end_date = endDate;

      const result = await api.exportAnalytics(payload);

      // If server returned JSON with a download URL
      if (result && typeof result === 'object' && result.download_url) {
        window.open(result.download_url, '_blank');
      } else if (result instanceof Blob) {
        const url = window.URL.createObjectURL(result);
        const a = document.createElement('a');
        a.href = url;
        const ext = format === 'csv' ? 'csv' : 'json';
        a.download = `analytics-export.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Unknown response, try to stringify
        const txt = JSON.stringify(result);
        const blob = new Blob([txt], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4">
        <div className="bg-gradient-to-r from-green-700 to-teal-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Export Analytics</h2>
          <button onClick={onClose} className="text-white text-2xl">✕</button>
        </div>

        <form onSubmit={handleExport} className="p-6 space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Start Date (optional)</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">End Date (optional)</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400">{loading ? 'Exporting...' : 'Export'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportAnalyticsModal;
