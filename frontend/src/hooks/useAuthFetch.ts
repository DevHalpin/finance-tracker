import { useAuth0 } from '@auth0/auth0-vue';

const baseUrl = import.meta.env.VITE_API_URL;

export const useAuthFetch = () => {
  const { getAccessTokenSilently } = useAuth0();

  const authFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
    

      if (!token) {
        throw new Error('No token received from Auth0');
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
    }
    catch (error) {
      console.error(error);
      throw error;
    }
    

  };

  return { authFetch };
};
