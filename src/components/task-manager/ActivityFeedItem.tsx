import { AgentAvatar } from '../shared/AgentAvatar';
import { timeAgo, truncate } from '../../lib/utils';
import { SESSION_CATEGORIES, MODEL_TIERS } from '../../lib/constants';
import { ORG_HIERARCHY } from '../../lib/constants';
import type { SessionEntry, OrgNode } from '../../lib/types';

function findNode(node: OrgNode, id: string): OrgNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
}

function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface ActivityFeedItemProps {
  session: SessionEntry;
}

export function ActivityFeedItem({ session }: ActivityFeedItemProps) {
  const node = findNode(ORG_HIERARCHY, session.agentId);
  const agentName = node?.name || session.agentId;
  const emoji = node?.emoji;
  const cat = SESSION_CATEGORIES[session.category];
  const modelInfo = MODEL_TIERS[session.model] || session.model
    ? MODEL_TIERS[session.model] || { label: session.model.split('/').pop() || session.model, color: '#888' }
    : null;

  const isRecent = Date.now() - session.updatedAt < 5 * 60 * 1000;

  return (
    <div className="flex items-center justify-between rounded-lg bg-page px-3 py-2.5 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <AgentAvatar name={agentName} model={session.model} size="sm" emoji={emoji} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{agentName}</span>
            {isRecent && (
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-green" />
            )}
            <span className={cat?.badgeClass || 'badge'}>{cat?.label || session.category}</span>
          </div>
          <p className="text-xs text-text-secondary truncate">
            {truncate(session.displayName, 60)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 text-right">
        <div className="hidden sm:block">
          <p className="text-xs text-text-secondary">{formatTokens(session.totalTokens)} tokens</p>
          {modelInfo && (
            <p className="text-[10px] font-medium" style={{ color: modelInfo.color }}>
              {modelInfo.label}
            </p>
          )}
        </div>
        <span className="text-xs text-text-secondary whitespace-nowrap">
          {timeAgo(session.updatedAt)}
        </span>
      </div>
    </div>
  );
}
