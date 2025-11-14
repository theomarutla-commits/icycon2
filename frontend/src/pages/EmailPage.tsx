import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';
import CreateEmailTemplateModal from './email/CreateEmailTemplateModal';

const EmailPage: React.FC = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [sends, setSends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lists'|'templates'|'contacts'|'sends'>('lists');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchEmailData = async () => {
    try {
      setLoading(true);
      const [listsData, templatesData, contactsData, sendsData] = await Promise.all([
        api.getEmailLists(),
        api.getEmailTemplates(),
        api.getEmailContacts(),
        api.getEmailSends(),
      ]);

      setLists(Array.isArray(listsData) ? listsData : listsData.results || []);
      setTemplates(Array.isArray(templatesData) ? templatesData : templatesData.results || []);
      setContacts(Array.isArray(contactsData) ? contactsData : contactsData.results || []);
      setSends(Array.isArray(sendsData) ? sendsData : sendsData.results || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Email Marketing</h1>
            <p className="text-indigo-200">Manage mailing lists, templates, and campaigns.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition"
          >
            + New Template
          </button>
        </div>

        {loading && <div className="text-white">Loading email data...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['lists','templates','contacts','sends'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2 rounded font-semibold transition ${activeTab === t ? 'bg-white text-indigo-900' : 'bg-indigo-700 text-white hover:bg-indigo-600'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Lists Tab */}
        {activeTab === 'lists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div key={list.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{list.name}</h3>

                {list.description && (
                  <p className="text-gray-600 text-sm mb-4">{list.description}</p>
                )}

                <div className="space-y-3 mb-6">
                  <div className="border-b pb-3">
                    <p className="text-gray-600 text-sm">Subscribers</p>
                    <p className="text-2xl font-bold text-blue-600">{list.subscriber_count || 0}</p>
                  </div>

                  <div className="border-b pb-3">
                    <p className="text-gray-600 text-sm">Open Rate</p>
                    <p className="text-2xl font-bold text-green-600">{list.open_rate || '0%'}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded text-sm font-semibold ${
                      list.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {list.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                    Manage List
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{template.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Created: {new Date(template.created_at || template.date_created).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>

                {template.subject && (
                  <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-gray-600 text-sm font-semibold">Subject:</p>
                    <p className="text-gray-800">{template.subject}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Edit
                  </button>
                  <button className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition">
                    Preview
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {templates.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg mb-4">No templates found.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  + Create Your First Template
                </button>
              </div>
            )}
          </div>
        )}

        {((activeTab === 'lists' && lists.length === 0) || 
          (activeTab === 'templates' && templates.length === 0) ||
          (activeTab === 'contacts' && contacts.length === 0) ||
          (activeTab === 'sends' && sends.length === 0)
        ) && !loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">
              No {activeTab} found.
            </p>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Contacts</h3>
              <div className="grid gap-4">
                {contacts.map((c) => (
                  <div key={c.id} className="border border-gray-200 rounded p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{c.name || c.email}</p>
                      <p className="text-sm text-gray-600">{c.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Status: <span className={c.subscribed ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {c.subscribed ? 'Subscribed' : 'Unsubscribed'}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                        Edit
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {contacts.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No contacts yet.</p>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
                    + Import Contacts
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sends Tab */}
        {activeTab === 'sends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Email Send History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Template</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Recipient</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Sent Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sends.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-800 font-medium">{s.template_name || 'Email'}</td>
                        <td className="px-4 py-3 text-gray-700">{s.recipient_email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            s.status === 'sent' ? 'bg-green-100 text-green-800' :
                            s.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {s.status?.charAt(0).toUpperCase() + s.status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {s.sent_at ? new Date(s.sent_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sends.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No sends yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPage;
