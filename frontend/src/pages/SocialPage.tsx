import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';
import CreateSocialPostModal from './social/CreateSocialPostModal';
import EditSocialPostModal from './social/EditSocialPostModal';

const SocialPage: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [engagements, setEngagements] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('accounts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const fetchSocialData = async () => {
    try {
      setLoading(true);
      const [accountsData, postsData, commentsData, engagementsData, messagesData] = await Promise.all([
        api.getSocialAccounts(),
        api.getSocialPosts(),
        api.getSocialComments(),
        api.getSocialEngagements(),
        api.getSocialMessages(),
      ]);

      setAccounts(Array.isArray(accountsData) ? accountsData : accountsData.results || []);
      setPosts(Array.isArray(postsData) ? postsData : postsData.results || []);
      setComments(Array.isArray(commentsData) ? commentsData : commentsData.results || []);
      setEngagements(Array.isArray(engagementsData) ? engagementsData : engagementsData.results || []);
      setMessagesList(Array.isArray(messagesData) ? messagesData : messagesData.results || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load social data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 to-red-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Social Media</h1>
            <p className="text-pink-200">Manage and monitor your social media accounts and posts.</p>
          </div>
          {activeTab === 'posts' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-pink-900 px-6 py-3 rounded-lg font-bold hover:bg-pink-50 transition shadow-lg"
            >
              + New Post
            </button>
          )}
        </div>

        {loading && <div className="text-white">Loading social media data...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['accounts','posts','comments','engagements','messages'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded font-semibold transition ${activeTab === t ? 'bg-white text-pink-900' : 'bg-pink-700 text-white hover:bg-pink-600'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">
                    {account.platform === 'twitter' && '𝕏'}
                    {account.platform === 'facebook' && 'f'}
                    {account.platform === 'instagram' && '📷'}
                    {account.platform === 'linkedin' && 'in'}
                    {account.platform === 'tiktok' && '♪'}
                    {!['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok'].includes(account.platform) && '●'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{account.username}</h3>
                    <p className="text-gray-600 text-sm capitalize">{account.platform}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-bold">{account.follower_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-bold">{account.engagement_rate || '0%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${account.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 capitalize">{post.platform}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(post.created_at || post.posted_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status || 'Published'}
                  </span>
                </div>

                <p className="text-gray-800 mb-4">{post.content}</p>

                <div className="flex gap-6 pt-4 border-t mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Likes</p>
                    <p className="font-bold">{post.like_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Comments</p>
                    <p className="font-bold">{post.comment_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Shares</p>
                    <p className="font-bold">{post.share_count || 0}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm">
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {posts.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg mb-4">No posts found.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
                >
                  + Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {((activeTab === 'accounts' && accounts.length === 0) || 
          (activeTab === 'posts' && posts.length === 0) ||
          (activeTab === 'comments' && comments.length === 0) ||
          (activeTab === 'engagements' && engagements.length === 0) ||
          (activeTab === 'messages' && messagesList.length === 0)
        ) && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">
              No {activeTab} found.
            </p>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow p-4">
                <h4 className="font-bold">{c.author || c.author_name}</h4>
                <p className="text-sm text-gray-600">On: {c.post_title || c.post?.title}</p>
                <p className="mt-2 text-gray-800">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Engagements Tab */}
        {activeTab === 'engagements' && (
          <div className="space-y-4">
            {engagements.map((e) => (
              <div key={e.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{e.post_title || e.post?.title}</h4>
                    <p className="text-sm text-gray-600">Platform: {e.platform}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">Likes: {e.likes || 0}</div>
                    <div className="text-sm text-gray-500">Shares: {e.shares || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messagesList.map((m) => (
              <div key={m.id} className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-600">From: {m.sender || m.sender_id}</div>
                <p className="mt-2 text-gray-800">{m.content}</p>
                <div className="text-xs text-gray-500 mt-2">{m.timestamp ? new Date(m.timestamp).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <CreateSocialPostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchSocialData}
        />
        <EditSocialPostModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPost(null);
          }}
          onSuccess={fetchSocialData}
          post={selectedPost}
        />
      </div>
    </div>
  );
};

export default SocialPage;
