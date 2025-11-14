import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';

const EmailPage: React.FC = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [sends, setSends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lists'|'templates'|'contacts'|'sends'>('lists');

  useEffect(() => {
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

    fetchEmailData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Email Marketing</h1>
        <p className="text-indigo-200 mb-8">Manage mailing lists, templates, and campaigns.</p>

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

                <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
                  Manage List
                </button>
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
                </div>
              </div>
            ))}
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
          <div className="space-y-4">
            {contacts.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{c.name || c.email}</h4>
                    <p className="text-sm text-gray-600">{c.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">Subscribed: {c.subscribed ? 'Yes' : 'No'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sends Tab */}
        {activeTab === 'sends' && (
          <div className="space-y-4">
            {sends.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{s.template_name || 'Email'}</h4>
                    <p className="text-sm text-gray-600">To: {s.recipient_email}</p>
                  </div>
                  <div className="text-sm text-gray-500">{s.status}</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Sent: {s.sent_at ? new Date(s.sent_at).toLocaleString() : 'N/A'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPage;
