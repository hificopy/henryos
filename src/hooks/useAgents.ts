import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: api.getAgents,
  });
}

export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agents', id],
    queryFn: () => api.getAgent(id),
    enabled: !!id,
  });
}
