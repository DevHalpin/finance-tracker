import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type Account = { id: number; name: string };
interface FormValues {
    name: string;
}
export const useUpdateAccount = (getId: () => number | string) => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ name }: FormValues) => {
      const id = getId();
      const data = await authFetch<Account>(`/api/accounts/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      return data;
    },
    onSuccess: (_data) => {
      const id = _data.id
      toast.success("Account modified!");
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to modify account!';
      toast.error(message);
    }
  });

  return mutation;
};

