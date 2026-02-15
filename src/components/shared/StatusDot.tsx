import { cn } from '../../lib/utils';

interface StatusDotProps {
  status: 'success' | 'error' | 'warning' | 'idle';
  size?: 'sm' | 'md';
}

const colors = {
  success: 'bg-status-green',
  error: 'bg-status-red',
  warning: 'bg-status-yellow',
  idle: 'bg-text-secondary',
};

export function StatusDot({ status, size = 'sm' }: StatusDotProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full',
        colors[status],
        size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
      )}
    />
  );
}
