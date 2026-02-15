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
