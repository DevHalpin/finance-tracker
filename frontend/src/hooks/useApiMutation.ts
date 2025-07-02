import { useQueryClient, useMutation, type MutationOptions } from '@tanstack/vue-query';
import { useAuthFetch } from './useAuthFetch';
import { useToast } from 'vue-toastification';

const toast = useToast();

type ApiMutationOptions<TData, TVariables> = MutationOptions<TData, unknown, TVariables, unknown> & {
    getSuccessMessage?: (data: TData) => string;
    getErrorMessage?: (error: unknown) => string;
    invalidateQueries?: (queryClient: ReturnType<typeof useQueryClient>, data: TData, variables: TVariables) => void;
};

export const useApiMutation = <TData = unknown, TVariables = unknown>(
  mutationFn: (authFetch: ReturnType<typeof useAuthFetch>['authFetch'], variables: TVariables) => Promise<TData>,
  options: ApiMutationOptions<TData, TVariables> = {}
) => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: TVariables) => mutationFn(authFetch, variables),
    onSuccess: (data, variables) => {
      if (options.getSuccessMessage) {
        toast.success(options.getSuccessMessage(data));
      }
      if (options.invalidateQueries) {
        options.invalidateQueries(queryClient, data, variables);
      } else {
        queryClient.invalidateQueries({ queryKey: ['default'] });
      }
    },
    onError: (error) => {
      const message = options.getErrorMessage ? options.getErrorMessage(error) : 'An error occurred';
      toast.error(message);
    },
    ...options,
  });

  return mutation;
};