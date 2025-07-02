import { useApiMutation } from '../../../hooks/useApiMutation';

interface FormValues {
    ids: number[];
}

export const useBulkDeleteAccounts = () => {
    return useApiMutation<unknown, FormValues>(
        (authFetch, { ids }) => authFetch('/api/accounts/bulk-delete/', {
            method: 'POST',
            body: JSON.stringify({ ids }),
        }),
        {
            getSuccessMessage: () => "Accounts deleted!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to delete accounts!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        }
    );
};
