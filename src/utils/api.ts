const BASE_URL = 'http://crickboss.live/v2/api';

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
  } catch (e) {
    // If not JSON, return current text or status
    const text = await response.text();
    return { success: response.ok, message: text || `HTTP ${response.status}` };
  }

  // Normalize response structure
  const result: APIResponse<T> = {
    success: response.ok,
    message: data.message || (response.ok ? 'Success' : `Error ${response.status}`),
    ...data
  };

  // Ensure success is true if response was 2xx
  if (response.ok && result.success !== false) {
    result.success = true;
  }

  // Map access_token to token for backward compatibility with our context
  if (data.access_token && !result.token) {
    result.token = data.access_token;
  }

  // If user object is provided directly, put it in data if data is missing
  if (data.user && !result.data) {
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
};
