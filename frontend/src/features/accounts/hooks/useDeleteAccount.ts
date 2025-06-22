import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Account = { id: number; name: string };

export const useDeleteAccount = (getId: () => number | string) => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const id = getId();
      const data = await authFetch<Account>(`/api/accounts/${id}/`, {
        method: 'DELETE',
      });
      return data;
    },
    onSuccess: (_data) => {
      const id = _data.id
      toast.success("Account deleted!");
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete account!';
      toast.error(message);
    }
  });

  return mutation;
};

