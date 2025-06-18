import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Account = { id: number; name: string };
interface FormValues {
    name: string;
}

export const useCreateAccount = () => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({name} : FormValues) => {
      const { data } = await authFetch<{ data: Account }>('/api/accounts/', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Account created!");
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create account!';
      toast.error(message);
    }
  });

  return mutation;
 
};
