import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DocsSidebar } from './DocsSidebar';
import { DocsContent } from './DocsContent';
import { ChevronLeft, List } from 'lucide-react';

export function DocsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showMobileNav, setShowMobileNav] = useState(!slug);

  useEffect(() => {
    if (!slug) navigate('/docs/overview', { replace: true });
  }, [slug, navigate]);

  useEffect(() => {
    if (slug) setShowMobileNav(false);
  }, [slug]);

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden md:flex h-[calc(100vh-8rem)] gap-4">
        <div className="w-56 shrink-0">
          <DocsSidebar activeSlug={slug || 'overview'} />
        </div>
        <div className="flex-1 min-w-0">
          <DocsContent slug={slug || 'overview'} />
        </div>
      </div>

      {/* Mobile: toggle between nav and content */}
      <div className="md:hidden h-[calc(100vh-7rem-4rem)]">
        {showMobileNav ? (
          <DocsSidebar activeSlug={slug || 'overview'} />
        ) : (
          <div className="flex h-full flex-col">
            <button
              onClick={() => setShowMobileNav(true)}
              className="flex items-center gap-1 px-2 py-2 text-xs text-amber"
            >
              <List size={14} /> All docs
            </button>
            <div className="flex-1 min-h-0">
              <DocsContent slug={slug || 'overview'} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
