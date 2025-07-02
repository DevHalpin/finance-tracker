import { useApiMutation } from '../../../hooks/useApiMutation';

type Category = { id: number; name: string };
interface FormValues {
    name: string;
    id: number;
}

export const useUpdateCategory = () => {
    return useApiMutation<Category, FormValues>(
        (authFetch, { id, name }) => authFetch(`/api/categories/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ name }),
        }),
        {
            getSuccessMessage: () => "Category modified!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to modify category!'),
            invalidateQueries: (queryClient, data, variables) => {
                queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            },
        }
    );
};

