import { useQuery } from '@tanstack/vue-query'
import { useAuthFetch } from '../../../hooks/useAuthFetch'
import { computed, type Ref } from 'vue'

type Category = { id: number; name: string }

export const useGetCategory = (id: Ref<string | undefined>) => {
  const { authFetch } = useAuthFetch()

  return useQuery<Category>({
    enabled: computed(() => !!id.value), 
    queryKey: computed(() => ['category', id.value]), 
    queryFn: async () => {
      const category = await authFetch<Category>(`/api/categories/${id.value}/`)
      return category
    },
  })
}
