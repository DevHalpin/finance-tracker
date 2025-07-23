import { useQuery } from '@tanstack/vue-query'
import { useAuthFetch } from '../../../hooks/useAuthFetch'
import { computed, type Ref } from 'vue'

type Transaction = {
  id: string;
  amount: string;
  payee: string;
  date: string;
  notes: string | null;
  account: string;
  account_name: string;
  category: string | null;
  category_name: string | null;
};

export const useGetTransaction = (id: Ref<string | undefined>) => {
  const { authFetch } = useAuthFetch()

  return useQuery<Transaction>({
    enabled: computed(() => !!id.value),
    queryKey: computed(() => ['transaction', id.value]),
    queryFn: async () => {
      const transaction = await authFetch<Transaction>(`/api/transactions/${id.value}/`)
      console.log("Fetched transaction:", transaction)
      return transaction
    },
  })
}
