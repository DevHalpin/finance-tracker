import { useApiMutation } from '../../../hooks/useApiMutation';

type Category = { id: number; name: string };
interface FormValues {
    name: string;
}

export const useCreateCategory = () => {
    return useApiMutation<Category, FormValues>(
        (authFetch, { name }) => authFetch('/api/categories/', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }),
        {
            getSuccessMessage: () => "Category created!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to create Category!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            },
        }
    );
};
