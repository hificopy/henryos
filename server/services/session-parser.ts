export type SessionCategory = 'cron-run' | 'cron' | 'discord' | 'conversation' | 'henry-os' | 'other';

export interface SessionEntry {
  key: string;
  agentId: string;
  category: SessionCategory;
  categoryLabel: string;
  updatedAt: number;
  displayName: string;
  totalTokens: number;
  model: string;
  modelProvider: string;
  abortedLastRun: boolean;
}

const CATEGORY_LABELS: Record<SessionCategory, string> = {
  'cron-run': 'Cron Run',
  'cron': 'Cron Job',
  'discord': 'Discord',
  'conversation': 'Conversation',
  'henry-os': 'Henry OS',
  'other': 'Other',
};

function parseSessionKey(key: string): { agentId: string; category: SessionCategory } {
  const parts = key.split(':');
  // Expected format: agent:<agentId>:<context>...
  const agentId = parts[1] || 'unknown';

  if (/^agent:[^:]+:cron:[^:]+:run:/.test(key)) {
    return { agentId, category: 'cron-run' };
  }
  if (/^agent:[^:]+:cron:/.test(key)) {
    return { agentId, category: 'cron' };
  }

  const context = parts[2];
  switch (context) {
    case 'discord': return { agentId, category: 'discord' };
    case 'main': return { agentId, category: 'conversation' };
    case 'henry-os': return { agentId, category: 'henry-os' };
    default: return { agentId, category: 'other' };
  }
}

export function parseSessions(raw: any[]): SessionEntry[] {
  return raw.map((s) => {
    const { agentId, category } = parseSessionKey(s.key || '');
    return {
      key: s.key,
      agentId,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      updatedAt: s.updatedAt,
      displayName: s.displayName || s.label || s.key,
      totalTokens: s.totalTokens || 0,
      model: s.model || '',
      modelProvider: s.modelProvider || '',
      abortedLastRun: s.abortedLastRun || false,
    };
  });
}
