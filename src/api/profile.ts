// Profile API Service
// Service layer for profile management

export interface ProfileBody {
  name: string;
  email: string;
  avatar?: string;
  birthDate: string; // ISO date string
  birthTime?: string; // HH:mm format
  country?: string;
  hobbies?: string[];
  gender?: 'male' | 'female' | 'other';
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  birthDate: string;
  birthTime?: string;
  country?: Country;
  hobbies?: Hobby[];
  gender?: 'male' | 'female' | 'other';
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Hobby {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

// API Functions
const API_BASE_URL = '/api';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const profileService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    return fetchApi<ApiResponse<ProfileResponse>>('/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (body: ProfileBody): Promise<ApiResponse<ProfileResponse>> => {
    return fetchApi<ApiResponse<ProfileResponse>>('/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      body: formData,
    });

    return response.json();
  },

  /**
   * Get countries list with search
   */
  getCountries: async (params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Country>>> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const query = searchParams.toString();
    return fetchApi<ApiResponse<PaginatedResponse<Country>>>(`/countries${query ? `?${query}` : ''}`);
  },

  /**
   * Get hobbies list with search
   */
  getHobbies: async (params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Hobby>>> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const query = searchParams.toString();
    return fetchApi<ApiResponse<PaginatedResponse<Hobby>>>(`/hobbies${query ? `?${query}` : ''}`);
  },
};

