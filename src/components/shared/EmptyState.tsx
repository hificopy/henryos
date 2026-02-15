import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={40} className="mb-4 text-text-secondary/50" />
      <h3 className="text-lg font-medium text-text-secondary">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-text-secondary/70">{description}</p>
      )}
    </div>
  );
}
