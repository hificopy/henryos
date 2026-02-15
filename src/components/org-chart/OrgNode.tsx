import { useNavigate } from 'react-router-dom';
import { AgentAvatar } from '../shared/AgentAvatar';
import { MODEL_TIERS } from '../../lib/constants';
import type { OrgNode as OrgNodeType } from '../../lib/types';

interface OrgNodeProps {
  node: OrgNodeType;
}

export function OrgNode({ node }: OrgNodeProps) {
  const navigate = useNavigate();
  const modelInfo = MODEL_TIERS[node.model];

  const tierStyles = {
    orchestrator: 'border-amber ring-1 ring-amber/20',
    chief: 'border-amber/50',
    agent: 'border-border',
  };

  return (
    <button
      onClick={() => navigate('/workspaces')}
      className={`card-hover flex flex-col items-center gap-2 px-5 py-4 min-w-[140px] ${tierStyles[node.tier]}`}
    >
      <AgentAvatar name={node.name} model={node.model} emoji={node.emoji} size="md" />
      <div className="text-center">
        <p className="text-sm font-semibold">{node.name}</p>
        <p className="text-[11px] text-text-secondary leading-tight">{node.role}</p>
      </div>
      {modelInfo && (
        <span
          className="badge text-[10px]"
          style={{ backgroundColor: `${modelInfo.color}15`, color: modelInfo.color }}
        >
          {modelInfo.label}
        </span>
      )}
    </button>
  );
}
