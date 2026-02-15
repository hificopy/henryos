import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAppStore } from '../../stores/app-store';
import { Users, Cpu, Clock, Zap } from 'lucide-react';

export function StatsCards() {
  const { data: stats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: api.getStats,
    refetchInterval: 30000,
  });

  const gatewayConnected = useAppStore((s) => s.gatewayConnected);

  const cards = [
    { label: 'Total Agents', value: stats?.agents ?? '—', icon: Users, color: 'text-amber' },
    { label: 'Active Sessions', value: stats?.sessions ?? 0, icon: Zap, color: 'text-status-green' },
    { label: 'Cron Jobs', value: stats?.cronJobs ?? '—', icon: Clock, color: 'text-status-yellow' },
    { label: 'Gateway', value: gatewayConnected ? 'Online' : 'Offline', icon: Cpu, color: gatewayConnected ? 'text-status-green' : 'text-status-red' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs text-text-secondary">{label}</p>
              <p className="mt-1 text-xl md:text-2xl font-semibold">{value}</p>
            </div>
            <Icon size={18} className={`${color} hidden sm:block`} />
          </div>
        </div>
      ))}
    </div>
  );
}
