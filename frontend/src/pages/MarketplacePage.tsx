import React, { useEffect, useState } from 'react';
import { api } from '../api/auth';
import CreateMarketplaceProductModal from './marketplace/CreateMarketplaceProductModal';
import EditMarketplaceProductModal from './marketplace/EditMarketplaceProductModal';

const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products'|'reviews'|'orders'|'saved'|'conversations'|'messages'>('products');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [productsData, reviewsData, ordersData, savedData, convosData, messagesData] = await Promise.all([
        api.getMarketplaceProducts(),
        api.getMarketplaceReviews(),
        api.getMarketplaceOrders(),
        api.getMarketplaceSaved(),
        api.getMarketplaceConversations(),
        api.getMarketplaceMessages(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : productsData.results || []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.results || []);
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.results || []);
      setSaved(Array.isArray(savedData) ? savedData : savedData.results || []);
      setConversations(Array.isArray(convosData) ? convosData : convosData.results || []);
      setMessages(Array.isArray(messagesData) ? messagesData : messagesData.results || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-blue-200">Browse and manage digital products and services.</p>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg"
            >
              + Add Product
            </button>
          )}
        </div>

        {loading && <div className="text-white">Loading marketplace data...</div>}
        {error && <div className="bg-red-500 text-white p-4 rounded">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {['products','reviews','orders','saved','conversations','messages'].map((t) => (
            <button key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-2 rounded font-semibold ${activeTab === t ? 'bg-white text-blue-900' : 'bg-blue-700 text-white hover:bg-blue-600'}`}
            >{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {/* Products Grid */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {product.featured_image && <img src={product.featured_image} alt={product.title} className="w-full h-48 object-cover" />}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.category}</p>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-2 font-semibold">{product.rating || 'N/A'}</span>
                      <span className="text-gray-600 text-sm ml-2">({product.review_count || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-green-600">
                      ${product.price || 'Contact for price'}
                    </p>
                    <p className="text-sm text-gray-600">{product.pricing_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                      Edit
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && !loading && (
              <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-lg mb-4">No products found.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  + Create Your First Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviews List */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-bold">{r.title || `${r.rating}★`}</h4>
                    <p className="text-sm text-gray-600">{r.product_title || r.product?.title}</p>
                  </div>
                  <div className="text-sm text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</div>
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-lg shadow p-4 flex justify-between">
                <div>
                  <h4 className="font-bold">Order #{o.order_number}</h4>
                  <p className="text-sm text-gray-600">{o.product_title}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${o.total_price || '0'}</div>
                  <div className="text-sm text-gray-500">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved */}
        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((s) => (
              <div key={s.id} className="bg-white rounded-lg shadow p-4">
                <h4 className="font-bold">{s.product_title}</h4>
                <p className="text-sm text-gray-600">{s.category}</p>
                <div className="mt-2 font-semibold">${s.product_price || '0'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Conversations */}
        {activeTab === 'conversations' && (
          <div className="space-y-4">
            {conversations.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{c.product_title}</h4>
                    <p className="text-sm text-gray-600">{c.buyer} → {c.seller}</p>
                  </div>
                  <div className="text-sm text-gray-500">{c.last_message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-600">From: {m.sender}</div>
                <p className="mt-2 text-gray-800">{m.content}</p>
                <div className="text-xs text-gray-500 mt-2">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <CreateMarketplaceProductModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchAll}
        />
        <EditMarketplaceProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={fetchAll}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default MarketplacePage;
