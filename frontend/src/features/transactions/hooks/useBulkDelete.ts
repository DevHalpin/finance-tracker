import { useApiMutation } from '../../../hooks/useApiMutation';

interface FormValues {
    ids: number[];
}

export const useBulkDeleteTransactions = () => {
    return useApiMutation<unknown, FormValues>(
        (authFetch, { ids }) => authFetch('/api/transactions/bulk-delete/', {
            method: 'POST',
            body: JSON.stringify({ ids }),
        }),
        {
            getSuccessMessage: () => "Transactions deleted!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to delete transactions!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
            },
        }
    );
};
