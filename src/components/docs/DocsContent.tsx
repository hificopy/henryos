import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { MarkdownPreview } from '../workspaces/MarkdownPreview';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { BookOpen } from 'lucide-react';

interface DocsContentProps {
  slug: string;
}

export function DocsContent({ slug }: DocsContentProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['docs', slug],
    queryFn: () => api.getDoc(slug),
    enabled: !!slug,
  });

  if (isLoading) return <div className="card flex h-full items-center justify-center"><LoadingSpinner /></div>;

  if (error) {
    return (
      <div className="card flex h-full items-center justify-center">
        <div className="text-center text-text-secondary">
          <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Documentation not found</p>
          <p className="text-xs mt-1">This page hasn't been written yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full overflow-auto p-6">
      {data?.title && (
        <h1 className="text-2xl font-bold mb-6 pb-4 border-b border-border">{data.title}</h1>
      )}
      <MarkdownPreview content={data?.content || ''} />
    </div>
  );
}
