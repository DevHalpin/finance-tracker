import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Account = { id: number; name: string };
interface FormValues {
    ids: string[];
}

export const useBulkDeleteAccounts = () => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ids} : FormValues) => {
      const { data } = await authFetch<{ data: Account }>('/api/accounts/bulk-delete/', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Accounts deleted!");
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete accounts!';
      toast.error(message);
    }
  });

  return mutation;
 
};
