import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAppStore } from '../stores/app-store';
import { useEffect } from 'react';

export function useGatewayStatus() {
  const setGatewayConnected = useAppStore((s) => s.setGatewayConnected);

  const query = useQuery({
    queryKey: ['gateway-status'],
    queryFn: api.getGatewayStatus,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (query.data) {
      setGatewayConnected(query.data.connected);
    }
  }, [query.data, setGatewayConnected]);

  return query;
}
