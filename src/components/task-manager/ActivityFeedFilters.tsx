import { SESSION_CATEGORIES } from '../../lib/constants';
import { useAgents } from '../../hooks/useAgents';
import type { SessionCategory } from '../../lib/types';

interface ActivityFeedFiltersProps {
  category: string;
  agent: string;
  onCategoryChange: (v: string) => void;
  onAgentChange: (v: string) => void;
}

export function ActivityFeedFilters({ category, agent, onCategoryChange, onAgentChange }: ActivityFeedFiltersProps) {
  const { data: agents } = useAgents();

  return (
    <div className="flex gap-2">
      <select
        className="input py-1.5 text-xs"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {(Object.entries(SESSION_CATEGORIES) as [SessionCategory, { label: string }][]).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select
        className="input py-1.5 text-xs"
        value={agent}
        onChange={(e) => onAgentChange(e.target.value)}
      >
        <option value="">All Agents</option>
        {(agents || []).map((a: any) => (
          <option key={a.id} value={a.id}>{a.id}</option>
        ))}
      </select>
    </div>
  );
}
