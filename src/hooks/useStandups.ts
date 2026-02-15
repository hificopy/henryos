import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useStandups() {
  return useQuery({
    queryKey: ['standups'],
    queryFn: api.getStandups,
  });
}

export function useStandup(id: string) {
  return useQuery({
    queryKey: ['standups', id],
    queryFn: () => api.getStandup(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'active' ? 3000 : false;
    },
  });
}

export function useCreateStandup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createStandup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standups'] });
    },
  });
}
