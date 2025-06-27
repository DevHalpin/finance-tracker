import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Category = { id: number; name: string };
interface FormValues {
    name: string;
}

export const useCreateCategory = () => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({name} : FormValues) => {
      const { data } = await authFetch<{ data: Category }>('/api/categories/', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Category created!");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create Category!';
      toast.error(message);
    }
  });

  return mutation;
 
};
