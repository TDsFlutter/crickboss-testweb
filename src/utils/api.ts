export const BASE_URL = 'https://crickboss.live/v2/api';

export const formatAvatarUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
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
}

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
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
    });
    return handleResponse(response);
  },

  verifyOtp: async (email: string, otp: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
  },

  login: async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  verifyLoginOtp: async (email: string, otp: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/verify-login-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(response);
  },

  resendOtp: async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  refreshToken: async (refresh_token: string): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });
    return handleResponse(response);
  },

  // ── Profile Endpoints ─────────────────────────────────────────────────────

  getMe: async (): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateMe: async (data: { name?: string; city?: string; avatar?: string }): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteMe: async (): Promise<APIResponse> => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  uploadAvatar: async (file: File): Promise<APIResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return handleResponse(response);
  },
  formatAvatarUrl,
};
