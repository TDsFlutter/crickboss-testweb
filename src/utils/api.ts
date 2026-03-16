const BASE_URL = 'http://crickboss.live/v2/api';

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  refresh_token?: string;
}

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  const data = await response.json();
  // If HTTP status indicates error but backend didn't set success:false, patch it
  if (!response.ok && data.success === undefined) {
    return { success: false, message: data.message || `HTTP ${response.status}` };
  }
  return data;
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

  register: async (data: { name: string; email: string; city: string }): Promise<APIResponse> => {
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
