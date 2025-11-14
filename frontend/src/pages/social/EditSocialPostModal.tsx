import React, { useState, useEffect } from 'react';
import { api } from '../../api/auth';

interface SocialPost {
  id: number;
  content: string;
  platform: string;
  scheduled_time?: string;
}

interface EditSocialPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post?: SocialPost;
}

const EditSocialPostModal: React.FC<EditSocialPostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  post,
}) => {
  const [formData, setFormData] = useState({
    content: '',
    platform: 'twitter',
    scheduled_time: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post && isOpen) {
      setFormData({
        content: post.content,
        platform: post.platform,
        scheduled_time: post.scheduled_time || '',
      });
      setError(null);
    }
  }, [post, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setLoading(true);
    setError(null);

    // Validation
    if (!formData.content.trim()) {
      setError('Post content is required');
      setLoading(false);
      return;
    }

    if (formData.content.length > 280 && formData.platform === 'twitter') {
      setError('Twitter posts must be 280 characters or less');
      setLoading(false);
      return;
    }

    try {
      await api.updateSocialPost(post.id, {
        content: formData.content,
        platform: formData.platform,
        scheduled_time: formData.scheduled_time || null,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4">
        <div className="bg-gradient-to-r from-pink-600 to-red-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Platform *
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Post Content * {formData.platform === 'twitter' && `(${formData.content.length}/280)`}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows={5}
              maxLength={formData.platform === 'twitter' ? 280 : 5000}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.platform === 'twitter' && 'Twitter has a 280 character limit'}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Schedule Post (Optional)
            </label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to post immediately</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-600 text-white py-2 rounded font-semibold hover:bg-pink-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSocialPostModal;
