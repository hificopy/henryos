export interface Agent {
  id: string;
  name: string;
  model: {
    primary: string;
    fallbacks: string[];
  };
  workspace: string;
  tools: {
    profile?: string;
    allow: string[];
  };
  status?: 'active' | 'idle' | 'error';
}

export interface CronJob {
  id: string;
  agentId: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr: string;
    tz: string;
  };
  payload: {
    kind: string;
    message: string;
    timeoutSeconds: number;
  };
  state: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: string;
    lastError?: string;
    lastDurationMs?: number;
    consecutiveErrors?: number;
  };
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  agentCount: number;
  cost: { input: number; output: number };
}

export interface StandupMessage {
  id: string;
  agentId: string;
  agentName: string;
  content: string;
  timestamp: number;
  role: 'agent' | 'human';
}

export interface Standup {
  id: string;
  title: string;
  topic: string;
  participants: string[];
  messages: StandupMessage[];
  status: 'active' | 'completed';
  createdAt: number;
  completedAt?: number;
}

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

export type OrgRole = 'orchestrator' | 'chief' | 'agent';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  model: string;
  tier: OrgRole;
  children?: OrgNode[];
  emoji?: string;
}
