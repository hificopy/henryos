import { Link } from 'react-router-dom';
import { DOCS_NAV } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface DocsSidebarProps {
  activeSlug: string;
}

export function DocsSidebar({ activeSlug }: DocsSidebarProps) {
  return (
    <div className="card flex h-full flex-col">
      <div className="border-b border-border px-3 py-2.5">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Documentation</h3>
      </div>
      <nav className="flex-1 overflow-auto p-2 space-y-1">
        {DOCS_NAV.map(({ slug, label }) => (
          <Link
            key={slug}
            to={`/docs/${slug}`}
            className={cn(
              'block rounded-md px-3 py-2 text-sm transition-colors',
              activeSlug === slug
                ? 'bg-card-hover text-amber'
                : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
