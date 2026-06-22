import { API_BASE_URL, API_CONFIG } from './config';

interface ApiError {
  error: boolean;
  code: number;
  message: string;
}

export class ApiClientError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
  }
}

// In the future, this should pull from Clerk or your Auth provider
export const getAuthToken = async (): Promise<string | null> => {
  // return await window.Clerk?.session?.getToken();
  return null; 
};

export const fetchClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = await getAuthToken();
  const headers = new Headers({
    ...API_CONFIG.headers,
    ...options.headers,
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    try {
      const errorData: ApiError = await response.json();
      throw new ApiClientError(errorData.message, errorData.code);
    } catch (e) {
      if (e instanceof ApiClientError) throw e;
      throw new ApiClientError(response.statusText || 'An error occurred', response.status);
    }
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
