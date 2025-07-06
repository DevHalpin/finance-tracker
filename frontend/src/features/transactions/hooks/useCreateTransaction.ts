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
  account: string;
  category?: string;
}

export const useCreateTransaction = () => {
    return useApiMutation<Transaction, FormValues>(
        (authFetch, values) => authFetch('/api/transactions/', {
            method: 'POST',
            body: JSON.stringify(values),
        }),
        {
            getSuccessMessage: () => "Transaction created!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to create transaction!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
            },
        }
    );
};
