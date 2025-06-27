import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Category = { id: number; name: string };
interface FormValues {
    ids: number[];
}

export const useBulkDeleteCategories = () => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ids} : FormValues) => {
      const { data } = await authFetch<{ data: Category }>('/api/categories/bulk-delete/', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Categories deleted!");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete categories!';
      toast.error(message);
    }
  });

  return mutation;
 
};
