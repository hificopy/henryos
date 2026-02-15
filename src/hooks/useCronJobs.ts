import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useCronJobs() {
  return useQuery({
    queryKey: ['cron-jobs'],
    queryFn: api.getCronJobs,
    refetchInterval: 60000,
  });
}
