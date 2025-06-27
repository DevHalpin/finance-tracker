import { useQuery } from '@tanstack/vue-query'
import { useAuthFetch } from '../../../hooks/useAuthFetch'
import { computed, type Ref } from 'vue'

type Account = { id: number; name: string }

export const useGetAccount = (id: Ref<string | undefined>) => {
  const { authFetch } = useAuthFetch()

  return useQuery<Account>({
    enabled: computed(() => !!id.value),
    queryKey: computed(() => ['account', id.value]),
    queryFn: async () => {
      const account = await authFetch<Account>(`/api/accounts/${id.value}/`)
      return account
    },
  })
}
