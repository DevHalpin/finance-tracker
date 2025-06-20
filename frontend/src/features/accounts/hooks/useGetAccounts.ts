import { useQuery } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

type Account = { id: number; name: string };

export const useGetAccounts = () => {
  const { authFetch } = useAuthFetch();

  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const accounts = await authFetch<Account[]>('/api/accounts/');
      return accounts ?? [];
    },
  });
};
