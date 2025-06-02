import { useQuery } from '@tanstack/vue-query';
import { useAuthFetch } from '../authFetch';

type Account = { id: number; name: string };

export const useGetAccounts = () => {
  const { authFetch } = useAuthFetch();

  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await authFetch<{ data: Account[] }>('/api/accounts/');
      return data;
    },
  });
};
