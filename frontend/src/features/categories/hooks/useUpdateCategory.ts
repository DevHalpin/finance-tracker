import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Category = { id: number; name: string };
interface FormValues {
    name: string;
    id: number;
}
export const useUpdateCategory = () => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, name }: FormValues) => {
      const data = await authFetch<Category>(`/api/categories/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      return data;
    },
    onSuccess: (_data) => {
      const id = _data.id
      toast.success("Category modified!");
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to modify category!';
      toast.error(message);
    }
  });

  return mutation;
};

