import { useApiMutation } from '../../../hooks/useApiMutation';

interface FormValues {
    ids: number[];
}

export const useBulkDeleteCategories = () => {
    return useApiMutation<unknown, FormValues>(
        (authFetch, { ids }) => authFetch('/api/categories/bulk-delete/', {
            method: 'POST',
            body: JSON.stringify({ ids }),
        }),
        {
            getSuccessMessage: () => "Categories deleted!",
            getErrorMessage: (error) => (error instanceof Error ? error.message : 'Failed to delete categories!'),
            invalidateQueries: (queryClient) => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            },
        }
    );
};
