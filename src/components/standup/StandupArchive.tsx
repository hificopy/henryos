import { useStandups } from '../../hooks/useStandups';
import { cn, formatDate } from '../../lib/utils';
import { MessageSquare } from 'lucide-react';

interface StandupArchiveProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StandupArchive({ selectedId, onSelect }: StandupArchiveProps) {
  const { data: standups, error } = useStandups();

  if (error) {
    return (
      <div className="flex flex-col items-center py-12 text-status-red">
        <MessageSquare size={24} className="mb-2 opacity-50" />
        <p className="text-sm">Failed to load standups</p>
      </div>
    );
  }

  if (!standups || standups.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-text-secondary">
        <MessageSquare size={24} className="mb-2 opacity-50" />
        <p className="text-sm">No standups yet</p>
        <p className="text-xs mt-1">Click + to create one</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {standups.map((s: any) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={cn(
            'w-full rounded-md px-3 py-2.5 text-left transition-colors',
            selectedId === s.id
              ? 'bg-card-hover text-text-primary'
              : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
          )}
        >
          <p className="text-sm font-medium truncate">{s.title}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px]">{formatDate(s.createdAt)}</span>
            <span className={`badge text-[10px] ${s.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
              {s.status === 'active' ? 'Live' : `${s.messageCount} msgs`}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
