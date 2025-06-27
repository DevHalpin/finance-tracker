import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Category = { id: number; name: string };

export const useDeleteCategory = () => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({id}: { id: number }) => {
      const data = await authFetch<Category>(`/api/categories/${id}/`, {
        method: 'DELETE',
      });
      return data;
    },
    onSuccess: (_data) => {
      const id = _data.id
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete category!';
      toast.error(message);
    }
  });

  return mutation;
};

