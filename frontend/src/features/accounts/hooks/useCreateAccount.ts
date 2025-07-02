import { useApiMutation } from '../../../hooks/useApiMutation';

type Account = { id: number; name: string };
interface FormValues {
    name: string;
}

export const useCreateAccount = () => {
    return useApiMutation<Account, FormValues>(
        (authFetch, { name }) => authFetch('/api/accounts/', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),
        {
            getSuccessMessage: () => "Account created!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to create account!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        }
    );
};
