import { useAuth } from '@clerk/vue';

const baseUrl = import.meta.env.VITE_API_URL;

export const useAuthFetch = () => {
  const { getToken } = useAuth();

  const authFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = await getToken.value({ template: 'neon' });

    if (!token) {
      throw new Error('No token received from Clerk');
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json() as T;

  };

  return { authFetch };
};
