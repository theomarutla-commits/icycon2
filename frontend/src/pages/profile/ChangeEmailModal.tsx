import React, { useState } from 'react';
import { api } from '../../api/auth';

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentEmail?: string;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose, onSuccess, currentEmail }) => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newEmail || !confirmEmail || newEmail !== confirmEmail) {
      setError('Emails must match and not be empty');
      return;
    }
    if (!password) {
      setError('Password is required to change email');
      return;
    }
    setLoading(true);
    try {
      await api.changeEmail(newEmail, password);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Change Email</h2>
          <button onClick={onClose} className="text-white text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Current Email</label>
            <input value={currentEmail || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">New Email</label>
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirm New Email</label>
            <input value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded">{loading ? 'Saving...' : 'Change Email'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
