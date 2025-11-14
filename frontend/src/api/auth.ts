// Real API functions connecting to Django backend
const API_BASE = 'http://127.0.0.1:8000';

export const api = {
  login: async (email: string, password: string) => {
    console.log('Logging in with:', email);
    try {
      const response = await fetch(`${API_BASE}/users/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.email?.[0] || errorData.password?.[0] || 'Login failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (email: string, username: string, password: string, password_confirm: string) => {
    console.log('Signing up with:', email, username);
    try {
      const response = await fetch(`${API_BASE}/users/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, password_confirm }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = Object.values(errorData).flat().join(', ') || 'Signup failed';
        throw new Error(String(errorMsg));
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify({ email, username }));
      }
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  getDashboard: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/dashboard/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return response.json();
  },

  getASOApps: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/apps/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch ASO apps');
    return response.json();
  },

  getMarketplaceProducts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/products/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getAnalyticsSites: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/analytics/sites/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch sites');
    return response.json();
  },

  getMultilingualSummary: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/multilingual/summary/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch multilingual summary');
    return response.json();
  },

  getTenantsSummary: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/tenants/summary/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch tenants');
    return response.json();
  },

  getSocialAccounts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/accounts/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch social accounts');
    return response.json();
  },

  getSocialPosts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/posts/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch social posts');
    return response.json();
  },

  getEmailLists: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/lists/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch email lists');
    return response.json();
  },

  getEmailTemplates: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/templates/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch email templates');
    return response.json();
  },

  getMarketplaceReviews: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/reviews/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace reviews');
    return response.json();
  },

  getMarketplaceOrders: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/orders/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace orders');
    return response.json();
  },

  getMarketplaceSaved: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/saved/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch saved products');
    return response.json();
  },

  getMarketplaceConversations: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/conversations/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace conversations');
    return response.json();
  },

  getMarketplaceMessages: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/messages/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace messages');
    return response.json();
  },

  getAnalyticsPageViews: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/analytics/pageviews/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch pageviews');
    return response.json();
  },

  getASOKeywords: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/keywords/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch ASO keywords');
    return response.json();
  },

  getASOListings: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/listings/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch ASO listings');
    return response.json();
  },

  getSocialComments: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/comments/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch social comments');
    return response.json();
  },

  getSocialEngagements: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/engagement/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch social engagements');
    return response.json();
  },

  getSocialMessages: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/messages/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch social messages');
    return response.json();
  },

  getEmailContacts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/contacts/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch email contacts');
    return response.json();
  },

  getEmailSends: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/sends/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch email sends');
    return response.json();
  },

  getTenantIntegrations: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/tenants/integrations/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch tenant integrations');
    return response.json();
  },

  getSEOSites: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch SEO sites');
    return response.json();
  },

  getSEOKeywords: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/keywords/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch SEO keywords');
    return response.json();
  },

  getSEOContent: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/content/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch SEO content');
    return response.json();
  },

  // Create a new SEO site
  createSEOSite: async (data: { domain: string; sitemaps_url?: string; default_locale?: string }) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to create SEO site: ${err}`);
    }
    return response.json();
  },

  getSEOSite: async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch SEO site');
    return response.json();
  },

  updateSEOSite: async (id: number, data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to update SEO site: ${err}`);
    }
    return response.json();
  },

  deleteSEOSite: async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 204 && !response.ok) {
      const err = await response.text();
      throw new Error(`Failed to delete SEO site: ${err}`);
    }
    return true;
  },

  getUserProfile: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/users/api/profile/`, {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateUserProfile: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/users/api/profile/`, {
      method: 'PATCH',
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};
