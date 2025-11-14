/**
 * API Configuration
 * Centralized configuration for API base URL and headers
 */

// Determine API base URL based on environment
const getApiBase = (): string => {
  // In production, use relative URLs to work with any domain
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // In development, use localhost:8000 for Django backend
  return process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';
};

export const API_BASE = getApiBase();

/**
 * Get common headers for API requests
 */
export const getCommonHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Get authenticated headers with token
 */
export const getAuthHeaders = (token?: string | null): HeadersInit => {
  const headers = getCommonHeaders();
  const authToken = token || localStorage.getItem('authToken');
  
  if (authToken) {
    return {
      ...headers,
      'Authorization': `Token ${authToken}`,
    };
  }
  
  return headers;
};

/**
 * Handle API response errors
 */
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      if (typeof errorData === 'object' && errorData !== null) {
        const messages = Object.entries(errorData)
          .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map(v => `${key}: ${v}`);
            }
            return `${key}: ${value}`;
          });
        errorMessage = messages.join('; ') || errorMessage;
      }
    } catch {
      // If response isn't JSON, use default error message
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Make an API request with common error handling
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...(options.headers || {}),
    },
  });
  
  await handleApiError(response);
  
  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json() as Promise<T>;
};
