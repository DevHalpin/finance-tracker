import { useApiMutation } from '../../../hooks/useApiMutation';

type Transaction = { id: number };

export const useDeleteTransaction = () => {
    return useApiMutation<Transaction, { id: number }>(
        (authFetch, { id }) => authFetch(`/api/transactions/${id}/`, {
            method: 'DELETE',
        }),
        {
            getSuccessMessage: () => "Transaction deleted!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to delete transaction!'),
            invalidateQueries: (queryClient, data, variables) => {
                queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
            },
        }
    );
};

