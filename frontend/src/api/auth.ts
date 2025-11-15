// Real API functions connecting to Django backend
import { API_BASE, apiRequest, getAuthHeaders } from '../config/api';

export const api = {
  login: async (email: string, password: string) => {
    console.log('Logging in with:', email);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for CSRF
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
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, password_confirm }),
        credentials: 'include', // Include cookies for CSRF
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
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return response.json();
  },

  getASOApps: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/apps/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch ASO apps');
    return response.json();
  },

  getMarketplaceProducts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/products/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getAnalyticsSites: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/analytics/sites/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch sites');
    return response.json();
  },

  getMultilingualSummary: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/multilingual/summary/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch multilingual summary');
    return response.json();
  },

  getTenantsSummary: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/tenants/summary/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch tenants');
    return response.json();
  },

  getSocialAccounts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/accounts/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch social accounts');
    return response.json();
  },

  getSocialPosts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/posts/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch social posts');
    return response.json();
  },

  getEmailLists: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/lists/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch email lists');
    return response.json();
  },

  getEmailTemplates: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/templates/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch email templates');
    return response.json();
  },

  getMarketplaceReviews: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/reviews/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace reviews');
    return response.json();
  },

  getMarketplaceOrders: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/orders/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace orders');
    return response.json();
  },

  getMarketplaceSaved: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/saved/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch saved products');
    return response.json();
  },

  getMarketplaceConversations: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/conversations/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace conversations');
    return response.json();
  },

  getMarketplaceMessages: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/messages/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace messages');
    return response.json();
  },

  getAnalyticsPageViews: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/analytics/pageviews/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch pageviews');
    return response.json();
  },

  // Export analytics (CSV/JSON) given optional start/end dates
  exportAnalytics: async (data: { start_date?: string; end_date?: string; format?: string }) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/analytics/export/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => null);
      throw new Error(txt || 'Failed to export analytics');
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    // Fallback to blob (csv, zip, etc.)
    const blob = await response.blob();
    return blob;
  },

  getASOKeywords: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/keywords/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch ASO keywords');
    return response.json();
  },

  getASOListings: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/listings/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch ASO listings');
    return response.json();
  },

  getSocialComments: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/comments/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch social comments');
    return response.json();
  },

  getSocialEngagements: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/engagement/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch social engagements');
    return response.json();
  },

  getSocialMessages: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/messages/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch social messages');
    return response.json();
  },

  getEmailContacts: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/contacts/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch email contacts');
    return response.json();
  },

  getEmailSends: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/sends/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch email sends');
    return response.json();
  },

  getTenantIntegrations: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/tenants/integrations/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch tenant integrations');
    return response.json();
  },

  getSEOSites: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch SEO sites');
    return response.json();
  },

  getSEOKeywords: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/keywords/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch SEO keywords');
    return response.json();
  },

  getSEOContent: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/content/`, {
      headers: getAuthHeaders(token),
      credentials: 'include',
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
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
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
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch SEO site');
    return response.json();
  },

  updateSEOSite: async (id: number, data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/seo/sites/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
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
      headers: getAuthHeaders(token),
      credentials: 'include',
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
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateUserProfile: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/users/api/profile/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Upload profile avatar. Accepts a File object and returns an object with avatar_url
  uploadProfileAvatar: async (file: File) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const form = new FormData();
    form.append('avatar', file);

    const response = await fetch(`${API_BASE}/users/api/profile/avatar/`, {
      method: 'POST',
      // Note: Do not set Content-Type for FormData; browser will add boundary
      headers: getAuthHeaders(token),
      body: form,
      credentials: 'include',
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => null);
      throw new Error(txt || 'Failed to upload avatar');
    }

    return response.json();
  },

  changeEmail: async (newEmail: string, password: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/users/api/change-email/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ new_email: newEmail, password }),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to change email');
    }
    return response.json();
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/users/api/change-password/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || 'Failed to change password');
    }
    return response.json();
  },

  // ASO Operations
  createASOApp: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/apps/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create app');
    return response.json();
  },

  updateASOApp: async (id: number, data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/apps/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update app');
    return response.json();
  },

  deleteASOApp: async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/aso/apps/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (response.status !== 204 && !response.ok) throw new Error('Failed to delete app');
    return true;
  },

  // Email Operations
  createEmailTemplate: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/templates/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  },

  updateEmailTemplate: async (id: number, data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/templates/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  },

  deleteEmailTemplate: async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/templates/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (response.status !== 204 && !response.ok) throw new Error('Failed to delete template');
    return true;
  },

  createEmailList: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/email/lists/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create list');
    return response.json();
  },

  // Marketplace Operations
  createMarketplaceProduct: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/products/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  updateMarketplaceProduct: async (id: number, data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/products/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  deleteMarketplaceProduct: async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/marketplace/products/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (response.status !== 204 && !response.ok) throw new Error('Failed to delete product');
    return true;
  },

  // Social Media Operations
  createSocialPost: async (data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/posts/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  updateSocialPost: async (id: number, data: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/posts/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  deleteSocialPost: async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${API_BASE}/api/social/posts/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (response.status !== 204 && !response.ok) throw new Error('Failed to delete post');
    return true;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

