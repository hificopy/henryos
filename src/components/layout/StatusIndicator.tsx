import { useGatewayStatus } from '../../hooks/useGatewayStatus';

export function StatusIndicator() {
  const { data } = useGatewayStatus();
  const connected = data?.connected ?? false;

  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span>Gateway</span>
      <div
        className={`h-2 w-2 rounded-full ${
          connected ? 'bg-status-green' : 'bg-status-red'
        }`}
      />
    </div>
  );
}
