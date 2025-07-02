import { useApiMutation } from '../../../hooks/useApiMutation';

type Category = { id: number; name: string };

export const useDeleteCategory = () => {
    return useApiMutation<Category, { id: number }>(
        (authFetch, { id }) => authFetch(`/api/categories/${id}/`, {
            method: 'DELETE',
        }),
        {
            getSuccessMessage: () => "Category deleted!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to delete category!'),
            invalidateQueries: (queryClient, data, variables) => {
                queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            },
        }
    );
};

