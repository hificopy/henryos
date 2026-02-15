import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSessions(filters?: { category?: string; agent?: string }) {
  return useQuery({
    queryKey: ['sessions', filters?.category, filters?.agent],
    queryFn: () => api.getSessions(filters),
    refetchInterval: 7000,
  });
}
