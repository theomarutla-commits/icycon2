import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';
import EditProfileModal from './profile/EditProfileModal';
import ChangeEmailModal from './profile/ChangeEmailModal';
import ChangePasswordModal from './profile/ChangePasswordModal';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile();
      const profileData = Array.isArray(data) ? data[0] : data;
      setProfile(profileData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // profile fetch and modal handlers handled via fetchProfile and modals

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>

        {loading && <div className="text-white">Loading profile...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>}

        {profile && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No Avatar</span>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Email</p>
                  <p className="text-gray-900 text-lg">{profile.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">First Name</p>
                  <p className="text-gray-900 text-lg">{profile.first_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Last Name</p>
                  <p className="text-gray-900 text-lg">{profile.last_name || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Username</p>
                <p className="text-gray-900 text-lg">{profile.username}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Edit Profile</button>
              <button onClick={() => setShowEmailModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">Change Email</button>
              <button onClick={() => setShowPasswordModal(true)} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Change Password</button>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSuccess={fetchProfile} profile={profile} />
      <ChangeEmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} onSuccess={fetchProfile} currentEmail={profile?.email} />
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} onSuccess={() => {}} />
    </div>
  );
};

export default ProfilePage;
