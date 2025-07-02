import { useApiMutation } from '../../../hooks/useApiMutation';

type Account = { id: number; name: string };
interface FormValues {
    id: number;
    name: string;
}

export const useUpdateAccount = () => {
    return useApiMutation<Account, FormValues>(
        (authFetch, { id, name }) => authFetch(`/api/accounts/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ name }),
        }),
        {
            getSuccessMessage: () => "Account modified!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to modify account!'),
            invalidateQueries: (queryClient, data, variables) => {
                queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        }
    );
};

