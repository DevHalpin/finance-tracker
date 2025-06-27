import { useQuery } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

type Category = { id: number; name: string };

export const useGetCategories = () => {
  const { authFetch } = useAuthFetch();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await authFetch<Category[]>('/api/categories/');
      return categories ?? [];
    },
  });
};
