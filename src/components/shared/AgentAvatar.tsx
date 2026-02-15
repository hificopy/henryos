import { cn } from '../../lib/utils';

const modelColors: Record<string, string> = {
  'anthropic/claude-opus-4-6': 'ring-amber',
  'zai/glm-5': 'ring-status-green',
  'zai/glm-4.7-flash': 'ring-status-yellow',
};

interface AgentAvatarProps {
  name: string;
  model?: string;
  size?: 'sm' | 'md' | 'lg';
  emoji?: string;
}

export function AgentAvatar({ name, model, size = 'md', emoji }: AgentAvatarProps) {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-lg',
  };

  const ringColor = model ? modelColors[model] || 'ring-border' : 'ring-border';

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-card-hover font-medium ring-2',
        sizes[size],
        ringColor
      )}
    >
      {emoji || name.charAt(0).toUpperCase()}
    </div>
  );
}
