import { useApiMutation } from '../../../hooks/useApiMutation';

type Transaction = {
  id: number;
  amount: number;
  payee: string;
  date: string;
  notes: string | null;
  account: string;
  category: string | null;
};

interface FormValues {
  id: number;
  amount?: number;
  payee?: string;
  date?: string;
  notes?: string;
  account?: number;
  category?: number;
}

export const useUpdateTransaction = () => {
    return useApiMutation<Transaction, FormValues>(
        (authFetch, { id, ...values }) => authFetch(`/api/transactions/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(values),
        }),
        {
            getSuccessMessage: () => "Transaction updated!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to update transaction!'),
            invalidateQueries: (queryClient, data, variables) => {
                queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
            },
        }
    );
};

