import { useAgents } from '../../hooks/useAgents';
import { AgentAvatar } from '../shared/AgentAvatar';
import { MODEL_TIERS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface AgentListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AgentList({ selectedId, onSelect }: AgentListProps) {
  const { data: agents, isLoading, error } = useAgents();

  return (
    <div className="card flex h-full flex-col">
      <div className="border-b border-border px-3 py-2.5">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Agents</h3>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <LoadingSpinner size={20} />
        ) : error ? (
          <div className="p-4 text-sm text-status-red">Failed to load agents</div>
        ) : (
          <div className="space-y-1">
            {(agents || []).map((agent: any) => {
              const modelInfo = MODEL_TIERS[agent.model?.primary];
              return (
                <button
                  key={agent.id}
                  onClick={() => onSelect(agent.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors',
                    selectedId === agent.id
                      ? 'bg-card-hover text-amber'
                      : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                  )}
                >
                  <AgentAvatar name={agent.name} model={agent.model?.primary} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    {modelInfo && (
                      <p className="text-[10px] truncate" style={{ color: modelInfo.color }}>
                        {modelInfo.label}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
