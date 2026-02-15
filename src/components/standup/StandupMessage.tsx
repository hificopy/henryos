import { AgentAvatar } from '../shared/AgentAvatar';
import { MarkdownPreview } from '../workspaces/MarkdownPreview';
import { formatTime } from '../../lib/utils';

interface StandupMessageProps {
  message: {
    id: string;
    agentId: string;
    agentName: string;
    content: string;
    timestamp: number;
    role: 'agent' | 'human';
  };
}

export function StandupMessage({ message }: StandupMessageProps) {
  const isHuman = message.role === 'human';

  return (
    <div className="flex gap-3">
      <AgentAvatar
        name={message.agentName}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${isHuman ? 'text-amber' : 'text-text-primary'}`}>
            {message.agentName}
          </span>
          <span className="text-[10px] text-text-secondary">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="rounded-lg bg-page border border-border p-3">
          <MarkdownPreview content={message.content} />
        </div>
      </div>
    </div>
  );
}
