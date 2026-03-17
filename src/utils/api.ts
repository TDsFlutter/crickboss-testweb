export const BASE_URL = 'https://crickboss.live/v2/api';

export const formatAvatarUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Strip leading /api if BASE_URL already ends with /api
  const cleanedUrl = url.startsWith('/api') ? url.slice(4) : url;
  const separator = (cleanedUrl.startsWith('/') || BASE_URL.endsWith('/')) ? '' : '/';
  
  return `${BASE_URL}${separator}${cleanedUrl}`;
};

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;         // mapped from access_token
  access_token?: string;  // direct from backend
  refresh_token?: string;
  token_type?: string;
  user?: any;             // direct from backend
  [key: string]: any;     // Allow additional fields at the root level like email
}

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  const headers: any = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  let data: any;
  try {
    data = await response.json();
  } catch {
    // Body is already consumed or not JSON — return a safe fallback
    return { success: response.ok, message: response.ok ? 'Success' : `HTTP ${response.status}` };
  }

  // Normalize response structure — spread backend data, override success from HTTP status
  const result: APIResponse<T> = {
    success: response.ok,
    message: data?.message || (response.ok ? 'Success' : `Error ${response.status}`),
    ...data,
  };

  // Force success=true on 2xx (in case backend omits it)
  if (response.ok && result.success !== false) {
    result.success = true;
  }
  // Force success=false on non-2xx (even if backend says success:true)
  if (!response.ok) {
    result.success = false;
  }

  // Map access_token → token for backward compat
  if (data?.access_token && !result.token) {
    result.token = data.access_token;
  }

  // If backend sends user directly at root, promote to data
  if (data?.user && !result.data) {
    result.data = data.user;
  }

  return result;
}

export const api = {
  // ── Auth Endpoints ────────────────────────────────────────────────────────

  checkEmail: async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  register: async (data: { 
    name: string; 
    email: string; 
    city: string;
    mobile: string;
    country_code: string;
  }): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  verifyOtp: async (email: string, otp: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  login: async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  verifyLoginOtp: async (email: string, otp: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/verify-login-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  resendOtp: async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  refreshToken: async (refresh_token?: string): Promise<APIResponse> => {
    const body = refresh_token ? JSON.stringify({ refresh_token }) : undefined;
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body,
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  logout: async (): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // ── Profile Endpoints ─────────────────────────────────────────────────────

  getMe: async (): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  updateMe: async (data: { name?: string; city?: string; avatar?: string }): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  deleteMe: async (): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  uploadAvatar: async (file: File): Promise<APIResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: {},
      body: formData,
      credentials: 'include',
    });
    return handleResponse(response);
  },
  formatAvatarUrl,
};
