import { useQuery } from '@tanstack/vue-query';

const baseUrl = import.meta.env.VITE_API_URL

type Account = {
  id: number;
  name: string;
};

export const useGetAccounts = () => {
  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/accounts/`);

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const { data }  = await response.json() as { data: Account[] };
      return data;
    }
  });
};
