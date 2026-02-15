import { useAgents } from '../../hooks/useAgents';
import { MODEL_TIERS } from '../../lib/constants';

export function ModelFleetGrid() {
  const { data: agents } = useAgents();

  const modelCounts = (agents || []).reduce((acc: Record<string, number>, agent: any) => {
    const model = agent.model?.primary || 'unknown';
    acc[model] = (acc[model] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">Model Fleet</h3>
      <div className="space-y-3">
        {Object.entries(MODEL_TIERS).map(([modelId, { label, color }]) => (
          <div key={modelId} className="flex items-center justify-between rounded-lg bg-page p-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-text-secondary">{modelId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{modelCounts[modelId] || 0}</p>
              <p className="text-xs text-text-secondary">agents</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
