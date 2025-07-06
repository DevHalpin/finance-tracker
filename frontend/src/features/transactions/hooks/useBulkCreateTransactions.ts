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
  amount: number;
  payee: string;
  date: string;
  notes?: string;
  account: number;
  category?: number;
}

export const useBulkCreateTransactions = () => {
    return useApiMutation<Transaction[], FormValues[]>(
        (authFetch, values) => authFetch('/api/transactions/bulk-create/', {
            method: 'POST',
            body: JSON.stringify(values),
        }),
        {
            getSuccessMessage: () => "Transactions created!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to create transactions!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
            },
        }
    );
};