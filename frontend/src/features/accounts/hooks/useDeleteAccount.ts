import { useApiMutation } from '../../../hooks/useApiMutation';

type Account = { id: number; name: string };

export const useDeleteAccount = () => {
    return useApiMutation<Account, { id: number }>(
        (authFetch, { id }) => authFetch(`/api/accounts/${id}/`, {
            method: 'DELETE',
        }),
        {
            getSuccessMessage: () => "Account deleted!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to delete account!'),
            invalidateQueries: (queryClient, data, variables) => {
                queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        }
    );
};

