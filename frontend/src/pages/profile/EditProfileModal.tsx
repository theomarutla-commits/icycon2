import React, { useState, useEffect } from 'react';
import { api } from '../../api/auth';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profile?: any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSuccess, profile }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company: '',
    location: '',
    bio: '',
    avatar_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company: profile.company || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
      setError(null);
    }
  }, [profile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadProfileAvatar(file);
      // Expecting { avatar_url: '...' } or similar
      const avatarUrl = res?.avatar_url || res?.url || '';
      if (avatarUrl) {
        setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.updateUserProfile(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">First Name</label>
              <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
              <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Company</label>
              <input name="company" value={formData.company} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Avatar URL</label>
            <input name="avatar_url" value={formData.avatar_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            <p className="text-xs text-gray-500 mt-2">Or upload a file</p>
            <input type="file" accept="image/*" onChange={handleAvatarFile} className="mt-2" />
            {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
