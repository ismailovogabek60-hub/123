/**
 * API Utilities for AJAX calls to PHP backend
 * 
 * Update the API_BASE_URL constant to point to your PHP backend server
 * Example: const API_BASE_URL = 'https://your-php-server.com/api';
 */

const API_BASE_URL = '/api';

/**
 * Fetch wrapper with automatic authentication
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('[v0] API Call:', { method: options.method || 'GET', url });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let responseData: any;
  try {
    responseData = await response.json();
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/';
      }
    }
    const errorMessage = responseData?.message || responseData?.error || response.statusText;
    console.error('[v0] API Error:', { status: response.status, message: errorMessage, data: responseData });
    throw new Error(errorMessage || `API Error: ${response.status}`);
  }

  return responseData;
}

/**
 * GET request
 */
export async function get<T>(endpoint: string): Promise<T> {
  return apiCall<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T>(endpoint: string, data: any): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put<T>(endpoint: string, data: any): Promise<T> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return apiCall<T>(endpoint, { method: 'DELETE' });
}

/**
 * File upload with automatic authentication
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();

  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload Error: ${response.statusText}`);
  }

  return response.json();
}
