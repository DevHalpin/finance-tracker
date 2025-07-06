import { useQuery } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

type Transaction = {
  id: number;
  amount: number;
  payee: string;
  date: string;
  notes: string | null;
  account: string;
  category: string | null;
};

export const useGetTransactions = () => {
  const route = useRoute();
  const { authFetch } = useAuthFetch();

  const from = computed(() => route.query.from as string | undefined);
  const to = computed(() => route.query.to as string | undefined);
  const account = computed(() => route.query.account as string | undefined);

  return useQuery<Transaction[]>({
    queryKey: ['transactions', { from, to, account }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from.value) params.append('from', from.value);
      if (to.value) params.append('to', to.value);
      if (account.value) params.append('account', account.value);

      const response = await authFetch<Transaction[]>(`/api/transactions?${params.toString()}`);
      return response ?? [];
    },
  });
};
